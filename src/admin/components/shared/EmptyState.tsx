/* ============================================
   EMPTY STATE - État vide
   ============================================ */

import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center">
      <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="w-8 h-8 text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-violet-600 hover:bg-violet-700">
          {action.label}
        </Button>
      )}
    </div>
  );
}
