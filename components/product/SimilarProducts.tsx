'use client';

import { Product } from '@/lib/types/product';
import ProductCard from '../ui/ProductCard';

interface SimilarProductsProps {
  currentProduct: Product;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  maxItems?: number;
}

export default function SimilarProducts({
  currentProduct,
  allProducts,
  onAddToCart,
  onBuyNow,
  maxItems = 4,
}: SimilarProductsProps) {
  // Find similar products based on category and price range
  const getSimilarProducts = (): Product[] => {
    const priceRange = currentProduct.price * 0.3; // 30% price range
    
    return allProducts
      .filter(p => 
        p.id !== currentProduct.id && // Exclude current product
        (
          p.category === currentProduct.category || // Same category
          (p.subcategory && p.subcategory === currentProduct.subcategory) || // Same subcategory
          Math.abs(p.price - currentProduct.price) <= priceRange // Similar price
        )
      )
      .sort((a, b) => {
        // Prioritize same category
        const aCategoryMatch = a.category === currentProduct.category ? 1 : 0;
        const bCategoryMatch = b.category === currentProduct.category ? 1 : 0;
        
        if (aCategoryMatch !== bCategoryMatch) {
          return bCategoryMatch - aCategoryMatch;
        }
        
        // Then by price similarity
        const aPriceDiff = Math.abs(a.price - currentProduct.price);
        const bPriceDiff = Math.abs(b.price - currentProduct.price);
        return aPriceDiff - bPriceDiff;
      })
      .slice(0, maxItems);
  };

  const similarProducts = getSimilarProducts();

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
