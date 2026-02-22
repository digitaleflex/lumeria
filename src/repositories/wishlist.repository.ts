/* ============================================
   WISHLIST REPOSITORY - Accès DB favoris
   ============================================ */

import { db } from '@/lib/db';
import { wishlistItems, products, categories as categoriesTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import type { WishlistItem, Product, SkinType } from '@/types';
import { generateId } from '@/lib/utils';
import { adminProductService } from '@/admin/services/adminProduct.service';

function mapProductRecord(row: any): Product {
    return {
        ...row.product,
        category: row.category,
        skinTypes: row.product.skinTypes as SkinType[],
    };
}

export class WishlistRepository {
    async findByUserId(userId: string): Promise<WishlistItem[]> {
        const rawItems = await db
            .select({
                wishlistItem: wishlistItems,
                product: products,
                category: categoriesTable
            })
            .from(wishlistItems)
            .innerJoin(products, eq(wishlistItems.productId, products.id))
            .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
            .where(eq(wishlistItems.userId, userId));

        return rawItems.map(row => ({
            ...row.wishlistItem,
            product: mapProductRecord(row),
        }));
    }

    async addItem(userId: string, productId: string): Promise<WishlistItem | null> {
        const product = await adminProductService.getById(productId);
        if (!product) throw new Error('Product not found');

        const existingItem = await db
            .select()
            .from(wishlistItems)
            .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
            .limit(1);

        if (existingItem.length > 0) {
            return null; // Déjà dans la wishlist
        }

        const newItemId = generateId();
        const now = new Date();

        await db.insert(wishlistItems).values({
            id: newItemId,
            userId,
            productId,
            addedAt: now,
        });

        return {
            id: newItemId,
            userId,
            productId,
            addedAt: now,
            product,
        } as WishlistItem;
    }

    async removeItem(userId: string, productId: string): Promise<boolean> {
        const records = await db
            .select()
            .from(wishlistItems)
            .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
            .limit(1);

        if (records.length === 0) return false;

        await db.delete(wishlistItems).where(eq(wishlistItems.id, records[0].id));
        return true;
    }

    async checkInWishlist(userId: string, productId: string): Promise<boolean> {
        const existingItem = await db
            .select()
            .from(wishlistItems)
            .where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)))
            .limit(1);

        return existingItem.length > 0;
    }
}

export const wishlistRepository = new WishlistRepository();
