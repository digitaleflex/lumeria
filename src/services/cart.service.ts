// ============================================
// CART SERVICE - Logique métier panier
// ============================================

import { cartRepository } from '@/repositories/cart.repository';
import type { Cart, CartItem } from '@/types';

export interface CartSummary {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export class CartService {
  private repository = cartRepository;

  /**
   * Récupère ou crée un panier
   */
  async getCart(cartId?: string): Promise<Cart> {
    return this.repository.findOrCreateCart(cartId);
  }

  /**
   * Ajoute un produit au panier
   */
  async addToCart(
    cartId: string | undefined, 
    productId: string, 
    quantity: number
  ): Promise<{ cart: Cart; item: CartItem }> {
    const cart = await this.repository.findOrCreateCart(cartId);
    const item = await this.repository.addItem(cart.id, productId, quantity);
    
    // Recharge le panier pour avoir les items à jour
    const updatedCart = await this.repository.findById(cart.id);
    if (!updatedCart) throw new Error('Cart not found');
    
    return { cart: updatedCart, item };
  }

  /**
   * Met à jour la quantité d'un item
   */
  async updateQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
    if (quantity <= 0) {
      await this.repository.removeItem(itemId);
      return null;
    }
    return this.repository.updateItemQuantity(itemId, quantity);
  }

  /**
   * Supprime un item du panier
   */
  async removeFromCart(itemId: string): Promise<boolean> {
    return this.repository.removeItem(itemId);
  }

  /**
   * Vide le panier
   */
  async clearCart(cartId: string): Promise<boolean> {
    return this.repository.clearCart(cartId);
  }

  /**
   * Récupère le résumé du panier
   */
  async getCartSummary(cartId?: string): Promise<CartSummary> {
    const cart = await this.getCart(cartId);
    
    return {
      items: cart.items,
      total: this.repository.calculateTotal(cart),
      itemCount: this.repository.countItems(cart),
    };
  }

  /**
   * Calcule le total du panier
   */
  calculateTotal(cart: Cart): number {
    return this.repository.calculateTotal(cart);
  }

  /**
   * Compte les items dans le panier
   */
  countItems(cart: Cart): number {
    return this.repository.countItems(cart);
  }
}

// Singleton instance
export const cartService = new CartService();
