import { db } from "./db";
import { categories, products, blogPosts, user } from "./schema";
import { mockCategories, mockProducts, mockBlogPosts } from "../mocks";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Seed categories
    console.log("📦 Seeding categories...");
    for (const cat of mockCategories) {
      await db.insert(categories).values(cat).onConflictDoNothing();
    }

    // Seed products
    console.log("🛍️ Seeding products...");
    for (const prod of mockProducts) {
      const { category, ...productData } = prod;
      await db.insert(products).values(productData).onConflictDoNothing();
    }

    // Seed blog posts
    console.log("📝 Seeding blog posts...");
    for (const post of mockBlogPosts) {
      await db.insert(blogPosts).values(post).onConflictDoNothing();
    }

    // Seed admin users
    console.log("👤 Seeding admin users...");
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
    for (const email of adminEmails) {
      await db.insert(user).values({
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        emailVerified: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed();
