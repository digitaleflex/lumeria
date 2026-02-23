// ============================================
// SECTION HEADER - En-tête de section
// ============================================

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        {action && (
          <Link
            to={action.href}
            className="flex items-center gap-1 text-violet-600 hover:text-violet-700 font-medium text-sm"
          >
            {action.label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="text-gray-500 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
