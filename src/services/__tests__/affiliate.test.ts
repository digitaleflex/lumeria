import { describe, it, expect, beforeEach } from 'vitest';

// Mock affiliate clicks storage
let mockClicks: Array<{
  id: string;
  productId: string;
  productName: string;
  userId?: string;
  device?: string;
  utmSource?: string;
  clickedAt: Date;
}> = [];

// Affiliate service functions
const affiliateService = {
  trackClick: (data: {
    productId: string;
    productName: string;
    userId?: string;
    device?: string;
    utmSource?: string;
  }) => {
    const click = {
      id: crypto.randomUUID(),
      ...data,
      clickedAt: new Date(),
    };
    mockClicks.push(click);
    return click;
  },

  getClicksByProduct: (productId: string) => {
    return mockClicks.filter(click => click.productId === productId);
  },

  getClicksByUser: (userId: string) => {
    return mockClicks.filter(click => click.userId === userId);
  },

  getClicksByUtmSource: (utmSource: string) => {
    return mockClicks.filter(click => click.utmSource === utmSource);
  },

  getTotalClicks: () => {
    return mockClicks.length;
  },

  getClicksByDevice: () => {
    const devices: Record<string, number> = {};
    mockClicks.forEach(click => {
      if (click.device) {
        devices[click.device] = (devices[click.device] || 0) + 1;
      }
    });
    return devices;
  },
};

describe('Affiliate Service', () => {
  beforeEach(() => {
    mockClicks = [];
  });

  it('should track affiliate click', () => {
    const click = affiliateService.trackClick({
      productId: 'prod-1',
      productName: 'Test Product',
      userId: 'user-1',
      device: 'Mobile',
      utmSource: 'instagram',
    });

    expect(click.id).toBeDefined();
    expect(click.productId).toBe('prod-1');
    expect(click.productName).toBe('Test Product');
    expect(click.clickedAt).toBeInstanceOf(Date);
  });

  it('should get clicks by product', () => {
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1' });
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1' });
    affiliateService.trackClick({ productId: 'prod-2', productName: 'Product 2' });

    const clicks = affiliateService.getClicksByProduct('prod-1');
    expect(clicks).toHaveLength(2);
  });

  it('should get clicks by user', () => {
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1', userId: 'user-1' });
    affiliateService.trackClick({ productId: 'prod-2', productName: 'Product 2', userId: 'user-1' });
    affiliateService.trackClick({ productId: 'prod-3', productName: 'Product 3', userId: 'user-2' });

    const clicks = affiliateService.getClicksByUser('user-1');
    expect(clicks).toHaveLength(2);
  });

  it('should get clicks by UTM source', () => {
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1', utmSource: 'instagram' });
    affiliateService.trackClick({ productId: 'prod-2', productName: 'Product 2', utmSource: 'instagram' });
    affiliateService.trackClick({ productId: 'prod-3', productName: 'Product 3', utmSource: 'tiktok' });

    const clicks = affiliateService.getClicksByUtmSource('instagram');
    expect(clicks).toHaveLength(2);
  });

  it('should count total clicks', () => {
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1' });
    affiliateService.trackClick({ productId: 'prod-2', productName: 'Product 2' });
    affiliateService.trackClick({ productId: 'prod-3', productName: 'Product 3' });

    expect(affiliateService.getTotalClicks()).toBe(3);
  });

  it('should group clicks by device', () => {
    affiliateService.trackClick({ productId: 'prod-1', productName: 'Product 1', device: 'Mobile' });
    affiliateService.trackClick({ productId: 'prod-2', productName: 'Product 2', device: 'Mobile' });
    affiliateService.trackClick({ productId: 'prod-3', productName: 'Product 3', device: 'Desktop' });

    const deviceStats = affiliateService.getClicksByDevice();
    expect(deviceStats['Mobile']).toBe(2);
    expect(deviceStats['Desktop']).toBe(1);
  });

  it('should handle clicks without optional fields', () => {
    const click = affiliateService.trackClick({
      productId: 'prod-1',
      productName: 'Product 1',
    });

    expect(click.userId).toBeUndefined();
    expect(click.device).toBeUndefined();
    expect(click.utmSource).toBeUndefined();
  });
});
