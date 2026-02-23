"use client";

import { Search, ShoppingCart, MapPin, Menu, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BRAND } from "@/config/brand.config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Utility Bar - Light Green */}
      <div className="bg-emerald-500 px-4 py-2 flex justify-between items-center text-white text-[10px] font-bold uppercase tracking-widest">
        <span>📞 {BRAND.contact}</span>
        <span className="hidden sm:inline">Free Delivery above ₹499!</span>
        <div className="flex items-center gap-4">
          <span className="cursor-pointer">Login</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo & Location */}
        <div className="flex items-center gap-6">
          <Link href="/" className="serif-font text-2xl font-black text-emerald-700 tracking-tighter">
            {BRAND.name}
          </Link>
          <div className="hidden md:flex items-center gap-1.5 text-slate-500 border-l pl-6">
            <MapPin size={16} className="text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-tighter">Dehradun</span>
          </div>
        </div>

        {/* Navigation - Center */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
          <Link href="/" className="text-emerald-500">Home</Link>
          <Link href="/shop" className="hover:text-emerald-500">Shop</Link>
          <Link href="/occasions" className="hover:text-emerald-500">Occasions</Link>
          <Link href="/contact" className="hover:text-emerald-500">Contact</Link>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-5">
          <div className="hidden sm:flex items-center w-48 lg:w-64 h-9 rounded-full bg-slate-100 px-4">
            <Search size={14} className="text-slate-400 mr-2" />
            <input type="text" placeholder="Search..." className="w-full bg-transparent text-xs outline-none" />
          </div>
          <button className="relative text-slate-700 hover:text-emerald-500">
             <ShoppingCart size={22} strokeWidth={2.5} />
             <Badge className="absolute -right-2 -top-2 h-4 w-4 p-0 flex items-center justify-center text-[8px] bg-emerald-500 text-white border-white">0</Badge>
          </button>
          <Menu size={24} className="lg:hidden text-slate-700" />
        </div>
      </div>
    </header>
  );
}