// src/components/home/BundleBuilder.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";
import { Check, ShoppingBag } from "lucide-react";
import { useAddToCart } from "@/hooks/useAddToCart"; // We will use this to add the final bundle

interface BundleBuilderProps {
  // Accept both Array (current backend) or an Object with a products array
  data: any[] | { products: any[] }; 
  settings?: {
    title?: string;
    subtitle?: string;
  };
}

const MAX_ITEMS = 5;
const BUNDLE_PRICE = 999;

export function BundleBuilder({ data, settings }: BundleBuilderProps) {
  const { isAdding } = useAddToCart();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // 1. Safely extract the products array regardless of how the backend sends it
  const products = Array.isArray(data) ? data : (data?.products || []);

  // 2. Handle selecting/deselecting an item
  const toggleItem = (product: any) => {
    setSelectedItems((prev) => {
      const isSelected = prev.find((item) => item.id === product.id);
      
      // If already selected, remove it
      if (isSelected) {
        return prev.filter((item) => item.id !== product.id);
      }
      
      // If not selected and we haven't reached the limit, add it
      if (prev.length < MAX_ITEMS) {
        return [...prev, product];
      }
      
      // If full, do nothing
      return prev;
    });
  };

  const handleAddBundleToCart = async () => {
    if (selectedItems.length !== MAX_ITEMS) return;
    
    // Here you would trigger your cart API with the bundle data.
    // E.g., await CartApi.addBundle({ items: selectedItems, price: BUNDLE_PRICE })
    console.log("Adding Bundle to Cart:", selectedItems);
    alert("Bundle added successfully!");
    setSelectedItems([]); // Reset after adding
  };

  // If no products exist, show empty state
  if (!products || products.length === 0) {
    return (
      <section className="py-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
          <ShoppingBag className="w-8 h-8 text-gray-400 mb-4" />
          <h3 className="text-lg font-bold text-gray-700">Bundle Builder Unavailable</h3>
          <p className="text-gray-500 text-sm mt-1">No products available to build a bundle right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
          {settings?.title || "BUNDLE BUILDER"}
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          {settings?.subtitle || `Build your custom bundle for just ₹${BUNDLE_PRICE}!`}
        </p>
        <p className="text-[#006044] font-bold mt-1">
          Choose {MAX_ITEMS} items ({selectedItems.length}/{MAX_ITEMS} selected)
        </p>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-24">
        {products.map((product) => {
          const isSelected = selectedItems.some((item) => item.id === product.id);
          const isDisabled = !isSelected && selectedItems.length >= MAX_ITEMS;

          return (
            <div 
              key={product.id} 
              className={`relative cursor-pointer transition-all duration-300 ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              onClick={() => !isDisabled && toggleItem(product)}
            >
              {/* Overlay Checkmark when selected */}
              <div className={`absolute inset-0 z-20 rounded-2xl border-4 transition-all duration-200 pointer-events-none ${isSelected ? 'border-[#006044] bg-[#006044]/10' : 'border-transparent'}`}>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-[#006044] text-white p-1 rounded-full shadow-lg">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              {/* We reuse your pixel-perfect ProductCard, but pointer-events-none makes the click pass through to our wrapper container */}
              <div className="pointer-events-none">
                <ProductCard product={product} />
              </div>
            </div>
          );
        })}
      </div>

      {/* STICKY BOTTOM BAR FOR BUNDLE STATUS */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Slot visualizer */}
          <div className="flex items-center gap-2">
            {[...Array(MAX_ITEMS)].map((_, i) => (
              <div 
                key={i} 
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center overflow-hidden border-2 ${selectedItems[i] ? 'border-[#006044]' : 'border-dashed border-gray-300 bg-gray-50'}`}
              >
                {selectedItems[i] ? (
                  <Image src={selectedItems[i].images?.[0] || "/placeholder-product.png"} alt="slot" width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-300 font-bold">{i + 1}</span>
                )}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleAddBundleToCart}
            disabled={selectedItems.length !== MAX_ITEMS || isAdding}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all w-full md:w-auto ${
              selectedItems.length === MAX_ITEMS 
                ? 'bg-[#006044] hover:bg-[#004d36] shadow-lg hover:shadow-xl' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {selectedItems.length === MAX_ITEMS 
              ? `ADD BUNDLE - ₹${BUNDLE_PRICE}` 
              : `SELECT ${MAX_ITEMS - selectedItems.length} MORE ITEMS`}
          </button>

        </div>
      </div>
    </section>
  );
}