'use client';

import { useState } from 'react';
import { Package, Tag, MapPin, Users, Settings, LayoutDashboard } from 'lucide-react';
import OrderManagement from './OrderManagement';
import OffersManagement from './OffersManagement';
import AreaManagement from './AreaManagement';
import CustomerManagement from './CustomerManagement';

type AdminView = 'dashboard' | 'orders' | 'offers' | 'areas' | 'customers';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const menuItems = [
    { id: 'dashboard' as AdminView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminView, label: 'Orders', icon: Package },
    { id: 'offers' as AdminView, label: 'Offers', icon: Tag },
    { id: 'areas' as AdminView, label: 'Areas & Pincodes', icon: MapPin },
    { id: 'customers' as AdminView, label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-600">Manage your store</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {activeView === 'dashboard' && <DashboardOverview />}
        {activeView === 'orders' && <OrderManagement />}
        {activeView === 'offers' && <OffersManagement />}
        {activeView === 'areas' && <AreaManagement />}
        {activeView === 'customers' && <CustomerManagement />}
      </div>
    </div>
  );
}

function DashboardOverview() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-900">0</p>
              <p className="text-sm text-blue-700">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              ₹
            </div>
            <div>
              <p className="text-3xl font-bold text-green-900">₹0</p>
              <p className="text-sm text-green-700">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-900">0</p>
              <p className="text-sm text-purple-700">Total Customers</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-900">5</p>
              <p className="text-sm text-orange-700">Active Offers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all text-center">
            <Package className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">View Orders</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all text-center">
            <Tag className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Manage Offers</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all text-center">
            <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Manage Areas</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-rose-400 hover:bg-rose-50 transition-all text-center">
            <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">View Customers</p>
          </button>
        </div>
      </div>
    </div>
  );
}
