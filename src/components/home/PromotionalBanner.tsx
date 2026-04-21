// src\components\home\PromotionalBanner.tsx


import React from "react";
import Link from "next/link";
import Image from "next/image";

export function PromotionalBanner({ settings }: { settings: any }) {
  const imageUrl = settings?.imageUrl || "/banner-placeholder.jpg";
  const title = settings?.title || "Special Offer";
  const buttonText = settings?.buttonText || "Shop Now";
  const link = settings?.link || "/shop";

  return (
    <section className="w-full relative h-[60vh] md:h-[500px] overflow-hidden group">
      <Image 
        src={imageUrl} 
        alt={title} 
        fill 
        className="object-cover transition-transform duration-[10s] group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/40" /> {/* Contrast overlay */}
      
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-xl bg-white/5 backdrop-blur-sm p-8 md:p-12 border border-white/20">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 drop-shadow-md">
            {title}
          </h2>
          <Link 
            href={link}
            className="inline-block bg-white text-gray-900 px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-100 transition-colors"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}

