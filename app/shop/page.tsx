'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterSidebar, { FilterOptions } from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/ui/ProductCard';
import { getAllProducts } from '@/lib/firebase/products.service';
import { Product } from '@/lib/types/product';
import { addToCart as addToCartUtil, getCart, getCartCount } from '@/lib/utils/cart';
import { useAuth } from '@/lib/context/auth.context';
import { saveUserCart } from '@/lib/firebase/cart.service';

export default function ShopPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    selectedCategories: [],
    selectedSubcategories: [],
  });

  // Get unique categories from products
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    async function loadProducts() {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    setCartCount(getCartCount(getCart()));
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...products];

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedCategories.includes(p.category)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products]);

  const handleAddToCart = async (product: Product) => {
    try {
      const newCart = addToCartUtil(product);
      setCartCount(getCartCount(newCart));

      // Sync to Firebase if user is logged in
      if (user) {
        await saveUserCart(user.uid, newCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header cartCount={cartCount} onCartClick={() => router.push('/')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-2">
            Shop All Products
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              onFilterChange={setFilters}
              categories={categories}
              minPrice={0}
              maxPrice={10000}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 10000],
                      selectedCategories: [],
                      selectedSubcategories: [],
                    })
                  }
                  className="mt-4 text-rose-600 hover:text-rose-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
