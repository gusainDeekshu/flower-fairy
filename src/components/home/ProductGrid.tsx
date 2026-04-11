// src/components/home/ProductGrid.tsx
"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ArrowRight } from "lucide-react";

interface ProductGridProps {
  data: any[] | {
    collectionName?: string;
    collectionSlug?: string;
    products: any[];
  };
  settings?: {
    title?: string;
    subtitle?: string;
    collectionSlug?: string; 
  };
}

export function ProductGrid({ data, settings }: ProductGridProps) {
  console.log("[ProductGrid] Received data:", data);
  // 1. Safely extract products 
  const products = Array.isArray(data) ? data : (data?.products || []);
  
  // 2. Safely extract title
  const title = settings?.title || (!Array.isArray(data) && data?.collectionName) || "Featured Products";
  
  // 3. Extract slug, or define a fallback URL if one isn't provided
  const slug = settings?.collectionSlug || (!Array.isArray(data) && data?.collectionSlug);
  
  // 🔥 FIX: Always have a target URL so the button renders
  const targetUrl = slug ? `/collections/${slug}` : "/products"; 
  
  const isLoading = !data;
  const isEmpty = !isLoading && products.length === 0;

  return (
    <section className="py-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* --- SECTION HEADER --- */}
      <div className="flex items-end justify-between mb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {title}
          </h2>
          {settings?.subtitle && (
            <p className="text-gray-500 text-sm md:text-base">{settings.subtitle}</p>
          )}
        </div>
        
        {/* 🔥 DYNAMIC "VIEW ALL" NAVIGATION (Always visible if not empty) */}
        {!isEmpty && (
          <Link 
            href={targetUrl}
            className="group flex items-center gap-1 text-[#006044] text-sm md:text-base font-bold hover:text-[#004d36] transition-colors"
          >
            <span className="border-b-2 border-transparent group-hover:border-[#004d36] pb-0.5 transition-all">
              VIEW ALL
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* --- EMPTY STATE --- */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-3xl border border-gray-200">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No products found</h3>
          <p className="text-gray-500 text-sm mt-1">Check back later for updates to this collection.</p>
        </div>
      ) : (
        /* --- PRODUCT GRID --- */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {isLoading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-square w-full rounded-2xl bg-gray-200" />
                <Skeleton className="h-5 w-3/4 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
                <Skeleton className="h-10 w-full rounded-xl bg-gray-200 mt-2" />
              </div>
            ))
          ) : (
            products.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      )}
    </section>
  );
}