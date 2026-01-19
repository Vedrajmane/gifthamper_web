'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnail Navigation - Vertical on desktop, horizontal on mobile */}
      <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-w-full lg:max-w-[100px]">
        {displayImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 border-2 rounded-lg overflow-hidden transition-all ${
              selectedIndex === index
                ? 'border-rose-500 ring-2 ring-rose-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} - View ${index + 1}`}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="order-1 lg:order-2 flex-1 relative">
        <div 
          className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <Image
            src={displayImages[selectedIndex]}
            alt={productName}
            fill
            className={`object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            priority
          />

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Zoom Hint */}
        {!isZoomed && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Hover to zoom
          </p>
        )}
      </div>
    </div>
  );
}
