// src/components/profile/Sidebar.tsx
'use client';

import { User, MapPin, Package, Heart, Star, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'addresses', label: 'Manage Addresses', icon: MapPin },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    // { id: 'reviews', label: 'My Reviews', icon: Star },
  ];

  return (
    <div className="w-full md:w-72 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">My Account</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your details & orders</p>
        </div>
        <nav className="p-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#009688] text-white shadow-md shadow-[#009688]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                {tab.label}
              </button>
            );
          })}
          <div className="pt-4 mt-2 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}