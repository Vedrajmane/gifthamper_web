'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, LogOut, Plus, FolderTree, Package } from 'lucide-react';
import { useAdmin } from '@/lib/context/AdminContext';
import CategoryManagement from './CategoryManagement';

interface AdminPanelProps {
  onAddProduct: () => void;
}

export default function AdminPanel({ onAddProduct }: AdminPanelProps) {
  const { isAdmin, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  if (!isAdmin) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-stone-900 text-white py-4 px-6 mt-20 border-b border-orange-500 relative z-30"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldCheck className="text-orange-500" />
            Admin Dashboard
          </h3>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'categories'
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-700 hover:bg-stone-600 text-white'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              Categories
            </button>
            {activeTab === 'products' && (
              <button
                onClick={onAddProduct}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
            <button
              onClick={logout}
              className="flex-1 md:flex-none bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Management Section */}
      {activeTab === 'categories' && (
        <div className="bg-stone-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryManagement />
          </div>
        </div>
      )}
    </>
  );
}
