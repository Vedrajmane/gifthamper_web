'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Share2, Zap } from 'lucide-react';
import { Product } from '@/lib/types/product';
import Image from 'next/image';
import PersonalizationForm from './PersonalizationForm';
import OffersSection from './OffersSection';
import { PersonalizationData } from '@/lib/types/product';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, personalization?: PersonalizationData) => void;
  onBuyNow?: (product: Product, personalization?: PersonalizationData) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({});

  if (!product) return null;

  const images = product.images || [product.imageUrl];

  const handleAddToCart = () => {
    onAddToCart(product, product.isPersonalizable ? personalizationData : undefined);
    onClose();
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, product.isPersonalizable ? personalizationData : undefined);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-8 md:inset-16 z-[70] flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                {/* Left: Images */}
                <div>
                  {/* Main Image */}
                  <div className="relative h-96 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <Image
                      src={images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.isPersonalizable && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        ✨ Personalizable
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {images.length > 1 && (
                    <div className="flex gap-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-rose-500 scale-105'
                              : 'border-gray-200 hover:border-rose-300'
                          }`}
                        >
                          <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold mb-2">
                      {product.category}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    <p className="text-2xl font-bold text-rose-600">₹{product.price.toLocaleString()}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>

                  {/* Personalization Form */}
                  {product.isPersonalizable && (
                    <PersonalizationForm
                      options={product.personalizationOptions}
                      onDataChange={setPersonalizationData}
                    />
                  )}

                  {/* Offers */}
                  <OffersSection productPrice={product.price} />

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {onBuyNow && (
                      <button
                        onClick={handleBuyNow}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Zap className="w-5 h-5" />
                        Buy Now
                      </button>
                    )}

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>

                    {/* Secondary Actions */}
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-rose-400 hover:text-rose-600 transition-all flex items-center justify-center gap-2">
                        <Heart className="w-5 h-5" />
                        Wishlist
                      </button>
                      <button className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-rose-400 hover:text-rose-600 transition-all flex items-center justify-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <strong>🚚 Delivery:</strong> Available across Mumbai
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>📦 Same-day delivery</strong> available for orders before 2 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
