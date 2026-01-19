'use client';

import Link from 'next/link';
import { Instagram, Mail, Facebook, ChevronRight, Lock } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Baby Shower Gifts', category: 'Baby Shower' },
    { name: 'Corporate Gifting', category: 'Corporate' },
    { name: 'Wedding Favors', category: 'Wedding' },
  ];

  const handleCategoryClick = (category: string) => {
    // Scroll to shop section and filter
    const shopSection = document.getElementById('shop');
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch custom event for filtering
      window.dispatchEvent(new CustomEvent('filterCategory', { detail: category }));
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12 border-b border-stone-800 pb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-serif italic mb-4 text-white">
              Martini by Nidhi
            </h3>
            <p className="text-sm text-stone-500 mb-4 leading-relaxed">
              Turning ideas into reality since 2003. We specialize in turning your special
              moments into lifelong memories through bespoke gifting and styling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-stone-400">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleCategoryClick(link.category)}
                    className="hover:text-orange-500 cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-4">
              Contact Us
            </h4>
            <p className="text-sm text-stone-400 mb-2">Mumbai, Maharashtra</p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/martinibynidhi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-orange-600 hover:text-white transition-all active:scale-95"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@martinibynidhi.com"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-orange-600 hover:text-white transition-all active:scale-95"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-orange-600 hover:text-white transition-all active:scale-95"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center">
          <p className="text-stone-500 text-sm">
            © 2024 Martini by Nidhi. All rights reserved. Mumbai.
          </p>
        </div>
      </div>
    </footer>
  );
}
