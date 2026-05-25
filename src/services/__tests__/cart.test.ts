import { describe, it, expect, beforeEach } from 'vitest';

// Mock cart data
let mockCart: { id: string; items: Array<{ productId: string; quantity: number }> } = {
  id: 'cart-1',
  items: [],
};

// Cart service functions
const cartService = {
  addItem: (productId: string, quantity: number = 1) => {
    const existingItem = mockCart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      mockCart.items.push({ productId, quantity });
    }
    return mockCart;
  },

  removeItem: (productId: string) => {
    mockCart.items = mockCart.items.filter(item => item.productId !== productId);
    return mockCart;
  },

  updateQuantity: (productId: string, quantity: number) => {
    const item = mockCart.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    return mockCart;
  },

  clear: () => {
    mockCart.items = [];
    return mockCart;
  },

  getTotal: () => {
    return mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
  },
};

describe('Cart Service', () => {
  beforeEach(() => {
    mockCart.items = [];
  });

  it('should add item to cart', () => {
    const result = cartService.addItem('prod-1', 2);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe('prod-1');
    expect(result.items[0].quantity).toBe(2);
  });

  it('should increment quantity if item already exists', () => {
    cartService.addItem('prod-1', 1);
    cartService.addItem('prod-1', 2);
    expect(mockCart.items).toHaveLength(1);
    expect(mockCart.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    cartService.addItem('prod-1', 1);
    cartService.addItem('prod-2', 1);
    cartService.removeItem('prod-1');
    expect(mockCart.items).toHaveLength(1);
    expect(mockCart.items[0].productId).toBe('prod-2');
  });

  it('should update item quantity', () => {
    cartService.addItem('prod-1', 1);
    cartService.updateQuantity('prod-1', 5);
    expect(mockCart.items[0].quantity).toBe(5);
  });

  it('should clear cart', () => {
    cartService.addItem('prod-1', 1);
    cartService.addItem('prod-2', 1);
    cartService.clear();
    expect(mockCart.items).toHaveLength(0);
  });

  it('should calculate total items', () => {
    cartService.addItem('prod-1', 2);
    cartService.addItem('prod-2', 3);
    expect(cartService.getTotal()).toBe(5);
  });
});
