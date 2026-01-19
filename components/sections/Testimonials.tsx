'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image?: string;
  productPurchased?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Bandra, Mumbai',
    rating: 5,
    comment: 'Absolutely loved the baby shower hamper! The personalization was perfect and delivery was on time. Highly recommend Martini by Nidhi!',
    productPurchased: 'Baby Shower Hamper',
  },
  {
    id: '2',
    name: 'Rahul Mehta',
    location: 'Andheri, Mumbai',
    rating: 5,
    comment: 'Ordered a corporate gift set for our clients. The quality and presentation exceeded our expectations. Will definitely order again!',
    productPurchased: 'Corporate Gift Set',
  },
  {
    id: '3',
    name: 'Sneha Patel',
    location: 'Juhu, Mumbai',
    rating: 5,
    comment: 'The wedding favor boxes were stunning! All our guests loved them. Thank you for making our special day even more memorable.',
    productPurchased: 'Wedding Favors',
  },
  {
    id: '4',
    name: 'Amit Kumar',
    location: 'Powai, Mumbai',
    rating: 5,
    comment: 'Same-day delivery saved me! Ordered a housewarming gift in the morning and it arrived by evening. Excellent service!',
    productPurchased: 'Housewarming Gift',
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-semibold text-gray-700">Customer Reviews</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of happy customers across Mumbai who trust us for their gifting needs
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <Quote className="w-6 h-6 text-rose-600" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= testimonial.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                &quot;{testimonial.comment}&quot;
              </p>

              {/* Product */}
              {testimonial.productPurchased && (
                <p className="text-sm text-rose-600 font-medium mb-4">
                  Purchased: {testimonial.productPurchased}
                </p>
              )}

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-600 mb-1">10,000+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-600 mb-1">4.9/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-600 mb-1">20+ Years</div>
            <div className="text-sm text-gray-600">In Business</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-rose-600 mb-1">100%</div>
            <div className="text-sm text-gray-600">Quality Guaranteed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
