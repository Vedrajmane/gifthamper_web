'use client';

import { Heart } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wordlane_wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  }, []);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = [...prev, product];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}

interface WishlistButtonProps {
  product: Product;
  isInWishlist: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({ product, isInWishlist, onToggle, size = 'md' }: WishlistButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isInWishlist
          ? 'bg-rose-500 text-white hover:bg-rose-600'
          : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-500 border border-gray-200'
      } shadow-sm hover:shadow-md`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={iconSizes[size]}
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
    </button>
  );
}
