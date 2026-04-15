"use client"; // 🔥 Added because we are using a store

import { Search, ShoppingCart, Phone } from 'lucide-react';
import { useCartStore } from "@/store/useCartStore"; // 🔥 Import Zustand
import Link from 'next/link';

export default function Navbar() {
  // 🔥 Pull items from Zustand and calculate count
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* 1️⃣ Top Utility Bar */}
      <div className="bg-[#004d3d] text-white h-[38px] flex justify-between items-center px-4 md:px-12 text-[11px] font-medium leading-none">
        <div className="flex items-center gap-2"><Phone size={14} /> <span>+91 9027159589</span></div>
        <div className="uppercase tracking-wider">Free delivery above ₹499</div>
        <div className="flex items-center gap-4">
           <span className="cursor-pointer hover:opacity-80">Login / Signup</span>
        </div>
      </div>

      {/* 2️⃣ Main Navbar */}
      <div className="border-b bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
          <div className="text-2xl font-bold text-[#006044] tracking-tighter shrink-0">FlowerFairy</div>
          
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input type="text" placeholder="Search for flowers, cakes, gifts..." 
              className="w-full bg-[#f3f4f6] border-none rounded-full py-2.5 px-12 text-sm focus:ring-2 focus:ring-[#006044]" />
            <Search className="absolute left-4 top-2.5 text-gray-400" size={18} />
          </div>

          <div className="flex items-center gap-6 text-[13px] font-bold text-gray-700 uppercase">
            <nav className="hidden lg:flex gap-6 italic">
              <a href="#" className="text-[#006044]">Home</a>
              <a href="#">Shop</a>
              <a href="#">Occasions</a>
              <a href="#">Cakes</a>
              <a href="#">Contact</a>
            </nav>
            {/* 🔥 Connected Link to /cart and dynamic count */}
            <Link href="/cart" className="relative cursor-pointer">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}