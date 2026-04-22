// src\components\home\HeroBanner.tsx


"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBannerProps {
  data?: any[]; // Fallback global data
  settings?: {
    banners?: { imageUrl: string; link?: string }[];
  };
}

export const HeroBanner = ({ data = [], settings }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. PRIORITIZE BUILDER SETTINGS, Fallback to Global Data
  const rawBanners = settings?.banners?.length 
    ? settings.banners 
    : data;

  // 2. NORMALIZE DATA
  const normalizedData = rawBanners.map((banner: any) => {
    // Handle both our new builder format AND the old API format
    const imgUrl = banner.imageUrl || banner.content?.imageUrl || banner.content?.image || "";
    const linkUrl = banner.link || banner.content?.link || banner.content?.url || "#";
    
    return {
      imageUrl: imgUrl,
      link: linkUrl,
      altText: banner.content?.altText || banner.title || "Hero Banner",
    };
  }).filter((b) => b.imageUrl); // Ensure no empty slides

  // 3. AUTO-PLAY LOGIC
  useEffect(() => {
    if (!normalizedData.length || normalizedData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % normalizedData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [normalizedData.length]); // Track length instead of object reference to prevent re-renders

  // 4. FALLBACK EMPTY STATE
  if (!normalizedData.length) {
    return (
      <section className="relative w-full overflow-hidden bg-zinc-100">
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9] flex items-center justify-center">
           <span className="text-zinc-400 font-bold tracking-widest uppercase text-xs">
             Upload slides in Admin Panel
           </span>
        </div>
      </section>
    );
  }

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % normalizedData.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + normalizedData.length) % normalizedData.length);

  return (
    <section className="relative w-full group overflow-hidden bg-gray-50">
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
        {normalizedData.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Link href={banner.link} className="block w-full h-full relative">
              <Image
                src={banner.imageUrl}
                alt={banner.altText}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
                unoptimized // Use standard unoptimized true as per your code
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Arrows (Only show if multiple slides) */}
      {normalizedData.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 text-black p-2 opacity-0 group-hover:opacity-100 hidden md:block shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 text-black p-2 opacity-0 group-hover:opacity-100 hidden md:block shadow-md hover:bg-white transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {normalizedData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};