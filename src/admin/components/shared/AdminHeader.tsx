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
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          {backLink && (
            <Link to={backLink}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-3">
        <Link to="/" target="_blank">
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            View Site
          </Button>
        </Link>
        {action && (
          <Button onClick={action.onClick} size="sm" className="gap-2 bg-violet-600 hover:bg-violet-700">
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
