'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types/product';

const STORAGE_KEY = 'wordlane_recently_viewed';
const MAX_ITEMS = 8;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading recently viewed:', error);
      }
    }
  }, []);

  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((p) => p.id !== product.id);
      // Add to beginning
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed };
}

interface RecentlyViewedProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function RecentlyViewed({ products, onProductClick }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Recently Viewed
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductClick(product)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="relative h-32 bg-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-sm font-bold text-rose-600">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
