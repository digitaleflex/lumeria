import "dotenv/config";
import { db } from "./db";
import { categories, products, blogPosts, user } from "./schema";
import { mockCategories, mockProducts, mockBlogPosts, mockUsers } from "../mocks";


async function main() {
    console.log("Seeding database...");

    // Seed users
    console.log("Inserting users...");
    for (const u of mockUsers) {
        await db.insert(user).values({
            id: u.id,
            name: u.name,
            email: u.email,
        }).onConflictDoNothing();
    }

    // Seed categories
    console.log("Inserting categories...");
    for (const category of mockCategories) {
        await db.insert(categories).values({
            id: category.id,
            slug: category.slug,
            name: category.name,
            nameFr: category.nameFr,
            description: category.description,
            descriptionFr: category.descriptionFr,
            image: category.image,
            productCount: category.productCount,
        }).onConflictDoNothing();
    }

    // Seed products
    console.log("Inserting products...");
    for (const product of mockProducts) {
        await db.insert(products).values({
            id: product.id,
            slug: product.slug,
            name: product.name,
            nameFr: product.nameFr,
            description: product.description,
            descriptionFr: product.descriptionFr,
            price: product.price,
            originalPrice: product.originalPrice ?? null,
            image: product.image,
            images: product.images,
            categoryId: product.categoryId,
            skinTypes: product.skinTypes,
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured,
            isBestseller: product.isBestseller,
            affiliateUrl: product.affiliateUrl,
            brand: product.brand,
            ingredients: product.ingredients,
            ingredientsFr: product.ingredientsFr,
            howToUse: product.howToUse,
            howToUseFr: product.howToUseFr,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }).onConflictDoNothing();
    }

    // Seed blog posts
    console.log("Inserting blog posts...");
    for (const post of mockBlogPosts) {
        await db.insert(blogPosts).values({
            id: post.id,
            slug: post.slug,
            title: post.title,
            titleFr: post.titleFr,
            excerpt: post.excerpt,
            excerptFr: post.excerptFr,
            content: post.content,
            contentFr: post.contentFr,
            coverImage: post.coverImage,
            author: post.author,
            tags: post.tags,
            publishedAt: post.publishedAt,
            readTime: post.readTime,
            status: post.status,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }).onConflictDoNothing();
    }

    console.log("Database seeding completed!");
    process.exit(0);
}

main().catch(console.error);
