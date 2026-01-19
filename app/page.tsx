'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Categories from '@/components/sections/Categories';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import FilterSidebar, { FilterOptions } from '@/components/shop/FilterSidebar';
import CartSidebar from '@/components/ui/CartSidebar';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import ProductFormModal from '@/components/admin/ProductFormModal';
import { AdminProvider, useAdmin } from '@/lib/context/AdminContext';
import { useAuth } from '@/lib/context/auth.context';
import { Product, CartItem } from '@/lib/types/product';
import { getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, getCartCount } from '@/lib/utils/cart';
import { getAllProducts, addProduct as addProductToFirestore, updateProduct as updateProductInFirestore, deleteProduct as deleteProductFromFirestore } from '@/lib/firebase/products.service';
import { saveUserCart } from '@/lib/firebase/cart.service';

function HomePage() {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000],
    selectedCategories: [],
    selectedSubcategories: [],
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Load products from Firebase
  useEffect(() => {
    async function loadProducts() {
      try {
        const firebaseProducts = await getAllProducts();
        setProducts(firebaseProducts);
        setFilteredProducts(firebaseProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.subcategory?.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.price.toString().includes(query)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Category filter from sidebar
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.selectedCategories.includes(p.category)
      );
    }

    // Category filter from dropdown (backward compatibility)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [filters, selectedCategory, products, searchQuery]);

  // Handle client-side hydration and cart
  useEffect(() => {
    setMounted(true);
    setCart(getCart());
  }, []);

  // Sync cart to Firebase when user is logged in
  useEffect(() => {
    if (user && cart.length > 0) {
      saveUserCart(user.uid, cart).catch(error => {
        console.error('Error syncing cart:', error);
      });
    }
  }, [user, cart]);

  // Listen for category filter events from footer
  useEffect(() => {
    const handleFilterCategory = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
    };

    window.addEventListener('filterCategory', handleFilterCategory as EventListener);
    return () => {
      window.removeEventListener('filterCategory', handleFilterCategory as EventListener);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    const newCart = addToCartUtil(product);
    setCart(newCart);
    
    // Sync to Firebase if user is logged in
    if (user) {
      saveUserCart(user.uid, newCart).catch(error => {
        console.error('Error syncing cart:', error);
      });
    }
    
    // Show cart after a brief delay
    setTimeout(() => {
      setCartOpen(true);
    }, 500);
  };

  const handleRemoveFromCart = (index: number) => {
    const newCart = removeFromCartUtil(index);
    setCart(newCart);
    
    // Sync to Firebase if user is logged in
    if (user) {
      saveUserCart(user.uid, newCart).catch(error => {
        console.error('Error syncing cart:', error);
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Scroll to shop section
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyNow = (product: Product) => {
    // Add to cart first
    const newCart = addToCartUtil(product);
    setCart(newCart);
    
    // Sync to Firebase if user is logged in
    if (user) {
      saveUserCart(user.uid, newCart).catch(error => {
        console.error('Error syncing cart:', error);
      });
    }
    
    // TODO: Navigate to checkout page directly
    // For now, open cart
    setCartOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductFromFirestore(productId);
      // Refresh products
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: string) => {
    try {
      if (id) {
        // Update existing product
        await updateProductInFirestore(id, productData);
      } else {
        // Add new product
        await addProductToFirestore(productData);
      }
      // Refresh products
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);
      setProductFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const cartCount = mounted ? getCartCount(cart) : 0;

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      <Header 
        cartCount={cartCount} 
        onCartClick={() => setCartOpen(true)} 
        products={products}
        onSearch={handleSearch}
      />
      
      {/* Admin Panel */}
      <AdminPanel onAddProduct={handleAddProduct} />
      
      <main className="flex-grow">
        <Hero />
        <Categories onCategoryClick={handleCategoryClick} />
        
        {/* Products Section with Filter Sidebar */}
        <section id="shop" className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-2">
                All Products
              </h2>
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Filter Sidebar - Takes 1 column */}
              <div className="lg:col-span-1">
                <FilterSidebar
                  onFilterChange={setFilters}
                  categories={['All', ...Array.from(new Set(products.map(p => p.category)))]}
                  minPrice={0}
                  maxPrice={10000}
                />
              </div>

              {/* Products Grid - Takes 4 columns */}
              <div className="lg:col-span-4">
                <FeaturedProducts
                  products={filteredProducts}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  isAdmin={isAdmin}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
      />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={productFormOpen}
        onClose={() => {
          setProductFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      {/* Admin Login Trigger (in Footer) */}
      {!isAdmin && (
        <button
          onClick={() => setLoginModalOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-700 transition-colors opacity-20 hover:opacity-100"
          title="Admin Login"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AdminProvider>
      <HomePage />
    </AdminProvider>
  );
}
