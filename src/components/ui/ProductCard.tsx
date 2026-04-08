// src/components/ui/ProductCard.tsx
"use client";

import { useState, useEffect } from 'react';
import { Star, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: any }) {
  const { isAuthenticated } = useAuthStore();
  const [isWishlisting, setIsWishlisting] = useState(false);
  
  // Initialize state from product prop
  const [wishlisted, setWishlisted] = useState(product.isWishlisted || false);

  // Sync state if product prop changes (important for list filtering/re-renders)
  useEffect(() => {
    setWishlisted(product.isWishlisted || false);
  }, [product.isWishlisted]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      return toast.error("Please login to manage your wishlist");
    }

    setIsWishlisting(true);
    try {
      // 1. Call the toggle API: POST /profile/wishlist/:productId
      const res: any = await apiClient.post(`/profile/wishlist/${product.id}`);
      
      /** * 🔥 THE FIX: 
       * Handle different response structures (res.added or res.data.added)
       */
      const backendStatus = res?.added !== undefined ? res.added : res?.data?.added;
      
      if (typeof backendStatus === 'boolean') {
        // 2. Update the local heart state based on the REAL backend result
        setWishlisted(backendStatus);
        
        // 3. Show the message the backend sent
        const message = res?.message || res?.data?.message || (backendStatus ? "Added to wishlist" : "Removed from wishlist");
        toast.success(message);
      } else {
        // Fallback toggle if backend returns success but no boolean
        setWishlisted(!wishlisted);
      }

    } catch (error: any) {
      console.error("Wishlist Toggle Error:", error);
      toast.error("Could not update wishlist");
    } finally {
      setIsWishlisting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 relative">
      <Link href={`/product/${product.slug}`} prefetch={true}>
        {/* SALE Badge */}
        <div className="absolute top-3 left-0 bg-[#006044] text-white text-[10px] font-bold px-3 py-1 rounded-r-full z-10">
          SALE
        </div>

        {/* Wishlist Icon Button */}
        <button 
          onClick={toggleWishlist}
          disabled={isWishlisting}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm z-10 transition-all duration-300 border ${
            wishlisted 
              ? "bg-red-500 text-white border-red-500" 
              : "bg-white/90 text-gray-400 hover:text-red-500 border-gray-100"
          }`}
        >
          {isWishlisting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Heart size={16} className={wishlisted ? "fill-current" : ""} />
          )}
        </button>

        {/* Product Image */}
        <div className="aspect-[4/5] overflow-hidden bg-gray-50">
          <img 
            src={product.images?.[0] || '/placeholder.jpg'} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt={product.name} 
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < Math.floor(product.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
              />
            ))}
            <span className="text-[10px] text-gray-400 font-bold ml-1">
              ({product.reviewCount || 0})
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-black text-[#006044]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.oldPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Integrated AddToCartButton */}
          <div className="mt-auto">
             <AddToCartButton product={product} />
          </div>
        </div>
      </Link>
    </div>
  );
}