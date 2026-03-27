// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Sidebar } from '@/components/ui/profile/Sidebar';
import { ProfileTab } from '@/components/ui/profile/tabs/ProfileTab';
import { AddressesTab } from '@/components/ui/profile/tabs/AddressesTab';
import { OrdersTab } from '@/components/ui/profile/tabs/OrdersTab';
import { WishlistTab } from '@/components/ui/profile/tabs/WishlistTab';
import { ReviewsTab } from '@/components/ui/profile/tabs/ReviewsTab';

export default function ProfilePage() {
  const router = useRouter();
  
  // 🔥 SECURITY UPDATE: Use isAuthenticated instead of token
  const { isAuthenticated, logout } = useAuthStore(); 
  
  const [activeTab, setActiveTab] = useState('profile');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 Protect the route using isAuthenticated
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/'); 
    }
  }, [isAuthenticated, mounted, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Wait until mounted and authenticated before rendering
  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout}
          />
          
          <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[600px]">
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'addresses' && <AddressesTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'wishlist' && <WishlistTab />}
            {activeTab === 'reviews' && <ReviewsTab />}
          </main>
          
        </div>
      </div>
    </div>
  );
}