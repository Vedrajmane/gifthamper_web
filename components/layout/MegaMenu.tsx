'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface MegaMenuProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    subcategories?: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="hidden lg:block bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 py-4">
          {categories.slice(0, 6).map((category) => (
            <div
              key={category.id}
              className="relative group"
              onMouseEnter={() => setActiveCategory(category.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              {/* Category Link */}
              <Link
                href={`/shop?category=${category.slug}`}
                className="flex items-center gap-1 text-gray-700 hover:text-rose-600 font-medium transition-colors"
              >
                {category.name}
                {category.subcategories && category.subcategories.length > 0 && (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Link>

              {/* Mega Menu Dropdown */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div
                  className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-6 min-w-[300px] transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {/* Subcategories List */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-gray-900 mb-3">
                        {category.name}
                      </h3>
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?category=${category.slug}&subcategory=${sub.slug}`}
                          className="block text-sm text-gray-600 hover:text-rose-600 hover:translate-x-1 transition-all"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>

                    {/* Category Image */}
                    <div className="relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* View All Link */}
          <Link
            href="/shop"
            className="text-rose-600 hover:text-rose-700 font-medium transition-colors ml-auto"
          >
            View All →
          </Link>
        </div>
      </div>
    </div>
  );
}
