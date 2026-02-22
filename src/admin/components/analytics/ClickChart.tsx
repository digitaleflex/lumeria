/* ============================================
   CLICK CHART - Graphique des clics
   ============================================ */

import { useMemo } from 'react';
import type { DailyClicks } from '@/admin/services/types';

interface ClickChartProps {
  data: DailyClicks[];
}

export function ClickChart({ data }: ClickChartProps) {
  const maxClicks = useMemo(() => {
    return Math.max(...data.map(d => d.clicks), 1);
  }, [data]);

  const totalClicks = useMemo(() => {
    return data.reduce((sum, d) => sum + d.clicks, 0);
  }, [data]);

  if (data.length === 0 || totalClicks === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        No click data available yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Clicks (Last 30 Days)</h3>
        <span className="text-2xl font-bold text-violet-600">{totalClicks}</span>
      </div>
      
      <div className="h-48 flex items-end gap-1">
        {data.map((day, idx) => {
          const height = maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0;
          const isToday = idx === data.length - 1;
          
          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t transition-all ${
                    isToday ? 'bg-violet-600' : 'bg-violet-200 group-hover:bg-violet-300'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {day.date}: {day.clicks} clicks
                </div>
              </div>
              {/* Date label - show every 5th day */}
              {idx % 5 === 0 && (
                <span className="text-[10px] text-gray-400">
                  {day.date.slice(5)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
