'use client';

import { useState } from 'react';
import { MumbaiArea, mumbaiAreas } from '@/lib/data/mumbai-areas';
import { MapPin, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AreaManagement() {
  const [areas, setAreas] = useState<MumbaiArea[]>(mumbaiAreas);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<MumbaiArea | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    zone: 'South' as MumbaiArea['zone'],
    pincode: [''],
  });

  const zones = ['All', 'South', 'Western', 'Central', 'Eastern', 'Navi Mumbai', 'Thane'];

  const filteredAreas = areas.filter(area => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.pincode.some((p: string) => p.includes(searchQuery));
    const matchesZone = zoneFilter === 'All' || area.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newArea: MumbaiArea = {
      name: formData.name,
      zone: formData.zone,
      pincode: formData.pincode.filter(p => p.trim() !== ''),
    };

    if (editingArea) {
      setAreas(areas.map(a => a.name === editingArea.name ? newArea : a));
    } else {
      setAreas([...areas, newArea]);
    }

    // Save to localStorage
    localStorage.setItem('wordlane_areas', JSON.stringify(areas));
    resetForm();
  };

  const handleDelete = (areaName: string) => {
    if (confirm(`Are you sure you want to delete ${areaName}?`)) {
      const updated = areas.filter(a => a.name !== areaName);
      setAreas(updated);
      localStorage.setItem('wordlane_areas', JSON.stringify(updated));
    }
  };

  const handleEdit = (area: MumbaiArea) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      zone: area.zone,
      pincode: area.pincode,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      zone: 'South',
      pincode: [''],
    });
    setEditingArea(null);
    setIsModalOpen(false);
  };

  const addPincodeField = () => {
    setFormData({ ...formData, pincode: [...formData.pincode, ''] });
  };

  const updatePincode = (index: number, value: string) => {
    const newPincodes = [...formData.pincode];
    newPincodes[index] = value;
    setFormData({ ...formData, pincode: newPincodes });
  };

  const removePincode = (index: number) => {
    setFormData({ ...formData, pincode: formData.pincode.filter((_, i) => i !== index) });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Area & Pincode Management</h1>
          <p className="text-gray-600">Manage Mumbai delivery areas and pincodes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Area
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by area name or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
          >
            {zones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {zones.filter(z => z !== 'All').map(zone => (
          <div key={zone} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <p className="text-2xl font-bold text-blue-900">
              {areas.filter(a => a.zone === zone).length}
            </p>
            <p className="text-sm text-blue-700">{zone}</p>
          </div>
        ))}
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAreas.map((area, index) => (
          <motion.div
            key={area.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-900">{area.name}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(area)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(area.name)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
              {area.zone}
            </span>

            <div className="flex flex-wrap gap-1">
              {area.pincode.map(pincode => (
                <span key={pincode} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {pincode}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingArea ? 'Edit Area' : 'Add New Area'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="e.g., Bandra West"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                >
                  {zones.filter(z => z !== 'All').map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincodes
                </label>
                <div className="space-y-2">
                  {formData.pincode.map((pincode, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => updatePincode(index, e.target.value)}
                        placeholder="400050"
                        pattern="[0-9]{6}"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                      />
                      {formData.pincode.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePincode(index)}
                          className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPincodeField}
                    className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                  >
                    + Add Another Pincode
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  {editingArea ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
