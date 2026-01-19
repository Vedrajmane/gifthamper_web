'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/product/ImageGallery';
import ProductTabs from '@/components/product/ProductTabs';
import PersonalizationForm, { PersonalizationData } from '@/components/product/PersonalizationForm';
import { getProductById } from '@/lib/firebase/products.service';
import { Product } from '@/lib/types/product';
import { addToCart as addToCartUtil, getCart, getCartCount } from '@/lib/utils/cart';
import { useAuth } from '@/lib/context/auth.context';
import { saveUserCart } from '@/lib/firebase/cart.service';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!params.id || typeof params.id !== 'string') {
        router.push('/');
        return;
      }

      try {
        const productData = await getProductById(params.id);
        if (!productData) {
          router.push('/');
          return;
        }
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
    setCartCount(getCartCount(getCart()));
  }, [params.id, router]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAddingToCart(true);
    try {
      const newCart = addToCartUtil(product);
      setCartCount(getCartCount(newCart));

      // Sync to Firebase if user is logged in
      if (user) {
        await saveUserCart(user.uid, newCart);
      }

      // Show success message (you can add a toast notification here)
      setTimeout(() => setAddingToCart(false), 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Prepare images array (use images if available, otherwise fall back to imageUrl)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.imageUrl];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header cartCount={cartCount} onCartClick={() => router.push('/')} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/" className="hover:text-rose-600">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ImageGallery images={productImages} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.averageRating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.round(product.averageRating!)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">inclusive of all taxes</span>
              </div>
            </div>

            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {product.subcategory}
                </span>
              )}
              {product.isPersonalizable && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Personalizable
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Delivery Info Highlight */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ Free delivery on orders above ₹999
              </p>
              <p className="text-sm text-green-800">
                ✓ Same day delivery available in Mumbai
              </p>
            </div>

            {/* Personalization Form */}
            {product.isPersonalizable && (
              <PersonalizationForm
                isPersonalizable={product.isPersonalizable}
                onPersonalizationChange={(data) => {
                  // Store personalization data for when adding to cart
                  setPersonalizationData(data);
                }}
              />
            )}
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <ProductTabs
            description={product.description}
            instructions={product.instructions}
            deliveryInfo={product.deliveryInfo}
          />
        </div>

        {/* Reviews Section - Placeholder for Phase 4 */}
        <div className="mt-12 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-playfair font-bold mb-6">Customer Reviews</h2>
          <p className="text-gray-500">Reviews coming soon...</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
