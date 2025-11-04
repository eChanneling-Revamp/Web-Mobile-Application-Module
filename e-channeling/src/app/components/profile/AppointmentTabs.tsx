"use client";
import React from 'react';

interface AppointmentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    upcoming: number;
    past: number;
    cancelled: number;
  };
}

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  counts 
}) => {
  const tabs = [
    { key: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { key: 'past', label: 'Past', count: counts.past },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <div className="flex space-x-8 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`pb-4 font-medium transition-colors ${
            activeTab === tab.key
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default AppointmentTabs;