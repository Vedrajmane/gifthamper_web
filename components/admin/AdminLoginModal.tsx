'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock } from 'lucide-react';
import { useAdmin } from '@/lib/context/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      onClose();
      setUsername('');
      setPassword('');
      // Scroll to top to see admin panel
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Invalid username or password');
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
            className="fixed inset-0 flex items-center justify-center p-4 z-[70]"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-orange-600" />
                  <h3 className="text-xl font-bold text-stone-900">Admin Login</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="Enter password"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-stone-900 text-white py-3 rounded-lg font-bold hover:bg-stone-800 transition-all active:scale-95 shadow-md"
                >
                  Login
                </button>

                <p className="text-xs text-stone-500 text-center">
                  Default: admin / admin123
                </p>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
