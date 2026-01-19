'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SearchBarProps {
  products: Product[];
  onSearch: (query: string) => void;
  onProductSelect?: (product: Product) => void;
}

interface SearchResult {
  type: 'category' | 'subcategory' | 'product' | 'price';
  label: string;
  value: string;
  product?: Product;
}

export default function SearchBar({ products, onSearch, onProductSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Get unique categories
    const categories = Array.from(new Set(products.map(p => p.category)));
    
    // Search in categories
    categories.forEach(category => {
      if (category.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'category',
          label: category,
          value: category,
        });
      }
    });

    // Get unique subcategories
    const subcategories = Array.from(
      new Set(products.filter(p => p.subcategory).map(p => p.subcategory!))
    );

    // Search in subcategories
    subcategories.forEach(subcategory => {
      if (subcategory.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'subcategory',
          label: subcategory,
          value: subcategory,
        });
      }
    });

    // Search in products by name
    products.forEach(product => {
      if (product.name.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          type: 'product',
          label: product.name,
          value: product.id,
          product,
        });
      }
    });

    // Search by price range
    const priceQuery = parseFloat(query);
    if (!isNaN(priceQuery)) {
      const priceMatches = products.filter(
        p => Math.abs(p.price - priceQuery) <= 500 // Within ₹500 range
      );
      
      if (priceMatches.length > 0) {
        searchResults.push({
          type: 'price',
          label: `Products around ₹${priceQuery}`,
          value: priceQuery.toString(),
        });
      }
    }

    setResults(searchResults.slice(0, 8)); // Limit to 8 results
  }, [query, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product' && result.product && onProductSelect) {
      onProductSelect(result.product);
    } else {
      onSearch(result.value);
    }
    setQuery('');
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    onSearch('');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for gifts, categories, or prices..."
            className="w-full pl-12 pr-12 py-3 rounded-full border-2 border-gray-200 focus:border-rose-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.value}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full px-4 py-3 hover:bg-rose-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
              >
                {result.type === 'product' && result.product ? (
                  <>
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={result.product.imageUrl}
                        alt={result.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{result.product.name}</p>
                      <p className="text-sm text-gray-500">₹{result.product.price}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center flex-shrink-0">
                      {result.type === 'category' && (
                        <span className="text-rose-600 font-bold text-sm">C</span>
                      )}
                      {result.type === 'subcategory' && (
                        <span className="text-orange-600 font-bold text-sm">S</span>
                      )}
                      {result.type === 'price' && (
                        <span className="text-green-600 font-bold text-sm">₹</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{result.label}</p>
                      <p className="text-xs text-gray-500 capitalize">{result.type}</p>
                    </div>
                  </>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
