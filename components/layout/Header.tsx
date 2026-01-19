'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSelector from '../ui/LocationSelector';
import SearchBar from '../ui/SearchBar';
import { Product } from '@/lib/types/product';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  products?: Product[];
  onSearch?: (query: string) => void;
}

export default function Header({ cartCount, onCartClick, products = [], onSearch }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#categories', label: 'Gifts' },
    { href: '#shop', label: 'Shop' },
  ];

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    // Scroll to shop section
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/95 backdrop-blur-md'
      } border-b border-stone-100`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="text-2xl font-bold tracking-wider text-stone-900 italic group-hover:text-orange-600 transition-colors">
              Martini by Nidhi
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-orange-600">
              Est. 2003 • Mumbai
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors hover:scale-105 transform duration-200"
              >
                {link.label}
              </a>
            ))}
            
            {/* Shop Link */}
            <Link
              href="/shop"
              className="text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors hover:scale-105 transform duration-200"
            >
              All Products
            </Link>

            {/* Location Selector */}
            <LocationSelector />

            {/* Cart Button */}
            <button
              onClick={onCartClick}
              className="relative p-2 text-stone-600 hover:text-orange-600 transition-colors hover:scale-110 active:scale-95 duration-200"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative p-2 text-stone-600 hover:text-stone-900 active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-orange-600 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none p-2 active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Below main header */}
        <div className="pb-4 hidden md:block">
          <SearchBar products={products} onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-stone-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBar products={products} onSearch={handleSearch} />
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-stone-600 hover:bg-stone-50 rounded-lg active:bg-orange-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
