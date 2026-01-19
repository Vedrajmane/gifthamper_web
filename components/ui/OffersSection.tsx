'use client';

import { motion } from 'framer-motion';
import { offers, Offer } from '@/lib/data/offers';
import { Info } from 'lucide-react';

interface OffersSectionProps {
  productPrice?: number;
}

export default function OffersSection({ productPrice }: OffersSectionProps) {
  const applicableOffers = productPrice
    ? offers.filter(offer => !offer.minTransaction || productPrice >= offer.minTransaction)
    : offers;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <span className="text-white text-xl">🎁</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Offers Available</h3>
          <p className="text-sm text-gray-600">Save more with these exclusive deals</p>
        </div>
      </div>

      <div className="space-y-3">
        {applicableOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${offer.bgColor} rounded-xl p-4 border border-opacity-20`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{offer.logo}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${offer.textColor}`}>{offer.provider}</span>
                  <span className="px-2 py-0.5 bg-white rounded-full text-xs font-semibold text-green-700">
                    {offer.discount}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{offer.description}</p>
                {offer.code && (
                  <div className="mt-2 flex items-center gap-2">
                    <code className="px-3 py-1 bg-white rounded-lg text-xs font-mono font-bold text-gray-900 border border-dashed border-gray-300">
                      {offer.code}
                    </code>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                      Copy
                    </button>
                  </div>
                )}
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {productPrice && applicableOffers.length < offers.length && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Add ₹
            {Math.min(
              ...offers
                .filter(o => o.minTransaction && productPrice < o.minTransaction)
                .map(o => o.minTransaction! - productPrice)
            )}{' '}
            more to unlock additional offers!
          </p>
        </div>
      )}
    </div>
  );
}
