"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { User } from '@/app/components/profile/types';




interface SidebarProps {
  user: User;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeSection, onSectionChange }) => {
  const menuItems = [
    "Appointments",
    "Health Records", 
    "Payments & Refunds",
    "Membership",
    "Notifications",
    "Settings"
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="w-80 bg-white shadow-sm border-r border-gray-200 min-h-screen p-6">
      {/* User Info */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
          {getInitials(user.name)}
        </div>
        <h1 className="text-xl font-semibold text-gray-800">{user.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => onSectionChange(item)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
              activeSection === item 
                ? "bg-blue-50 text-blue-600 border border-blue-200" 
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">{item}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;