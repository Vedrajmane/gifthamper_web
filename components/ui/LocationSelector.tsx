'use client';

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { mumbaiAreas, getMumbaiZones } from '@/lib/data/mumbai-areas';

interface LocationSelectorProps {
  onLocationChange?: (location: string, pincode?: string) => void;
}

export default function LocationSelector({ onLocationChange }: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState('Bandra West');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const zones = getMumbaiZones();

  const handleLocationSelect = (areaName: string, pincode?: string) => {
    setSelectedLocation(areaName);
    setIsOpen(false);
    if (onLocationChange) {
      onLocationChange(areaName, pincode);
    }
    // Store in localStorage for persistence
    localStorage.setItem('userLocation', areaName);
    if (pincode) {
      localStorage.setItem('userPincode', pincode);
    }
  };

  const detectLocation = () => {
    setDetecting(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Default to Bandra West for Mumbai
            const detectedArea = 'Bandra West';
            handleLocationSelect(detectedArea, '400050');
          } catch (error) {
            console.error('Error detecting location:', error);
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setDetecting(false);
        }
      );
    } else {
      console.log('Geolocation not supported');
      setDetecting(false);
    }
  };

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const filteredAreas = selectedZone
    ? mumbaiAreas.filter(area => area.zone === selectedZone)
    : mumbaiAreas;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span className="hidden md:inline">Deliver to:</span>
        <span className="font-semibold">{selectedLocation}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[32rem] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                {detecting ? 'Detecting...' : 'Detect My Location'}
              </button>
            </div>

            {/* Zone Filter */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Filter by Zone:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedZone(null)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedZone === null
                      ? 'bg-rose-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-rose-300'
                  }`}
                >
                  All
                </button>
                {zones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedZone === zone
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-rose-300'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 py-2">
                Select your area in Mumbai:
              </p>
              {filteredAreas.map((area) => (
                <button
                  key={area.name}
                  onClick={() => handleLocationSelect(area.name, area.pincode[0])}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedLocation === area.name
                      ? 'bg-rose-50 text-rose-700 font-semibold'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{area.name}</span>
                    <span className="text-xs text-gray-400">{area.pincode[0]}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
