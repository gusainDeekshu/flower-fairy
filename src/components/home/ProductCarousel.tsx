// src\components\home\ProductCarousel.tsx

import React from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";

export function ProductCarousel({ data, settings }: { data: any[], settings: any }) {
  if (!data?.length) return null;

  const title = settings?.title || "Curated For You";
  const subtitle = settings?.subtitle;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>}
        </div>
        {settings?.viewAllLink && (
          <Link 
            href={settings.viewAllLink} 
            className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-transparent hover:border-gray-900 transition-colors pb-1 inline-block"
          >
            Explore All
          </Link>
        )}
      </div>

      {/* Hide scrollbar, implement snap scrolling for touch */}
      <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide">
        {data.map((product) => (
          <div key={product.id} className="w-[70vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] flex-shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}