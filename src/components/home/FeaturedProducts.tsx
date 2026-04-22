// src\components\home\FeaturedProducts.tsx

"use client";

import React from "react";
import ProductCard from "../ui/ProductCard";

export const FeaturedProducts = ({ data = [], settings = {} }: { data: any[], settings: any }) => {
  const title = settings?.title || "";

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 w-full">
        {title && (
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 tracking-tight uppercase">
            {title}
          </h2>
        )}
        <div className="flex flex-col items-center justify-center p-12 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-300">
          <p className="text-amber-700 font-black text-sm uppercase tracking-widest mb-2">
            ⚠️ No Products Found
          </p>
          <p className="text-xs text-amber-600 font-medium text-center max-w-md">
            The grid is rendering, but the data array is empty. <br/><br/>
            <strong>Fix:</strong> Ensure products in your database have the "Featured" flag enabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      {/* HEADER */}
      {title && (
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase">
            {title}
          </h2>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {data.map((product: any) => (
          <ProductCard 
            key={product.id} 
            product={product.product ? product.product : product} 
          />
        ))}
      </div>
    </div>
  );
};