'use client';

import { motion } from 'framer-motion';
import { categories } from '@/lib/data/categories';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift, Heart, Briefcase, Home, Baby, Package } from 'lucide-react';

interface CategoriesProps {
  onCategoryClick?: (slug: string) => void;
}

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  'baby-shower': Baby,
  'wedding': Heart,
  'corporate': Briefcase,
  'housewarming': Home,
  'naming-ceremony': Baby,
  'hamper': Package,
};

const categoryColors: Record<string, string> = {
  'baby-shower': 'from-pink-400 to-rose-400',
  'wedding': 'from-rose-400 to-pink-400',
  'corporate': 'from-purple-400 to-indigo-400',
  'housewarming': 'from-blue-400 to-cyan-400',
  'naming-ceremony': 'from-fuchsia-400 to-pink-400',
  'hamper': 'from-amber-400 to-orange-400',
};

export default function Categories({ onCategoryClick }: CategoriesProps) {
  const scrollToShop = () => {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-12 bg-gradient-to-b from-white to-rose-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-orange-100 px-4 py-2 rounded-full mb-3"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-semibold text-rose-700">Gift Collections</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-gray-900 mb-2">
            Shop by{' '}
            <span className="bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Occasion
            </span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Handpicked collections for every special moment
          </p>
        </motion.div>

        {/* Categories Grid - Compact Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.slug] || Gift;
            const gradientColor = categoryColors[category.slug] || 'from-gray-400 to-gray-500';
            
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  onClick={(e) => {
                    if (onCategoryClick) {
                      e.preventDefault();
                      onCategoryClick(category.name);
                      scrollToShop();
                    }
                  }}
                  className="group block"
                >
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Icon Container */}
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      {/* Category Name */}
                      <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      {/* Description - Compact */}
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {category.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-rose-400/50 rounded-xl transition-all duration-300" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
