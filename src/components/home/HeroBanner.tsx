"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerData {
  id: string;
  type: string;
  content: {
    imageUrl: string;
    mobileImageUrl?: string;
    link?: string;
    altText?: string;
  };
}

interface HeroBannerProps {
  data: BannerData[];
  settings?: any;
}

export const HeroBanner = ({ data, settings }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play logic
  useEffect(() => {
    if (!data || data.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [data]);

  // 🔥 THE NEW FALLBACK: Shows a beautiful static banner if the database is empty
  if (!data || data.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
          <Image
            // Using a high-quality placeholder until you upload one in the admin panel
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2000&auto=format&fit=crop" 
            alt="Welcome Banner"
            fill
            priority
            className="object-cover object-center"
            unoptimized // Allow external URL for the placeholder
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-center">
             <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase shadow-sm">Discover Nature</h1>
             <p className="mt-4 text-white text-sm md:text-lg tracking-widest uppercase">Premium Skincare Essentials</p>
          </div>
        </div>
      </section>
    );
  }

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % data.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);

  return (
    <section className="relative w-full group overflow-hidden bg-gray-50">
      {/* WOW Style Aspect Ratios: 
        Mobile is usually taller (4:5 or 1:1) to fill the screen. 
        Desktop is ultra-wide (21:9 or 16:9). 
      */}
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
        {data.map((banner, index) => {
          // Fallback to desktop image if mobile isn't provided
          const imgUrl = banner.content?.imageUrl || '/placeholder-banner.jpg';
          const linkUrl = banner.content?.link || '#';

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Link href={linkUrl} className="relative block w-full h-full">
                <Image
                  src={imgUrl}
                  alt={banner.content?.altText || `Hero Banner ${index + 1}`}
                  fill
                  priority={index === 0} // 🔥 Critical: Preloads the first image for Core Web Vitals (LCP)
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows (Shows on hover on desktop) */}
      {data.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 group-hover:opacity-100 hidden md:block"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 text-black opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 group-hover:opacity-100 hidden md:block"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white' // Active dot is wider
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;