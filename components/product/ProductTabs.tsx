'use client';

import { useState } from 'react';

interface ProductTabsProps {
  description: string;
  instructions?: string;
  deliveryInfo?: string;
}

type TabType = 'description' | 'instructions' | 'delivery';

export default function ProductTabs({ description, instructions, deliveryInfo }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('description');

  const tabs = [
    { id: 'description' as TabType, label: 'Description', content: description },
    { id: 'instructions' as TabType, label: 'Instructions', content: instructions },
    { id: 'delivery' as TabType, label: 'Delivery Info', content: deliveryInfo },
  ];

  // Filter out tabs with no content
  const availableTabs = tabs.filter(tab => tab.content);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-rose-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {availableTabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
          >
            <div className="prose prose-stone max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{tab.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
