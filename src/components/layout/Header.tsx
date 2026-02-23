import { Search, ShoppingCart, Bell, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BRAND } from "@/config/brand.config";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm pb-3">
      <div className="bg-primary px-4 py-1.5 flex justify-center text-white text-[10px] font-medium tracking-wide">
        🎉 Free Delivery above ₹499! Use code: FAIRY
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3 text-primary">
          <Menu size={24} className="cursor-pointer" />
          <Link href="/" className="serif-font text-xl font-bold">{BRAND.name}</Link>
        </div>
        <div className="flex items-center gap-4 text-primary">
          <button className="relative">
             <Bell size={20} />
          </button>
          <button className="relative">
             <ShoppingCart size={20} />
             <Badge className="absolute -right-2 -top-2 h-4 w-4 p-0 flex items-center justify-center text-[8px] bg-secondary hover:bg-secondary border border-white">1</Badge>
          </button>
        </div>
      </div>
      <div className="px-5">
        <div className="flex items-center w-full h-10 rounded-full bg-slate-100 px-4 focus-within:ring-1 focus-within:ring-primary">
          <Search size={16} className="text-slate-400 mr-2" />
          <input type="text" placeholder="Search flowers, cakes..." className="w-full bg-transparent text-sm outline-none" />
        </div>
      </div>
    </header>
  );
}