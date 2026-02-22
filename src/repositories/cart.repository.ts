/* ============================================
   CART REPOSITORY - Accès DB panier
   ============================================ */

import { db } from '@/lib/db';
import { carts, cartItems, products, categories as categoriesTable } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import type { Cart, CartItem, Product, SkinType } from '@/types';
import { generateId } from '@/lib/utils';
import { adminProductService } from '@/admin/services/adminProduct.service';

function mapProductRecord(row: any): Product {
  return {
    ...row.product,
    category: row.category,
    skinTypes: row.product.skinTypes as SkinType[],
  };
}

export class CartRepository {
  async findOrCreateCart(cartId?: string): Promise<Cart> {
    if (cartId) {
      const existing = await this.findById(cartId);
      if (existing) return existing;
    }

    const newCartId = generateId();
    const now = new Date();

    await db.insert(carts).values({
      id: newCartId,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: newCartId,
      items: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  async findById(cartId: string): Promise<Cart | null> {
    const rawCarts = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
    const cartRow = rawCarts[0];
    if (!cartRow) return null;

    const rawItems = await db
      .select({
        cartItem: cartItems,
        product: products,
        category: categoriesTable
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .innerJoin(categoriesTable, eq(products.categoryId, categoriesTable.id))
      .where(eq(cartItems.cartId, cartId));

    const mappedItems: CartItem[] = rawItems.map(row => ({
      ...row.cartItem,
      product: mapProductRecord(row),
    }));

    return {
      id: cartRow.id,
      items: mappedItems,
      createdAt: cartRow.createdAt,
      updatedAt: cartRow.updatedAt,
    };
  }

  async addItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    let cart = await this.findById(cartId);
    if (!cart) {
      cart = await this.findOrCreateCart(cartId);
    }

    const product = await adminProductService.getById(productId);
    if (!product) throw new Error('Product not found');

    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.productId, productId)))
      .limit(1);

    const now = new Date();

    if (existingItem.length > 0) {
      const item = existingItem[0];
      const newQty = item.quantity + quantity;

      await db.update(cartItems)
        .set({ quantity: newQty })
        .where(eq(cartItems.id, item.id));

      await db.update(carts).set({ updatedAt: now }).where(eq(carts.id, cart.id));

      return {
        ...item,
        quantity: newQty,
        product,
      } as CartItem;
    }

    const newItemId = generateId();

    await db.insert(cartItems).values({
      id: newItemId,
      cartId: cart.id,
      productId,
      quantity,
      addedAt: now,
    });

    await db.update(carts).set({ updatedAt: now }).where(eq(carts.id, cart.id));

    return {
      id: newItemId,
      cartId: cart.id,
      productId,
      quantity,
      addedAt: now,
      product,
    } as CartItem;
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
    const records = await db.select().from(cartItems).where(eq(cartItems.id, itemId)).limit(1);
    if (records.length === 0) return null;

    const item = records[0];

    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, item.cartId));

    const product = await adminProductService.getById(item.productId);

    return {
      ...item,
      quantity,
      product: product!,
    } as CartItem;
  }

  async removeItem(itemId: string): Promise<boolean> {
    const records = await db.select().from(cartItems).where(eq(cartItems.id, itemId)).limit(1);
    if (records.length === 0) return false;

    const item = records[0];

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, item.cartId));

    return true;
  }

  async clearCart(cartId: string): Promise<boolean> {
    const records = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
    if (records.length === 0) return false;

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId));

    return true;
  }

  calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  countItems(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}

export const cartRepository = new CartRepository();
