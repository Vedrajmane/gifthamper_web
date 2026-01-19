'use client';

import { useState } from 'react';
import { Calendar, Clock, Gift, MessageSquare } from 'lucide-react';

interface CheckoutOptionsProps {
  onDeliveryDateChange: (date: Date) => void;
  onDeliverySlotChange: (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Midnight') => void;
  onGiftMessageChange: (message: string) => void;
  onGiftWrappingChange: (enabled: boolean) => void;
  deliveryDate?: Date;
  deliverySlot?: string;
  giftMessage?: string;
  giftWrapping?: boolean;
}

export default function CheckoutOptions({
  onDeliveryDateChange,
  onDeliverySlotChange,
  onGiftMessageChange,
  onGiftWrappingChange,
  deliveryDate,
  deliverySlot = 'Morning',
  giftMessage = '',
  giftWrapping = false,
}: CheckoutOptionsProps) {
  const [showGiftMessage, setShowGiftMessage] = useState(!!giftMessage);

  // Get next 7 days for delivery options
  const getDeliveryDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const deliveryDates = getDeliveryDates();
  const deliverySlots = ['Morning', 'Afternoon', 'Evening', 'Midnight'] as const;

  return (
    <div className="space-y-4">
      {/* Delivery Date Selector */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Select Delivery Date</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {deliveryDates.map((date, index) => {
            const isSelected = deliveryDate?.toDateString() === date.toDateString();
            const isToday = index === 0;
            
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => onDeliveryDateChange(date)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                    : 'border-blue-200 bg-white text-gray-700 hover:border-blue-400'
                }`}
              >
                <div className="text-xs font-medium">
                  {isToday ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short' })}
                </div>
                <div className="text-sm font-bold">
                  {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Delivery Time Slot */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Delivery Time Slot</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {deliverySlots.map((slot) => {
            const isSelected = deliverySlot === slot;
            const timeRanges = {
              Morning: '8 AM - 12 PM',
              Afternoon: '12 PM - 4 PM',
              Evening: '4 PM - 8 PM',
              Midnight: '11 PM - 12 AM',
            };

            return (
              <button
                key={slot}
                type="button"
                onClick={() => onDeliverySlotChange(slot)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500 text-white shadow-md'
                    : 'border-purple-200 bg-white text-gray-700 hover:border-purple-400'
                }`}
              >
                <div className="font-bold text-sm">{slot}</div>
                <div className="text-xs opacity-90">{timeRanges[slot]}</div>
                {slot === 'Midnight' && (
                  <div className="text-xs mt-1 font-semibold">✨ Special</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gift Wrapping */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={giftWrapping}
            onChange={(e) => onGiftWrappingChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <div className="flex items-center gap-2 flex-1">
            <Gift className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-sm font-bold text-gray-900">Add Gift Wrapping</span>
              <p className="text-xs text-gray-600">Beautiful premium wrapping (+₹50)</p>
            </div>
          </div>
        </label>
      </div>

      {/* Gift Message */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100">
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={showGiftMessage}
            onChange={(e) => {
              setShowGiftMessage(e.target.checked);
              if (!e.target.checked) onGiftMessageChange('');
            }}
            className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
          />
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-bold text-gray-900">Add Gift Message</span>
          </div>
        </label>

        {showGiftMessage && (
          <div>
            <textarea
              value={giftMessage}
              onChange={(e) => onGiftMessageChange(e.target.value)}
              placeholder="Write a heartfelt message for your loved one..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 rounded-xl border-2 border-rose-200 focus:border-rose-500 focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {giftMessage.length} / 200 characters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
