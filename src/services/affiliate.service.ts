/* ============================================
   AFFILIATE SERVICE - Tracking clics affiliation
   ============================================ */

import type { AffiliateClick, AffiliateStats } from '@/types';
import { db } from '@/lib/db';
import { affiliateClicks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export class AffiliateService {
  /**
   * Track un clic affilié
   */
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
    const id = `click-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    await db.insert(affiliateClicks).values({
      id,
      ...data,
      clickedAt: now,
    });

    const click: AffiliateClick = {
      id,
      ...data,
      clickedAt: now,
    };

    console.log('Affiliate click tracked in DB:', click);
    return click;
  }

  /**
   * Récupère tous les clics
   */
  async getAllClicks(): Promise<AffiliateClick[]> {
    const results = await db.select().from(affiliateClicks).orderBy(desc(affiliateClicks.clickedAt));
    return results as unknown as AffiliateClick[];
  }

  /**
   * Récupère les clics d'un produit
   */
  async getClicksByProduct(productId: string): Promise<AffiliateClick[]> {
    const results = await db.select().from(affiliateClicks)
      .where(eq(affiliateClicks.productId, productId))
      .orderBy(desc(affiliateClicks.clickedAt));
    return results as unknown as AffiliateClick[];
  }

  /**
   * Récupère les statistiques complètes
   */
  async getStats(): Promise<AffiliateStats> {
    const clicks = await this.getAllClicks();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const totalClicks = clicks.length;
    const clicksToday = clicks.filter(c => new Date(c.clickedAt) >= today).length;
    const clicksThisWeek = clicks.filter(c => new Date(c.clickedAt) >= weekAgo).length;
    const clicksThisMonth = clicks.filter(c => new Date(c.clickedAt) >= monthAgo).length;

    // Top produits
    const productClicks: Record<string, { name: string; clicks: number }> = {};
    clicks.forEach(c => {
      if (!productClicks[c.productId]) {
        productClicks[c.productId] = { name: c.productName, clicks: 0 };
      }
      productClicks[c.productId].clicks++;
    });

    const topProducts = Object.entries(productClicks)
      .map(([productId, data]) => ({ productId, productName: data.name, clicks: data.clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Clics par pays
    const countryClicks: Record<string, number> = {};
    clicks.forEach(c => {
      const country = c.country || 'Unknown';
      countryClicks[country] = (countryClicks[country] || 0) + 1;
    });

    const clicksByCountry = Object.entries(countryClicks)
      .map(([country, count]) => ({ country, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks);

    // Clics par source
    const sourceClicks: Record<string, number> = {};
    clicks.forEach(c => {
      const source = c.utmSource || c.source || 'Direct';
      sourceClicks[source] = (sourceClicks[source] || 0) + 1;
    });

    const clicksBySource = Object.entries(sourceClicks)
      .map(([source, count]) => ({ source, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks);

    return {
      totalClicks,
      clicksToday,
      clicksThisWeek,
      clicksThisMonth,
      topProducts,
      clicksByCountry,
      clicksBySource,
    };
  }

  /**
   * Génère un lien de tracking avec UTM
   */
  generateTrackingLink(
    baseUrl: string,
    productId: string,
    params?: { source?: string; campaign?: string; medium?: string }
  ): string {
    const url = new URL(`${baseUrl}/go/${productId}`);
    if (params?.source) url.searchParams.set('utm_source', params.source);
    if (params?.campaign) url.searchParams.set('utm_campaign', params.campaign);
    if (params?.medium) url.searchParams.set('utm_medium', params.medium);
    return url.toString();
  }

  /**
   * Détecte le pays depuis l'IP (simplifié)
   */
  detectCountry(): string {
    // En production, utiliser un service de géolocalisation
    return 'US';
  }

  /**
   * Détecte l'appareil
   */
  detectDevice(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablet';
    return 'Desktop';
  }
}

export const affiliateService = new AffiliateService();
