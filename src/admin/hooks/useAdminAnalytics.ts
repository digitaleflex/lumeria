/* ============================================
   HOOK: useAdminAnalytics - Stats & tracking
   ============================================ */

import { useState, useEffect, useCallback } from 'react';
import { adminAnalyticsService } from '@/admin/services/adminAnalytics.service';
import type { AffiliateClick } from '@/types';
import type { AnalyticsStats, DailyClicks, ProductClicks, SourceClicks } from '@/admin/services/types';

interface UseAdminAnalyticsReturn {
  stats: AnalyticsStats | null;
  dailyClicks: DailyClicks[];
  productClicks: ProductClicks[];
  sourceClicks: SourceClicks[];
  deviceClicks: { device: string; clicks: number }[];
  countryClicks: { country: string; clicks: number }[];
  recentClicks: AffiliateClick[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  trackClick: (data: {
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
  }) => Promise<void>;
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [dailyClicks, setDailyClicks] = useState<DailyClicks[]>([]);
  const [productClicks, setProductClicks] = useState<ProductClicks[]>([]);
  const [sourceClicks, setSourceClicks] = useState<SourceClicks[]>([]);
  const [deviceClicks, setDeviceClicks] = useState<{ device: string; clicks: number }[]>([]);
  const [countryClicks, setCountryClicks] = useState<{ country: string; clicks: number }[]>([]);
  const [recentClicks, setRecentClicks] = useState<AffiliateClick[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        statsData,
        dailyData,
        productData,
        sourceData,
        deviceData,
        countryData,
        recentData,
      ] = await Promise.all([
        adminAnalyticsService.getStats(),
        adminAnalyticsService.getDailyClicks(30),
        adminAnalyticsService.getProductClicks(10),
        adminAnalyticsService.getSourceClicks(),
        adminAnalyticsService.getDeviceClicks(),
        adminAnalyticsService.getCountryClicks(),
        adminAnalyticsService.getRecentClicks(20),
      ]);

      setStats(statsData);
      setDailyClicks(dailyData);
      setProductClicks(productData);
      setSourceClicks(sourceData);
      setDeviceClicks(deviceData);
      setCountryClicks(countryData);
      setRecentClicks(recentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const trackClick = useCallback(async (data: {
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
  }): Promise<void> => {
    try {
      await adminAnalyticsService.trackClick(data);
      // Ne pas refresh automatiquement pour éviter les re-renders
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  }, []);

  return {
    stats,
    dailyClicks,
    productClicks,
    sourceClicks,
    deviceClicks,
    countryClicks,
    recentClicks,
    isLoading,
    error,
    refresh,
    trackClick,
  };
}
