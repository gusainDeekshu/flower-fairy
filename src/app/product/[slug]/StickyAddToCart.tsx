"use client";
import { useEffect, useState } from "react";

export default function StickyAddToCart({ product }: { product: any }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden z-50 flex items-center justify-between">
      <div>
        <p className="font-bold text-lg">₹{product.price}</p>
        <p className="text-xs text-red-600 font-semibold">Only a few left!</p>
      </div>
      <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold transition-all">
        Add to Cart
      </button>
    </div>
  );
}