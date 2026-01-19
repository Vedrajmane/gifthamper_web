'use client';

import { useState, useEffect } from 'react';
import { Offer } from '@/lib/data/offers';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OffersManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [formData, setFormData] = useState({
    provider: '',
    logo: '',
    description: '',
    discount: '',
    minTransaction: 0,
    code: '',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  });

  useEffect(() => {
    // Load offers from localStorage or API
    const stored = localStorage.getItem('wordlane_offers');
    if (stored) {
      setOffers(JSON.parse(stored));
    }
  }, []);

  const saveOffers = (newOffers: Offer[]) => {
    setOffers(newOffers);
    localStorage.setItem('wordlane_offers', JSON.stringify(newOffers));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOffer: Offer = {
      id: editingOffer?.id || Date.now().toString(),
      provider: formData.provider,
      logo: formData.logo,
      description: formData.description,
      discount: formData.discount,
      minTransaction: formData.minTransaction,
      code: formData.code,
      bgColor: formData.bgColor,
      textColor: formData.textColor,
    };

    if (editingOffer) {
      saveOffers(offers.map(o => o.id === editingOffer.id ? newOffer : o));
    } else {
      saveOffers([...offers, newOffer]);
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      saveOffers(offers.filter(o => o.id !== id));
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      provider: offer.provider,
      description: offer.description,
      minTransaction: offer.minTransaction,
      maxDiscount: offer.maxDiscount,
      code: offer.code || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      provider: '',
      description: '',
      minTransaction: 0,
      maxDiscount: 0,
      code: '',
    });
    setEditingOffer(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Offers Management</h1>
          <p className="text-gray-600">Manage payment provider offers and discounts</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
                <Tag className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.provider}</h3>
            <p className="text-sm text-gray-600 mb-4">{offer.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Min Transaction:</span>
                <span className="font-semibold text-gray-900">₹{offer.minTransaction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Discount:</span>
                <span className="font-semibold text-gray-900">₹{offer.maxDiscount}</span>
              </div>
              {offer.code && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-mono font-semibold text-rose-600">{offer.code}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {offers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No offers yet. Create your first offer!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name
                </label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g., Paytm, PhonePe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g., Up to ₹300 cashback"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Transaction (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.minTransaction}
                    onChange={(e) => setFormData({ ...formData, minTransaction: parseFloat(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code (Optional)
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g., SAVE300"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {editingOffer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
