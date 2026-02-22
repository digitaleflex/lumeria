import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { BrevoClient } from "@getbrevo/brevo";
import { db } from "./db";
import { magicLinkAttempts } from "./schema";
import { eq, and, gte, sql } from "drizzle-orm";

// Initialize Brevo API client
const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || "",
});

// Rate limiting constants
const MAX_ATTEMPTS_PER_HOUR = 3;
const COOLDOWN_SECONDS = 60;

// Type for attempt
interface MagicLinkAttempt {
  id: string;
  email: string;
  ipAddress: string | null;
  createdAt: Date;
  attempts: number;
  lastAttemptAt: Date;
}

// Check and update rate limiting
async function checkRateLimit(email: string): Promise<{ allowed: boolean; remainingAttempts: number; nextAttemptAt?: Date }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Get attempts in the last hour
  const attempts = await db
    .select()
    .from(magicLinkAttempts)
    .where(
      and(
        eq(magicLinkAttempts.email, email),
        gte(magicLinkAttempts.createdAt, oneHourAgo)
      )
    ) as MagicLinkAttempt[];

  const totalAttempts = attempts.reduce((sum: number, a: MagicLinkAttempt) => sum + a.attempts, 0);

  if (totalAttempts >= MAX_ATTEMPTS_PER_HOUR) {
    const oldestAttempt = attempts[0];
    return {
      allowed: false,
      remainingAttempts: 0,
      nextAttemptAt: new Date(oldestAttempt.createdAt.getTime() + 60 * 60 * 1000)
    };
  }

  // Check cooldown (60 seconds between attempts)
  const recentAttempt = attempts.find((a: MagicLinkAttempt) =>
    new Date(a.lastAttemptAt).getTime() > Date.now() - COOLDOWN_SECONDS * 1000
  );

  if (recentAttempt) {
    return {
      allowed: false,
      remainingAttempts: MAX_ATTEMPTS_PER_HOUR - totalAttempts,
      nextAttemptAt: new Date(new Date(recentAttempt.lastAttemptAt).getTime() + COOLDOWN_SECONDS * 1000)
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS_PER_HOUR - totalAttempts
  };
}

// Record a magic link attempt
async function recordAttempt(email: string, ipAddress?: string): Promise<void> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Check if there's an existing record in the last hour
  const existing = await db
    .select()
    .from(magicLinkAttempts)
    .where(
      and(
        eq(magicLinkAttempts.email, email),
        gte(magicLinkAttempts.createdAt, oneHourAgo)
      )
    )
    .limit(1) as MagicLinkAttempt[];

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(magicLinkAttempts)
      .set({
        attempts: sql`${magicLinkAttempts.attempts} + 1`,
        lastAttemptAt: new Date(),
        ipAddress: ipAddress || existing[0].ipAddress
      })
      .where(eq(magicLinkAttempts.id, existing[0].id));
  } else {
    // Create new record
    await db.insert(magicLinkAttempts).values({
      id: crypto.randomUUID(),
      email,
      ipAddress: ipAddress || null,
      attempts: 1,
      lastAttemptAt: new Date(),
      createdAt: new Date()
    });
  }
}

// Send email via Brevo
async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "Lumiera",
      email: "eurin@eurinhash.com"
    },
    to: [{ email }],
    subject: "Votre lien de connexion Lumiera",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6366f1; font-size: 28px; margin: 0;">Lumiera</h1>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Connexion sans mot de passe</h2>
          <p style="color: #6b7280; margin-bottom: 25px;">
            Cliquez sur le bouton ci-dessous pour vous connecter à votre compte.
            <br>Ce lien expire dans <strong>10 minutes</strong>.
          </p>
          
          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Se connecter
          </a>
          
          <p style="color: #9ca3af; font-size: 13px; margin-top: 25px;">
            Si vous n'avez pas demandé ce lien, ignorez simplement cet email.
          </p>
        </div>
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 30px;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
          <a href="${url}" style="color: #6366f1; word-break: break-all;">${url}</a>
        </p>
      </div>
    `
  });
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Check rate limit
        const rateCheck = await checkRateLimit(email);

        if (!rateCheck.allowed) {
          throw new Error(
            rateCheck.nextAttemptAt
              ? `Veuillez attendre avant de demander un nouveau lien. Réessayez après ${rateCheck.nextAttemptAt.toLocaleTimeString()}.`
              : "Trop de tentatives. Veuillez réessayer dans une heure."
          );
        }

        // Record the attempt
        await recordAttempt(email);

        // Send the email
        await sendMagicLinkEmail(email, url);
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "your-super-secret-key-change-in-production-min-32-chars",
});

export type Auth = typeof auth;
export { checkRateLimit, MAX_ATTEMPTS_PER_HOUR, COOLDOWN_SECONDS };
