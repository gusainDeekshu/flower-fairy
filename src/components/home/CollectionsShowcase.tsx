// src\components\home\CollectionsShowcase.tsx


"use client";

import React from "react";
import ProductCard from "../ui/ProductCard";

interface CollectionsShowcaseProps {
  data: any[]; // Receives the filtered collection array from HomeRenderer
  settings: {
    title?: string;
    collectionId?: string;
    showHighlights?: boolean;
  };
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({ 
  data = [], 
  settings 
}) => {
  const title = settings?.title || "";

  // Since HomeRenderer's resolveData filters the array down to the exact selected collection,
  // we just grab the first (and only) item in the array.
  const collection = data && data.length > 0 ? data[0] : null;

  // 1. EMPTY STATE: Admin hasn't selected a collection yet
  if (!settings?.collectionId) {
    return (
      <div className="container mx-auto px-4 py-12 w-full">
        <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200">
          <p className="text-zinc-400 font-black text-xs uppercase tracking-[0.2em]">
            Select a Collection in the Admin Panel
          </p>
        </div>
      </div>
    );
  }

  // 2. NO DATA STATE: Collection selected, but it has no products
  if (!collection || !collection.products || collection.products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 w-full">
        {title && (
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 mb-6 tracking-tight uppercase">
            {title}
          </h2>
        )}
        <div className="flex flex-col items-center justify-center p-12 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-300">
          <p className="text-amber-700 font-black text-sm uppercase tracking-widest mb-2">
            ⚠️ No Products Found
          </p>
          <p className="text-xs text-amber-600 font-medium text-center max-w-md">
            The collection "{collection?.name || 'Selected'}" has no products assigned to it yet.
          </p>
        </div>
      </div>
    );
  }

  // 3. SUCCESS STATE: Render the collection grid
  // We handle both flat product arrays and nested { product: {...} } join tables just in case
  const rawProducts = collection.products;
  const productsToRender = rawProducts
    .map((p: any) => p.product ? p.product : p)
    .slice(0, 4); // Restrict to top 4 products for a clean grid layout

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      {/* HEADER SECTION */}
      {title && (
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight uppercase">
            {title}
          </h2>
          {rawProducts.length > 4 && (
            <span className="text-xs font-black uppercase tracking-widest text-[#006044] hover:underline cursor-pointer transition-all">
              View All
            </span>
          )}
        </div>
      )}

      {/* PRODUCT GRID SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {productsToRender.map((product: any) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            // Ensures the highlights toggle works exactly like the Carousel!
          />
        ))}
      </div>
    </div>
  );
};