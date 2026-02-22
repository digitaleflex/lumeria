/* ============================================
   ADMIN ANALYTICS SERVICE - Stats & Tracking
   ============================================ */

import { db } from '@/lib/db';
import { affiliateClicks } from '@/lib/schema';
import { desc } from 'drizzle-orm';
import type { AffiliateClick } from '@/types';
import type { AnalyticsStats, DailyClicks, ProductClicks, SourceClicks } from '@/admin/services/types';
import { generateId } from '@/admin/utils';

class AdminAnalyticsService {

  // ========== TRACKING ==========

  async trackClick(data: {
    productId: string;
    productName: string;
    userId?: string;
    userEmail?: string;
    country?: string;
    device?: string;
    source?: string;
    referrer?: string;
    utmSource?: string;
    utmCampaign?: string;
  }): Promise<AffiliateClick> {
    const id = generateId();
    const now = new Date();

    await db.insert(affiliateClicks).values({
      id,
      ...data,
      clickedAt: now,
    });

    return {
      id,
      ...data,
      clickedAt: now,
    } as AffiliateClick;
  }

  // ========== STATS ==========

  async getStats(): Promise<AnalyticsStats> {
    const allClicks = await db.select().from(affiliateClicks);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      totalClicks: allClicks.length,
      clicksToday: allClicks.filter(c => new Date(c.clickedAt) >= today).length,
      clicksThisWeek: allClicks.filter(c => new Date(c.clickedAt) >= weekAgo).length,
      clicksThisMonth: allClicks.filter(c => new Date(c.clickedAt) >= monthAgo).length,
    };
  }

  // ========== DAILY CLICKS (pour graphiques) ==========

  async getDailyClicks(days: number = 30): Promise<DailyClicks[]> {
    const allClicks = await db.select().from(affiliateClicks);
    const result: DailyClicks[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = allClicks.filter(
        c => new Date(c.clickedAt) >= date && new Date(c.clickedAt) < nextDate
      ).length;

      result.push({
        date: date.toISOString().split('T')[0],
        clicks: count,
      });
    }

    return result;
  }

  // ========== PRODUCT CLICKS ==========

  async getProductClicks(limit: number = 10): Promise<ProductClicks[]> {
    const allClicks = await db.select().from(affiliateClicks);
    const productMap = new Map<string, { name: string; clicks: number }>();

    allClicks.forEach(click => {
      const existing = productMap.get(click.productId);
      if (existing) {
        existing.clicks++;
      } else {
        productMap.set(click.productId, { name: click.productName, clicks: 1 });
      }
    });

    return Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        clicks: data.clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  // ========== SOURCE CLICKS ==========

  async getSourceClicks(): Promise<SourceClicks[]> {
    const allClicks = await db.select().from(affiliateClicks);
    const sourceMap = new Map<string, number>();

    allClicks.forEach(click => {
      const source = click.utmSource || click.source || 'Direct';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    return Array.from(sourceMap.entries())
      .map(([source, clicks]) => ({ source, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }

  // ========== DEVICE CLICKS ==========

  async getDeviceClicks(): Promise<{ device: string; clicks: number }[]> {
    const allClicks = await db.select().from(affiliateClicks);
    const deviceMap = new Map<string, number>();

    allClicks.forEach(click => {
      const device = click.device || 'Unknown';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    return Array.from(deviceMap.entries())
      .map(([device, clicks]) => ({ device, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }

  // ========== COUNTRY CLICKS ==========

  async getCountryClicks(): Promise<{ country: string; clicks: number }[]> {
    const allClicks = await db.select().from(affiliateClicks);
    const countryMap = new Map<string, number>();

    allClicks.forEach(click => {
      const country = click.country || 'Unknown';
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    return Array.from(countryMap.entries())
      .map(([country, clicks]) => ({ country, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }

  // ========== RECENT CLICKS ==========

  async getRecentClicks(limit: number = 50): Promise<AffiliateClick[]> {
    const results = await db
      .select()
      .from(affiliateClicks)
      .orderBy(desc(affiliateClicks.clickedAt))
      .limit(limit);

    return results as unknown as AffiliateClick[];
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
