'use client';

import { Star } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  verified?: boolean;
  helpful?: number;
}

interface ReviewsListProps {
  reviews: Review[];
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewsList({ reviews, onHelpful }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">{review.userName}</span>
                {review.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          <p className="text-gray-700 mb-4">{review.comment}</p>

          {/* Helpful Button */}
          {onHelpful && (
            <button
              onClick={() => onHelpful(review.id)}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              👍 Helpful {review.helpful ? `(${review.helpful})` : ''}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
