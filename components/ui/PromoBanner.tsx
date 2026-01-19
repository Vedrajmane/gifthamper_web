'use client';

import { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';

interface PromoBannerProps {
  message?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function PromoBanner({
  message = "🎉 FREE DELIVERY on orders above ₹999 | Same Day Delivery in Mumbai",
  backgroundColor = "bg-gradient-to-r from-rose-600 to-orange-600",
  textColor = "text-white",
}: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('promoBannerClosed');
    const closedDate = bannerClosed ? new Date(bannerClosed) : null;
    const today = new Date();

    // Show banner again if it was closed more than 24 hours ago
    if (closedDate && (today.getTime() - closedDate.getTime()) < 24 * 60 * 60 * 1000) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('promoBannerClosed', new Date().toISOString());
  };

  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div className={`${backgroundColor} ${textColor} py-3 px-4 relative z-50`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Truck className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium text-center">
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
