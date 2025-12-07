"use client";
import React from "react";
import {
    Calendar,
    FileText,
    CreditCard,
    Shield,
    Bell,
    Settings,
} from "lucide-react";
import { User } from "./types";

interface SidebarProps {
    user: User;
    activeSection: string;
    onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    onSectionChange,
}) => {
    const menuItems = [
        { name: "Appointments", icon: Calendar },
        { name: "Health Records", icon: FileText },
        { name: "Payments & Refunds", icon: CreditCard },
        { name: "Membership", icon: Shield },
        { name: "Notifications", icon: Bell },
        { name: "Settings", icon: Settings },
    ];

    return (
        <div className="w-64 lg:w-72 bg-white rounded-lg shadow-sm p-4 md:p-6 h-fit flex-shrink-0">
            <div className="text-center mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-blue-600"></div>
                </div>
            </div>

            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.name}
                            onClick={() => onSectionChange(item.name)}
                            className={`w-full flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-left transition-colors ${
                                activeSection === item.name
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            <span className="font-medium text-xs md:text-sm">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
