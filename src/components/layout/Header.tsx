"use client";

import { Search, ShoppingCart, MapPin, ChevronDown, User, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/config/brand.config";

export function Header() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      
      {/* 1. Top Utility Bar (Teal) */}
      <div className="bg-[#009688] text-white py-2 px-4 md:px-12 flex justify-between items-center text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} className="fill-current" />
            <span>{BRAND.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span>{BRAND.mail}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/track" className="hover:underline">Track Order</Link>
          <span className="opacity-50">|</span>
          <Link href="/customer-care" className="hover:underline">Customer Care</Link>
        </div>
      </div>

      {/* 2. Main Search Bar Section */}
      <div className="flex items-center justify-between px-4 md:px-12 py-4 gap-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 bg-[#009688] rounded-full flex items-center justify-center text-white text-xl">
            🌸
          </div>
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            Flower Fairy
          </span>
        </Link>

        {/* City Selector */}
        <div className="hidden md:flex items-center gap-2 border rounded-md px-3 py-2 bg-white text-gray-600 cursor-pointer hover:border-emerald-500 transition-colors">
          <MapPin size={18} className="text-[#009688]" />
          <span className="text-sm font-medium">Select City</span>
          <ChevronDown size={16} />
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-2xl relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for flowers, cakes, gifts..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Actions (Sign In & Cart) */}
        <div className="flex items-center gap-6 shrink-0">
          <button className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-medium">
            <User size={22} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-medium relative">
            <ShoppingCart size={22} />
            <span className="hidden sm:inline">Cart</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              0
            </span>
          </button>
        </div>
      </div>

      {/* 3. Navigation Links (Centered) */}
      <nav className="flex items-center justify-center gap-8 py-3 border-t text-sm font-semibold text-gray-700">
        <Link href="/" className="text-black border-b-2 border-black pb-1">Home</Link>
        <Link href="/shop" className="hover:text-emerald-600 transition-colors">Shop</Link>
        <Link href="/occasions" className="hover:text-emerald-600 transition-colors">Occasions</Link>
        <Link href="/flowers" className="hover:text-emerald-600 transition-colors">Flowers</Link>
        <Link href="/cakes" className="hover:text-emerald-600 transition-colors">Cakes</Link>
        <Link href="/gifts" className="hover:text-emerald-600 transition-colors">Gifts</Link>
        <Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link>
        <Link href="/blog" className="hover:text-emerald-600 transition-colors">Blog</Link>
      </nav>

    </header>
  );
}