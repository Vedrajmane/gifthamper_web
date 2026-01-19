'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, MessageCircle } from 'lucide-react';
import { CartItem } from '@/lib/types/product';
import { getCartTotal } from '@/lib/utils/cart';
import { openWhatsAppOrder } from '@/lib/utils/whatsapp';

interface CartSidebarProps {
  isOpen: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemoveItem: (index: number) => void;
}

export default function CartSidebar({
  isOpen,
  cart,
  onClose,
  onRemoveItem,
}: CartSidebarProps) {
  const total = getCartTotal(cart);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    openWhatsAppOrder(cart);
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="text-orange-600" />
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors active:scale-95"
              >
                <X />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-stone-400 opacity-60">
                  <ShoppingBag className="w-12 h-12 mb-2" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex gap-4 items-center bg-stone-50 p-3 rounded-lg border border-stone-100 shadow-sm"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-stone-600 text-xs">₹{item.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-stone-400 hover:text-red-500 p-2 rounded-full hover:bg-white transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100 bg-stone-50">
              <div className="flex justify-between items-center mb-4 text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>
              <p className="text-xs text-stone-500 text-center mt-3">
                You will be redirected to WhatsApp to confirm your order.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
