'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface PersonalizationFormProps {
  onPersonalizationChange: (data: PersonalizationData) => void;
  isPersonalizable: boolean;
}

export interface PersonalizationData {
  recipientName?: string;
  occasion?: string;
  customMessage?: string;
  uploadedImageUrl?: string;
}

const occasions = [
  'Birthday',
  'Anniversary',
  'Wedding',
  'Baby Shower',
  'Diwali',
  'Holi',
  'Christmas',
  'New Year',
  'Valentine\'s Day',
  'Mother\'s Day',
  'Father\'s Day',
  'Raksha Bandhan',
  'Graduation',
  'Housewarming',
  'Thank You',
  'Get Well Soon',
  'Congratulations',
  'Other',
];

export default function PersonalizationForm({ 
  onPersonalizationChange, 
  isPersonalizable 
}: PersonalizationFormProps) {
  const [recipientName, setRecipientName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  if (!isPersonalizable) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        updatePersonalization({ uploadedImageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    updatePersonalization({ uploadedImageUrl: undefined });
  };

  const updatePersonalization = (updates: Partial<PersonalizationData>) => {
    onPersonalizationChange({
      recipientName: recipientName || undefined,
      occasion: occasion || undefined,
      customMessage: customMessage || undefined,
      uploadedImageUrl: imagePreview || undefined,
      ...updates,
    });
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-purple-600 text-2xl">✨</span>
        <h3 className="text-lg font-bold text-purple-900">Personalize Your Gift</h3>
      </div>

      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Name (Optional)
        </label>
        <input
          type="text"
          value={recipientName}
          onChange={(e) => {
            setRecipientName(e.target.value);
            updatePersonalization({ recipientName: e.target.value || undefined });
          }}
          placeholder="e.g., Priya, Rahul"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Occasion */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Occasion (Optional)
        </label>
        <select
          value={occasion}
          onChange={(e) => {
            setOccasion(e.target.value);
            updatePersonalization({ occasion: e.target.value || undefined });
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select an occasion</option>
          {occasions.map((occ) => (
            <option key={occ} value={occ}>
              {occ}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (Optional)
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            updatePersonalization({ customMessage: e.target.value || undefined });
          }}
          placeholder="Add a special message..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          Max 200 characters
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Photo (Optional)
        </label>
        
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        ) : (
          <div className="relative w-full h-32 border-2 border-purple-300 rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Uploaded personalization"
              fill
              className="object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-purple-700 bg-purple-100 p-3 rounded-lg">
        💡 Personalization details will be included with your order
      </p>
    </div>
  );
}
