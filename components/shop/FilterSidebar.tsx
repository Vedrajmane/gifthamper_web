'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/Slider';
import { X } from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface FilterOptions {
  priceRange: [number, number];
  selectedCategories: string[];
  selectedSubcategories: string[];
}

export default function FilterSidebar({
  onFilterChange,
  categories,
  minPrice = 0,
  maxPrice = 10000,
}: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    onFilterChange({
      priceRange,
      selectedCategories,
      selectedSubcategories: [],
    });
  }, [priceRange, selectedCategories]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedCategories([]);
  };

  const activeFilterCount = 
    (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0) +
    selectedCategories.length;

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-rose-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-sm font-bold">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 lg:w-full
          bg-white border lg:border border-gray-200 rounded-xl
          p-5 overflow-y-auto z-40 transition-transform duration-300 shadow-lg lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
          
          <div className="space-y-4">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={100}
              value={priceRange}
              onChange={setPriceRange}
            />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                ₹{priceRange[0].toLocaleString()}
              </span>
              <span className="text-gray-400">to</span>
              <span className="text-gray-600">
                ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
          
          <div className="space-y-2">
            {categories.filter(cat => cat !== 'All').map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button (Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
