'use client';

import { DeliveryStatus } from '@/lib/types/order';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface DeliveryTrackerProps {
  deliveryStatus: DeliveryStatus;
}

const statusIcons = {
  'Confirmed': Clock,
  'Packed': Package,
  'Shipped': Truck,
  'Out for Delivery': Truck,
  'Delivered': CheckCircle,
  'Cancelled': XCircle,
};

const statusColors = {
  'Confirmed': 'text-blue-600 bg-blue-100',
  'Packed': 'text-purple-600 bg-purple-100',
  'Shipped': 'text-indigo-600 bg-indigo-100',
  'Out for Delivery': 'text-orange-600 bg-orange-100',
  'Delivered': 'text-green-600 bg-green-100',
  'Cancelled': 'text-red-600 bg-red-100',
};

export default function DeliveryTracker({ deliveryStatus }: DeliveryTrackerProps) {
  const StatusIcon = statusIcons[deliveryStatus.status];
  const statusColor = statusColors[deliveryStatus.status];

  const allStatuses: Array<DeliveryStatus['status']> = [
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const currentIndex = allStatuses.indexOf(deliveryStatus.status);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-full ${statusColor} flex items-center justify-center`}>
          <StatusIcon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Order #{deliveryStatus.orderId}</h3>
          <p className="text-sm text-gray-600">{deliveryStatus.status}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex justify-between mb-2">
          {allStatuses.map((status, index) => (
            <div key={status} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentIndex
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center max-w-[80px]">{status}</p>
            </div>
          ))}
        </div>
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (allStatuses.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Estimated Delivery */}
      {deliveryStatus.estimatedDelivery && (
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-700">
            <strong>Estimated Delivery:</strong>{' '}
            {new Date(deliveryStatus.estimatedDelivery).toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Updates Timeline */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Tracking Updates</h4>
        {deliveryStatus.updates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{update.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(update.timestamp).toLocaleString('en-IN')}
                {update.location && ` • ${update.location}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
