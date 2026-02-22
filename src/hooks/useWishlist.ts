import { create } from 'zustand';
import { wishlistRepository } from '@/repositories/wishlist.repository';
import type { WishlistItem } from '@/types';

interface WishlistState {
    items: WishlistItem[];
    isLoading: boolean;
    isOpen: boolean;
    loadWishlist: (userId: string) => Promise<void>;
    addItem: (userId: string, productId: string) => Promise<void>;
    removeItem: (userId: string, productId: string) => Promise<void>;
    setIsOpen: (isOpen: boolean) => void;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>((set, get) => ({
    items: [],
    isLoading: false,
    isOpen: false,

    loadWishlist: async (userId: string) => {
        set({ isLoading: true });
        try {
            const items = await wishlistRepository.findByUserId(userId);
            set({ items });
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    addItem: async (userId: string, productId: string) => {
        try {
            const newItem = await wishlistRepository.addItem(userId, productId);
            if (newItem) {
                set((state) => ({ items: [...state.items, newItem] }));
            }
        } catch (error) {
            console.error('Failed to add item to wishlist:', error);
            throw error;
        }
    },

    removeItem: async (userId: string, productId: string) => {
        try {
            const success = await wishlistRepository.removeItem(userId, productId);
            if (success) {
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                }));
            }
        } catch (error) {
            console.error('Failed to remove item from wishlist:', error);
            throw error;
        }
    },

    setIsOpen: (isOpen: boolean) => set({ isOpen }),

    isInWishlist: (productId: string) => {
        const state = get();
        return state.items.some(item => item.productId === productId);
    }
}));
