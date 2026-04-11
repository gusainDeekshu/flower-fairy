"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface HomeCollectionsProps {
  data: Collection[];
}

export function HomeCollections({ data }: HomeCollectionsProps) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* 1. Section Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase mb-3">
            Shop by Concern
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base font-medium">
            Find the perfect natural solution curated specifically for your unique needs.
          </p>
        </div>

        {/* 2. 🔥 NEW: Horizontal Quick-Link Pills (Scrollable on mobile, centered on Desktop) */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 snap-x justify-start md:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {data.map((collection) => (
            <Link
              key={`pill-${collection.id}`}
              href={`/collections/${collection.slug}`}
              className="snap-center whitespace-nowrap px-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-[#006044] hover:border-[#006044] hover:text-white transition-all shadow-sm active:scale-95"
            >
              {collection.name}
            </Link>
          ))}
        </div>

        {/* 3. Collections Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.slice(0, 6).map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden block bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image with Hover Zoom */}
              <Image
                src={collection.image || "/placeholder-collection.png"}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Text Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col items-start text-white transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight drop-shadow-md">
                  {collection.name}
                </h3>
                
                {collection.description && (
                  <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 drop-shadow-sm font-medium">
                    {collection.description}
                  </p>
                )}
                
                <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 group-hover:bg-white group-hover:text-[#006044] transition-colors duration-300">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}