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
    <div className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 min-w-[100px] py-3 md:py-4 px-3 md:px-6 font-medium text-xs md:text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600 -mb-[2px]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppointmentTabs;