'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { Product } from '@/lib/types/product';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>, id?: string) => void;
  product?: Product | null;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  product,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Baby Shower',
    imageUrl: '',
    isPersonalizable: false,
    personalizationOptions: {
      allowName: true,
      allowImage: true,
      allowMessage: true,
      maxMessageLength: 200,
    },
  });

  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [uploadedImage, setUploadedImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        imageUrl: product.imageUrl,
        isPersonalizable: product.isPersonalizable || false,
        personalizationOptions: product.personalizationOptions ? {
          allowName: product.personalizationOptions.allowName ?? true,
          allowImage: product.personalizationOptions.allowImage ?? true,
          allowMessage: product.personalizationOptions.allowMessage ?? true,
          maxMessageLength: product.personalizationOptions.maxMessageLength ?? 200,
        } : {
          allowName: true,
          allowImage: true,
          allowMessage: true,
          maxMessageLength: 200,
        },
      });
      // Check if it's a data URL (uploaded image) or regular URL
      if (product.imageUrl.startsWith('data:')) {
        setImageInputMode('upload');
        setUploadedImage(product.imageUrl);
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Baby Shower',
        imageUrl: '',
        isPersonalizable: false,
        personalizationOptions: {
          allowName: true,
          allowImage: true,
          allowMessage: true,
          maxMessageLength: 200,
        },
      });
      setUploadedImage('');
    }
  }, [product, isOpen]);

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
        setUploadedImage(base64String);
        setFormData({ ...formData, imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate image
    if (!formData.imageUrl && !uploadedImage) {
      alert('Please provide an image (upload or URL)');
      return;
    }

    onSave(
      {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: imageInputMode === 'upload' ? uploadedImage : formData.imageUrl,
        isPersonalizable: formData.isPersonalizable,
        personalizationOptions: formData.isPersonalizable ? formData.personalizationOptions : undefined,
      },
      product?.id
    );
    onClose();
  };

  const categories = [
    'Baby Shower',
    'Wedding',
    'Corporate',
    'Hamper',
    'Housewarming',
    'Naming Ceremony',
    'Crystal',
    'Candle',
    'Pregnancy Announcement',
  ];

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0 sm:p-4 z-[70]"
          >
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-stone-900">
                  {product ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={2}
                    required
                    className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Input Tabs */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Product Image
                  </label>
                  
                  {/* Tab Buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                        imageInputMode === 'url'
                          ? 'bg-orange-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <LinkIcon className="w-4 h-4" />
                      Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                        imageInputMode === 'upload'
                          ? 'bg-orange-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                  </div>

                  {/* URL Input */}
                  {imageInputMode === 'url' && (
                    <div>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="https://placehold.co/600x600/..."
                        className="w-full px-3 py-3 text-base border border-stone-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <p className="text-xs text-stone-500 mt-1">
                        Paste a link from Unsplash or your image host.
                      </p>
                    </div>
                  )}

                  {/* File Upload */}
                  {imageInputMode === 'upload' && (
                    <div>
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-stone-50 text-stone-500 rounded-lg border-2 border-dashed border-stone-300 cursor-pointer hover:bg-stone-100 transition-colors">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">
                          {uploadedImage ? 'Change Image' : 'Click to upload image'}
                        </span>
                        <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {(formData.imageUrl || uploadedImage) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-stone-700 mb-2">Preview:</p>
                    <img
                      src={imageInputMode === 'upload' ? uploadedImage : formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}

                {/* Personalization Options */}
                <div className="border-t border-stone-200 pt-4 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPersonalizable}
                      onChange={(e) =>
                        setFormData({ ...formData, isPersonalizable: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <span className="text-sm font-semibold text-stone-700">
                        ✨ Personalizable Product
                      </span>
                      <p className="text-xs text-stone-500">
                        Allow customers to add name, image, or message
                      </p>
                    </div>
                  </label>

                  {formData.isPersonalizable && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg space-y-3">
                      <p className="text-sm font-medium text-purple-900 mb-2">
                        Personalization Options:
                      </p>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.personalizationOptions.allowName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              personalizationOptions: {
                                ...formData.personalizationOptions,
                                allowName: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded border-gray-300 text-purple-600"
                        />
                        <span className="text-sm text-stone-700">Allow customer name</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.personalizationOptions.allowImage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              personalizationOptions: {
                                ...formData.personalizationOptions,
                                allowImage: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded border-gray-300 text-purple-600"
                        />
                        <span className="text-sm text-stone-700">Allow image upload</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.personalizationOptions.allowMessage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              personalizationOptions: {
                                ...formData.personalizationOptions,
                                allowMessage: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 rounded border-gray-300 text-purple-600"
                        />
                        <span className="text-sm text-stone-700">Allow personal message</span>
                      </label>

                      {formData.personalizationOptions.allowMessage && (
                        <div className="ml-6">
                          <label className="text-xs text-stone-600 block mb-1">
                            Max message length:
                          </label>
                          <input
                            type="number"
                            value={formData.personalizationOptions.maxMessageLength}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalizationOptions: {
                                  ...formData.personalizationOptions,
                                  maxMessageLength: parseInt(e.target.value) || 200,
                                },
                              })
                            }
                            min="50"
                            max="500"
                            className="w-24 px-2 py-1 text-sm border border-purple-300 rounded focus:ring-2 focus:ring-purple-500 focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 text-white py-4 rounded-lg font-bold hover:bg-stone-800 transition-all active:scale-95 shadow-lg mt-2"
                >
                  {product ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
