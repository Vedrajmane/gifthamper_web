'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit2, Trash2, ShoppingCart, Eye, Sparkles, Zap } from 'lucide-react';
import { Product } from '@/lib/types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  isAdmin = false,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 group flex flex-col transform hover:-translate-y-1"
    >
      {/* Image - Clickable to product detail */}
      <Link href={`/product/${product.id}`} className="block h-64 overflow-hidden relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-stone-800 shadow-sm">
            {product.category}
          </span>
          {product.isPersonalizable && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Personalizable
            </span>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && onEdit && onDelete && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(product);
              }}
              className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this product?')) {
                  onDelete(product.id);
                }
              }}
              className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`} className="block mb-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-stone-900 line-clamp-2 hover:text-rose-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-lg font-bold text-orange-600 mb-2">₹{product.price.toLocaleString()}</p>
          <p className="text-stone-600 text-sm mb-2 flex-1 line-clamp-2">
            {product.description}
          </p>
        </Link>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Buy Now Button */}
          {onBuyNow && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onBuyNow(product);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex justify-center items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </motion.button>
          )}

          {/* Add to Cart Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex justify-center items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </motion.button>

          {/* Quick View Button */}
          <Link href={`/product/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2 border-2 border-stone-300 text-stone-700 font-medium rounded-lg hover:border-rose-400 hover:text-rose-600 transition-all flex justify-center items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
