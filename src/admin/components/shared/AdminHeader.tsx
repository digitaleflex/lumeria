/* ============================================
   ADMIN HEADER - En-tête admin
   ============================================ */

import { Link } from 'react-router-dom';
import { Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  backLink?: string;
}

export function AdminHeader({ title, subtitle, action, backLink }: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {backLink && (
            <Link to={backLink}>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-gray-500 text-lg font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/" target="_blank">
          <Button variant="outline" className="h-12 px-6 gap-2 rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-600 font-bold">
            <Globe className="w-4 h-4" />
            Voir le site
          </Button>
        </Link>
        {action && (
          <Button
            onClick={action.onClick}
            className="h-12 px-8 gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold shadow-lg shadow-violet-200"
          >
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
