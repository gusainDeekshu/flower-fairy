// src\components\layout\Header.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Search, ShoppingCart, User, Phone, Mail, 
  Home, LayoutGrid, Gift, MessageSquare, LogOut, Package, Settings, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/config/brand.config";

// --- HOOKS & STORES ---
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore"; 
import { useUIStore } from "@/store/useUIStore";

// --- COMPONENTS & SERVICES ---
import { OtpModal } from "@/components/auth/OtpModal";
import { apiClient } from "@/lib/api-client";

interface HeaderProps {
  megaMenu?: React.ReactNode; 
}

export function Header({ megaMenu }: HeaderProps) {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Auth & UI State
  const { user, logout } = useAuthStore();
  const { openSearch } = useUIStore();
  
  // Cart State
  const items = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn("Backend logout failed, clearing local state.");
    } finally {
      logout();
      setIsDropdownOpen(false);
      window.location.href = "/"; 
    }
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        
        {/* 1. Ultra-Thin Top Utility Bar */}
        <div className="bg-[#006044] text-white py-1.5 px-4 md:px-8 flex justify-between items-center text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <Phone size={12} className="fill-current" />
              <span>{BRAND.phone}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <Mail size={12} />
              <span>{BRAND.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 uppercase tracking-widest text-[10px]">
            <Link href="/track" className="hover:text-green-200 transition-colors">Track Order</Link>
            <span className="opacity-40">|</span>
            <Link href="/customer-care" className="hover:text-green-200 transition-colors">Support</Link>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="px-4 md:px-8 h-[76px] flex items-center justify-between max-w-[1600px] mx-auto">
          
          {/* LEFT: Logo */}
          <div className="shrink-0 flex-[1_1_20%]">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-[#006044] rounded-full flex items-center justify-center text-white text-xl shadow-sm group-hover:scale-105 transition-transform">
                🌸
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                Flower Fairy
              </span>
            </Link>
          </div>

          {/* CENTER: Mega Menu */}
          <div className="hidden lg:flex flex-[1_1_60%] justify-center items-center h-full">
            {megaMenu}
          </div>

          {/* RIGHT: Actions (Search -> User -> Cart) */}
          <div className="flex items-center justify-end gap-5 sm:gap-7 flex-[1_1_20%] shrink-0">
            
            {/* Action 1: Search Icon */}
            <button 
              onClick={openSearch} 
              className="text-gray-900 hover:text-[#006044] transition-colors p-1 group relative"
              aria-label="Search"
            >
              <Search size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Action 2: User Icon & Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => !user ? setLoginModalOpen(true) : setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-900 hover:text-[#006044] transition-colors p-1 flex items-center gap-1 group"
                aria-label="Account"
              >
                <User size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                {user && (
                  <ChevronDown size={14} className={`hidden sm:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>

              {user && isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50 mb-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-0.5">Signed In As</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                  </div>
                  
                  <div className="px-2 py-1">
                    <Link href="/orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-[#006044]/5 hover:text-[#006044] transition-colors">
                      <Package size={16} /> My Orders
                    </Link>
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-xl hover:bg-[#006044]/5 hover:text-[#006044] transition-colors">
                      <Settings size={16} /> Profile Settings
                    </Link>
                  </div>

                  <div className="h-px bg-gray-100 my-1 mx-4" />

                  <div className="px-2 py-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action 3: Cart Icon */}
            <Link 
              href="/cart" 
              className="text-gray-900 hover:text-[#006044] transition-colors p-1 relative group"
              aria-label="Cart"
            >
              <ShoppingCart size={22} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
              {!isLoading && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
          </div>
        </div>
      </header>

      {/* Auth Modal Integration */}
      <OtpModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onSuccess={() => setLoginModalOpen(false)} 
      />

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="lg:hidden fixed bottom-0 left-0 z-50 w-full h-[68px] bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-[#006044] group">
          <Home size={22} strokeWidth={2.5} className="group-active:scale-95 transition-transform" />
          <span className="text-[10px] mt-1 font-bold">Home</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-900 group">
          <LayoutGrid size={22} strokeWidth={2} className="group-active:scale-95 transition-transform" />
          <span className="text-[10px] mt-1 font-medium">Shop</span>
        </Link>
        <button onClick={openSearch} className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-900 group">
          <Search size={22} strokeWidth={2} className="group-active:scale-95 transition-transform" />
          <span className="text-[10px] mt-1 font-medium">Search</span>
        </button>
        <button onClick={() => !user ? setLoginModalOpen(true) : window.location.assign('/profile')} className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-gray-900 group">
          <User size={22} strokeWidth={2} className="group-active:scale-95 transition-transform" />
          <span className="text-[10px] mt-1 font-medium">{user ? "Account" : "Login"}</span>
        </button>
      </div>
    </>
  );
}