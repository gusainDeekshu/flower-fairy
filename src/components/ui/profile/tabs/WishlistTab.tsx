// src/components/profile/tabs/WishlistTab.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCartStore } from '@/store/useCartStore';
import { WishlistItem } from '@/types/profile';
import Image from 'next/image';
import {apiClient} from '@/lib/api-client';

export function WishlistTab() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const { addItem } = useCartStore();

  const fetchWishlist = useCallback(async () => {
    try {
     const res = await apiClient.get<WishlistItem[]>('/api/v1/wishlist');
setItems(res || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const remove = async (productId: string) => {
    setProcessingId(productId);
    try {
      // Toggle logic handles removal when passing existing productId
      await apiClient.post(`/api/v1/wishlist/${productId}`);
      toast.success('Removed from wishlist');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to remove item');
      setProcessingId(null);
    }
  };

  const moveToCart = async (item: WishlistItem) => {
    setProcessingId(item.product.id);
    try {
      addItem({ 
        productId: item.product.id, 
        name: item.product.name, 
        price: item.product.price, 
        image: item.product.images[0], 
        quantity: 1 
      });
      // Remove from wishlist after moving to cart
      await apiClient.post(`/api/v1/wishlist/${item.product.id}`);
      toast.success('Moved to cart!');
      fetchWishlist();
    } catch (error) {
      toast.error('Failed to move to cart');
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-72 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">My Wishlist</h3>
        <p className="text-gray-500 mt-1">Saved items you want to buy later.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState 
          icon={Heart} 
          title="Your wishlist is empty" 
          description="Explore our collection and add your favorite items here." 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isProcessing = processingId === item.product.id;
            return (
              <div key={item.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col relative group">
                <div className="relative w-full aspect-square rounded-lg mb-4 overflow-hidden bg-gray-50">
                  <Image 
                    src={item.product.images[0] || '/placeholder.jpg'} 
                    alt={item.product.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={() => remove(item.product.id)}
                    disabled={isProcessing}
                    className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2">{item.product.name}</h4>
                  <p className="font-bold text-lg text-[#009688] mt-auto">₹{item.product.price.toLocaleString('en-IN')}</p>
                </div>
                
                <button 
                  onClick={() => moveToCart(item)}
                  disabled={isProcessing}
                  className="w-full mt-4 bg-[#009688] text-white py-2.5 rounded-lg text-sm font-semibold shadow hover:bg-[#007A6E] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      Move to Cart
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}