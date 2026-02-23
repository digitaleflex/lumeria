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
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-12">
      <div className="space-y-1">
        <div className="flex items-center gap-2 md:gap-3">
          {backLink && (
            <Link to={backLink}>
              <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-gray-200">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-sm md:text-base lg:text-lg text-gray-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-wrap">
        <Link to="/" target="_blank">
          <Button variant="outline" className="h-10 md:h-12 px-4 md:px-6 gap-2 rounded-xl md:rounded-2xl border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm md:text-base">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Voir le site</span>
            <span className="sm:hidden">Site</span>
          </Button>
        </Link>
        {action && (
          <Button
            onClick={action.onClick}
            className="h-10 md:h-12 px-4 md:px-8 gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-violet-200 text-sm md:text-base"
          >
            {action.icon}
            <span className="hidden sm:inline">{action.label}</span>
            <span className="sm:hidden">{action.label.split(' ').pop()}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
