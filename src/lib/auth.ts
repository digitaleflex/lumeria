import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "./db";
import { user } from "./schema";
import { eq } from "drizzle-orm";

// Récupérer les emails admin depuis les variables d'environnement
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
const EMAIL_SENDER = process.env.EMAIL_SENDER || '';

// Send email via Brevo SMTP (bypasses IP restriction)
async function sendMagicLinkEmail(email: string, url: string): Promise<void> {
  console.log("📧 Sending magic link to:", email);
  
  try {
    const nodemailer = await import('nodemailer');
    
    // Create SMTP transporter for Brevo
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_SENDER,
        pass: process.env.SMTP_PASSWORD || process.env.BREVO_API_KEY,
      },
    });

    await transporter.sendMail({
      from: `"Lumora" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: 'Votre lien de connexion - Lumora',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000;">Bienvenue sur Lumora !</h2>
          <p style="font-size: 16px; color: #333;">Cliquez sur le bouton ci-dessous pour vous connecter :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="display: inline-block; padding: 14px 28px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
              Se connecter
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Ce lien expire dans 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé ce lien, ignorez cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">Lumora - Votre boutique beauté</p>
        </div>
      `,
    });
    console.log("✅ Email sent successfully to:", email);
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.message || error);
    if (error.code === 'EAUTH') {
      console.error("⚠️  Erreur d'authentification SMTP. Vérifie tes identifiants SMTP dans .env");
      console.error("    Utilise ton email Brevo comme SMTP_USER");
      console.error("    Génère un mot de passe SMTP ici: https://app.brevo.com/settings/keys/smtp");
    }
    // Don't throw - always succeed
  }
}

console.log("🔐 Initializing Better Auth...");
console.log("👥 Admins configurés:", ADMIN_EMAILS.length, "email(s)");
console.log("📧 Email expéditeur:", EMAIL_SENDER);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("🔑 Magic link request for:", email);

        // Remplacer l'URL backend par l'URL frontend
        const frontendUrl = url.replace(
          process.env.BETTER_AUTH_URL || "http://localhost:3001",
          process.env.FRONTEND_URL || "http://localhost:5173"
        );

        // Déterminer le rôle basé sur l'email
        const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
        
        // Vérifier si l'utilisateur existe
        const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
        
        if (existingUser.length === 0) {
          // Créer automatiquement le compte avec le bon rôle
          await db.insert(user).values({
            id: crypto.randomUUID(),
            name: email.split('@')[0],
            email,
            emailVerified: false,
            role: isAdmin ? 'admin' : 'user',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          console.log(`✅ Compte créé: ${email} (${isAdmin ? 'admin' : 'client'})`);
        } else if (existingUser[0].role !== (isAdmin ? 'admin' : 'user')) {
          // Mettre à jour le rôle si nécessaire
          await db.update(user).set({ role: isAdmin ? 'admin' : 'user' }).where(eq(user.email, email));
          console.log(`✅ Rôle mis à jour: ${email} -> ${isAdmin ? 'admin' : 'client'}`);
        }

        // Envoyer l'email avec l'URL frontend
        await sendMagicLinkEmail(email, frontendUrl);
      },
      expiresIn: 60 * 10, // 10 minutes
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
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
