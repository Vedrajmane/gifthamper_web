'use client';

import { useState } from 'react';
import { Upload, X, User, MessageSquare } from 'lucide-react';
import { PersonalizationData } from '@/lib/types/product';
import Image from 'next/image';

interface PersonalizationFormProps {
  options?: {
    allowName?: boolean;
    allowImage?: boolean;
    allowMessage?: boolean;
    maxMessageLength?: number;
  };
  onDataChange: (data: PersonalizationData) => void;
  initialData?: PersonalizationData;
}

export default function PersonalizationForm({
  options = { allowName: true, allowImage: true, allowMessage: true, maxMessageLength: 200 },
  onDataChange,
  initialData,
}: PersonalizationFormProps) {
  const [data, setData] = useState<PersonalizationData>(initialData || {});
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.customerImage || null);

  const handleNameChange = (name: string) => {
    const newData = { ...data, customerName: name };
    setData(newData);
    onDataChange(newData);
  };

  const handleMessageChange = (message: string) => {
    const maxLength = options.maxMessageLength || 200;
    if (message.length <= maxLength) {
      const newData = { ...data, message };
      setData(newData);
      onDataChange(newData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        const newData = { ...data, customerImage: base64String };
        setData(newData);
        onDataChange(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    const newData = { ...data, customerImage: undefined };
    setData(newData);
    onDataChange(newData);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white text-xl">✨</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Add Personalization Details</h3>
          <p className="text-sm text-gray-600">Make this gift extra special</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        {options.allowName && (
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Recipient Name
            </label>
            <input
              type="text"
              value={data.customerName || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter recipient's name"
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* Message Input */}
        {options.allowMessage && (
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4" />
              Personal Message
            </label>
            <textarea
              value={data.message || ''}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Add a heartfelt message..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.message?.length || 0} / {options.maxMessageLength || 200} characters
            </p>
          </div>
        )}

        {/* Image Upload */}
        {options.allowImage && (
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Upload className="w-4 h-4" />
              Upload Photo
            </label>
            
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-purple-200">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block w-full h-48 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <Upload className="w-12 h-12 mb-2" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                </div>
              </label>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-purple-100 rounded-lg">
        <p className="text-xs text-purple-800">
          💡 <strong>Note:</strong> Personalization details will be printed/engraved on your gift as per the design.
        </p>
      </div>
    </div>
  );
}
