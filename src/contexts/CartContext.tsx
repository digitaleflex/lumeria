// ============================================
// CART CONTEXT - Contexte du panier partagé
// ============================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { cartService } from '@/services/cart.service';
import type { Cart, CartItem } from '@/types';

interface CartContextReturn {
    cart: Cart | null;
    items: CartItem[];
    total: number;
    itemCount: number;
    isLoading: boolean;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextReturn | null>(null);

const CART_ID_KEY = 'lumora_cart_id';

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const getCartId = (): string | undefined => {
        return localStorage.getItem(CART_ID_KEY) || undefined;
    };

    const setCartId = (id: string): void => {
        localStorage.setItem(CART_ID_KEY, id);
    };

    const refreshCart = useCallback(async () => {
        const cartId = getCartId();
        const summary = await cartService.getCartSummary(cartId);

        if (summary.items.length > 0 && !cartId) {
            const newCart = await cartService.getCart();
            setCart(newCart);
            setCartId(newCart.id);
        } else {
            const existingCart = await cartService.getCart(cartId);
            setCart(existingCart);
            if (existingCart.id !== cartId) {
                setCartId(existingCart.id);
            }
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = useCallback(async (productId: string, quantity: number = 1) => {
        setIsLoading(true);
        try {
            const cartId = getCartId();
            const result = await cartService.addToCart(cartId, productId, quantity);
            setCart(result.cart);
            setCartId(result.cart.id);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        setIsLoading(true);
        try {
            await cartService.updateQuantity(itemId, quantity);
            await refreshCart();
        } finally {
            setIsLoading(false);
        }
    }, [refreshCart]);

    const removeItem = useCallback(async (itemId: string) => {
        setIsLoading(true);
        try {
            await cartService.removeFromCart(itemId);
            await refreshCart();
        } finally {
            setIsLoading(false);
        }
    }, [refreshCart]);

    const clearCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const cartId = getCartId();
            if (cartId) {
                await cartService.clearCart(cartId);
                await refreshCart();
            }
        } finally {
            setIsLoading(false);
        }
    }, [refreshCart]);

    const total = cart ? cartService.calculateTotal(cart) : 0;
    const itemCount = cart ? cartService.countItems(cart) : 0;

    return (
        <CartContext.Provider value={{
            cart,
            items: cart?.items || [],
            total,
            itemCount,
            isLoading,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextReturn {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
