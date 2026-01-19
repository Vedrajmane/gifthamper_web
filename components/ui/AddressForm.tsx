'use client';

import { useState } from 'react';
import { MapPin, Phone, Home, Building, Navigation } from 'lucide-react';
import { Address } from '@/lib/types/order';
import { mumbaiAreas, validatePincode } from '@/lib/data/mumbai-areas';

interface AddressFormProps {
  onSave: (address: Address) => void;
  initialAddress?: Address;
  onCancel?: () => void;
}

export default function AddressForm({ onSave, initialAddress, onCancel }: AddressFormProps) {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      fullName: '',
      phoneNumber: '',
      houseNumber: '',
      buildingName: '',
      street: '',
      landmark: '',
      area: '',
      pincode: '',
      addressType: 'Home',
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pincodeValid, setPincodeValid] = useState<boolean | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!address.phoneNumber.match(/^[6-9]\d{9}$/)) {
      newErrors.phoneNumber = 'Enter valid 10-digit mobile number';
    }
    if (!address.houseNumber.trim()) newErrors.houseNumber = 'House/Flat number is required';
    if (!address.street.trim()) newErrors.street = 'Street/Area is required';
    if (!address.area) newErrors.area = 'Please select your area';
    if (!address.pincode.match(/^\d{6}$/)) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    } else {
      const validArea = validatePincode(address.pincode);
      if (!validArea) {
        newErrors.pincode = 'We currently deliver only in Mumbai';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePincodeChange = (pincode: string) => {
    setAddress({ ...address, pincode });
    
    if (pincode.length === 6) {
      const validArea = validatePincode(pincode);
      setPincodeValid(!!validArea);
      
      if (validArea) {
        setAddress(prev => ({ ...prev, area: validArea.name }));
      }
    } else {
      setPincodeValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(address);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Delivery Address
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.fullName ? 'border-red-500' : 'border-blue-200'
              } focus:border-blue-500 focus:outline-none transition-colors`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={address.phoneNumber}
              onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value.replace(/\D/g, '') })}
              maxLength={10}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.phoneNumber ? 'border-red-500' : 'border-blue-200'
              } focus:border-blue-500 focus:outline-none transition-colors`}
              placeholder="10-digit mobile number"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* House/Flat Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Home className="w-4 h-4" />
                House/Flat No. *
              </label>
              <input
                type="text"
                value={address.houseNumber}
                onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.houseNumber ? 'border-red-500' : 'border-blue-200'
                } focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="e.g., 101"
              />
              {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
            </div>

            {/* Building Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Building/Society
              </label>
              <input
                type="text"
                value={address.buildingName}
                onChange={(e) => setAddress({ ...address, buildingName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Building name"
              />
            </div>
          </div>

          {/* Street/Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Street/Area *
            </label>
            <input
              type="text"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.street ? 'border-red-500' : 'border-blue-200'
              } focus:border-blue-500 focus:outline-none transition-colors`}
              placeholder="Street name or area"
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
          </div>

          {/* Landmark */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Landmark (Optional)
            </label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Nearby landmark"
            />
          </div>

          {/* Pincode and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode *
              </label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.pincode ? 'border-red-500' : pincodeValid === false ? 'border-red-500' : pincodeValid === true ? 'border-green-500' : 'border-blue-200'
                } focus:border-blue-500 focus:outline-none transition-colors`}
                placeholder="6-digit pincode"
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
              {pincodeValid === true && <p className="text-green-600 text-xs mt-1">✓ Delivery available</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mumbai Area *
              </label>
              <select
                value={address.area}
                onChange={(e) => setAddress({ ...address, area: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.area ? 'border-red-500' : 'border-blue-200'
                } focus:border-blue-500 focus:outline-none transition-colors`}
              >
                <option value="">Select area</option>
                {mumbaiAreas.map((area) => (
                  <option key={area.name} value={area.name}>
                    {area.name}
                  </option>
                ))}
              </select>
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex gap-3">
              {(['Home', 'Work', 'Other'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAddress({ ...address, addressType: type })}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-colors ${
                    address.addressType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Default Address */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={address.isDefault}
              onChange={(e) => setAddress({ ...address, isDefault: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
        >
          Save Address
        </button>
      </div>
    </form>
  );
}
