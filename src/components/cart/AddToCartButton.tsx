// ============================================
// ADD TO CART BUTTON - Bouton ajouter au panier
// ============================================

import { useState } from 'react';
import { ShoppingBag, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  onAdd: () => Promise<void>;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showQuantity?: boolean;
}

export function AddToCartButton({
  onAdd,
  className,
  variant = 'default',
  size = 'default',
  showQuantity = false,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onAdd();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (showQuantity) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className={cn(
            'flex-1 bg-violet-600 hover:bg-violet-700',
            className
          )}
          size={size}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : isSuccess ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <ShoppingBag className="w-4 h-4 mr-2" />
          )}
          {isSuccess ? 'Ajouté !' : 'Ajouter au panier'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={cn(
        variant === 'default' && 'bg-violet-600 hover:bg-violet-700',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : isSuccess ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <ShoppingBag className="w-4 h-4 mr-2" />
      )}
      {isSuccess ? 'Ajouté !' : 'Ajouter au panier'}
    </Button>
  );
}
