'use client';

import { useState } from 'react';
import ProductCard from '../ui/ProductCard';
import { Product } from '@/lib/types/product';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  isAdmin?: boolean;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function FeaturedProducts({
  products,
  onAddToCart,
  onBuyNow,
  selectedCategory = 'All',
  onCategoryChange,
  isAdmin = false,
  onEditProduct,
  onDeleteProduct,
}: FeaturedProductsProps) {
  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div>
      {/* Category Filter Tabs */}
      {onCategoryChange && (
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isAdmin={isAdmin}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
