/* ============================================
   SOURCE CLICKS LIST - Clics par source
   ============================================ */

import { Globe, Smartphone, Monitor, Tablet } from 'lucide-react';
import type { SourceClicks } from '@/admin/services/types';

interface SourceClicksListProps {
  sources: SourceClicks[];
}

const sourceIcons: Record<string, React.ElementType> = {
  Direct: Globe,
  Mobile: Smartphone,
  Desktop: Monitor,
  Tablet: Tablet,
};

const sourceColors: Record<string, string> = {
  Direct: 'bg-blue-100 text-blue-600',
  TikTok: 'bg-black text-white',
  Instagram: 'bg-pink-100 text-pink-600',
  Facebook: 'bg-blue-100 text-blue-600',
  Google: 'bg-green-100 text-green-600',
  Mobile: 'bg-violet-100 text-violet-600',
  Desktop: 'bg-gray-100 text-gray-600',
};

export function SourceClicksList({ sources }: SourceClicksListProps) {
  if (sources.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        No source data yet
      </div>
    );
  }

  const totalClicks = sources.reduce((sum, s) => sum + s.clicks, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
      
      <div className="space-y-3">
        {sources.map((source) => {
          const Icon = sourceIcons[source.source] || Globe;
          const colorClass = sourceColors[source.source] || 'bg-gray-100 text-gray-600';
          const percentage = totalClicks > 0 ? Math.round((source.clicks / totalClicks) * 100) : 0;
          
          return (
            <div key={source.source} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">{source.source}</span>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-violet-600 font-medium w-10 text-right">
                    {source.clicks}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
