import { pgTable, text, timestamp, boolean, integer, real } from "drizzle-orm/pg-core";

// Better Auth required tables
export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: text("role").notNull().default("user"), // 'admin' | 'user'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Magic Link rate limiting table
export const magicLinkAttempts = pgTable("magic_link_attempts", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    attempts: integer("attempts").notNull().default(1),
    lastAttemptAt: timestamp("last_attempt_at").notNull().defaultNow(),
});

// E-commerce & Blog Tables
export const categories = pgTable("categories", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nameFr: text("name_fr").notNull(),
    description: text("description").notNull(),
    descriptionFr: text("description_fr").notNull(),
    image: text("image").notNull(),
    productCount: integer("product_count").notNull().default(0),
});

export const products = pgTable("products", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nameFr: text("name_fr").notNull(),
    description: text("description").notNull(),
    descriptionFr: text("description_fr").notNull(),
    price: integer("price").notNull(), // using integer for cents
    originalPrice: integer("original_price"),
    image: text("image").notNull(),
    images: text("images").array().notNull(),
    categoryId: text("category_id")
        .notNull()
        .references(() => categories.id, { onDelete: "cascade" }),
    skinTypes: text("skin_types").array().notNull(), // array of enums/strings
    rating: real("rating").notNull().default(0), // Can use real/decimal
    reviewCount: integer("review_count").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isBestseller: boolean("is_bestseller").notNull().default(false),
    affiliateUrl: text("affiliate_url").notNull(),
    brand: text("brand").notNull(),
    ingredients: text("ingredients").array().notNull(),
    ingredientsFr: text("ingredients_fr").array().notNull(),
    howToUse: text("how_to_use").notNull(),
    howToUseFr: text("how_to_use_fr").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    titleFr: text("title_fr").notNull(),
    excerpt: text("excerpt").notNull(),
    excerptFr: text("excerpt_fr").notNull(),
    content: text("content").notNull(),
    contentFr: text("content_fr").notNull(),
    coverImage: text("cover_image").notNull(),
    author: text("author").notNull(),
    tags: text("tags").array().notNull(),
    publishedAt: timestamp("published_at").notNull(),
    readTime: integer("read_time").notNull(),
    status: text("status").notNull(), // 'draft' | 'published'
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const affiliateClicks = pgTable("affiliate_clicks", {
    id: text("id").primaryKey(),
    productId: text("product_id").notNull(),
    productName: text("product_name").notNull(),
    userId: text("user_id"),
    userEmail: text("user_email"),
    country: text("country"),
    device: text("device"),
    source: text("source"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmCampaign: text("utm_campaign"),
    clickedAt: timestamp("clicked_at").notNull().defaultNow(),
});

// Cart tables
export const carts = pgTable("carts", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
    id: text("id").primaryKey(),
    cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    addedAt: timestamp("added_at").notNull().defaultNow(),
});

// Wishlist tables
export const wishlistItems = pgTable("wishlist_items", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").notNull().defaultNow(),
});

// Export all schema for Drizzle
export const schema = {
    user,
    session,
    account,
    verification,
    magicLinkAttempts,
    categories,
    products,
    blogPosts,
    affiliateClicks,
    carts,
    cartItems,
    wishlistItems,
};
