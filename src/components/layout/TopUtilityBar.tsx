import { ShoppingCartIcon } from "lucide-react";

// src/components/layout/TopUtilityBar.tsx
export const TopUtilityBar = () => (
  <div className="bg-[#004d3d] text-white h-10 flex justify-between items-center px-4 md:px-12 text-xs font-medium">
    <span>📞 +91 9027159589</span>
    <span className="hidden md:inline">Free delivery above ₹499!</span>
    <div className="flex items-center gap-4">
      <button className="hover:underline">Login / Signup</button>
      <div className="relative cursor-pointer">
        <ShoppingCartIcon size={18} />
        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">0</span>
      </div>
    </div>
  </div>
);