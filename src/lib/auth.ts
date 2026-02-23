import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "./db";
import { magicLinkAttempts } from "./schema";
import { eq, and, gte, sql } from "drizzle-orm";

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

// Send email via console log for development
async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  console.log("📧 Magic link for", email, ":", url);
  // In production, integrate with Brevo or another email service
}

console.log("🔐 Initializing Better Auth...");

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("🔑 Magic link request for:", email);

        // Check rate limit - Skip for admin emails
        const adminEmails = ['admin@lumora.com', 'eurin@eurinhash.com', 'eflexcloud@gmail.com', 'agueoundev@gmail.com'];
        const isAdmin = adminEmails.includes(email.toLowerCase());

        if (!isAdmin) {
          const rateCheck = await checkRateLimit(email);
          if (!rateCheck.allowed) {
            throw new Error(
              rateCheck.nextAttemptAt
                ? `Veuillez attendre avant de demander un nouveau lien. Réessayez après ${rateCheck.nextAttemptAt.toLocaleTimeString()}.`
                : "Trop de tentatives. Veuillez réessayer dans une heure."
            );
          }
          // Record the attempt for non-admins
          await recordAttempt(email);
        }

        // Send the email
        await sendMagicLinkEmail(email, url);
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days - session lasts 1 week
    updateAge: 60 * 60 * 24, // 1 day
  },
  socialProviders: {
    google: {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
  secret: process.env.BETTER_AUTH_SECRET || "your-super-secret-key-change-in-production-min-32-chars",
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL || "http://localhost:5173",
  ],
});

console.log("✅ Better Auth initialized successfully");

export type Auth = typeof auth;
export { checkRateLimit, MAX_ATTEMPTS_PER_HOUR, COOLDOWN_SECONDS };
