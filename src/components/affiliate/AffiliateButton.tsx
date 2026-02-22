/* ============================================
   AFFILIATE BUTTON - Bouton avec tracking
   ============================================ */

import { useState } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { affiliateService } from '@/services/affiliate.service';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface AffiliateButtonProps {
  productId: string;
  productName: string;
  affiliateUrl: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  children?: React.ReactNode;
  utmSource?: string;
  utmCampaign?: string;
  onClick?: () => void;
}

export function AffiliateButton({
  productId,
  productName,
  affiliateUrl,
  variant = 'default',
  size = 'default',
  className,
  children,
  utmSource,
  utmCampaign,
  onClick,
}: AffiliateButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();

  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      // Track le clic
      await affiliateService.trackClick({
        productId,
        productName,
        userId: user?.id,
        userEmail: user?.email,
        country: affiliateService.detectCountry(),
        device: affiliateService.detectDevice(navigator.userAgent),
        source: document.referrer || 'Direct',
        referrer: window.location.href,
        utmSource,
        utmCampaign,
      });

      // Callback optionnel
      onClick?.();

      // Redirection
      window.open(affiliateUrl, '_blank');
    } catch (error) {
      console.error('Tracking error:', error);
      // Redirection même si tracking échoue
      window.open(affiliateUrl, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={cn(
        'gap-2',
        variant === 'default' && 'bg-violet-600 hover:bg-violet-700',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ExternalLink className="w-4 h-4" />
      )}
      {children || 'Buy on Official Store'}
    </Button>
  );
}
