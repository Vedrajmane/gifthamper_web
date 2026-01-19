'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CategoryInfo } from '@/lib/types/product';

interface CategoryCardProps {
  category: CategoryInfo;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="cursor-pointer transform transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-xl transition-shadow group">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-5 left-5 text-white">
          <h3 className="font-bold text-2xl mb-1">{category.name}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1 group-hover:translate-x-2 transition-transform">
            Explore Gifts
            <ArrowRight className="w-4 h-4" />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
