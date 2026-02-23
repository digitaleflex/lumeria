/* ============================================
   STAT CARD - Carte statistique
   ============================================ */

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'violet' | 'blue' | 'green' | 'amber' | 'rose';
}

const colorClasses = {
  violet: 'bg-violet-100 text-violet-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'violet' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div className={cn('w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        {trend && (
          <span className={cn(
            'text-xs md:text-sm flex items-center gap-1 font-medium',
            trend.isPositive ? 'text-green-600' : 'text-rose-600'
          )}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-xs md:text-sm mt-1">{title}</p>
    </div>
  );
}
