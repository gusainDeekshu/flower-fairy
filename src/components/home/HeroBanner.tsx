"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerData {
  id: string;
  type: string;
  content: any; // ⚠️ keep flexible since API is inconsistent
}

interface HeroBannerProps {
  data: BannerData[];
  settings?: any;
}

export const HeroBanner = ({ data, settings }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Normalize content safely
  const normalizedData = (data || []).map((banner) => {
    const content = banner.content || {};

    return {
      ...banner,
      content: {
        imageUrl:
          content.imageUrl || // expected
          content.image || // 🔥 actual from your API
          content.desktopImage || // fallback safety
          "",

        mobileImageUrl:
          content.mobileImageUrl ||
          content.mobileImage ||
          content.image || // fallback to same image
          "",

        link: content.link || content.url || "#",
        altText: content.altText || content.title || "Banner",
      },
    };
  });

  // 🔥 DEBUG (keep for now)
  console.log("==== NORMALIZED BANNERS ====");
  normalizedData.forEach((b, i) => {
    console.log(`Banner ${i}`, b.content);
  });

  // Auto-play
  useEffect(() => {
    if (!normalizedData.length || normalizedData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % normalizedData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [normalizedData]);

  // ✅ Proper fallback check AFTER normalization
  if (!normalizedData.length || !normalizedData[0]?.content?.imageUrl) {
    return (
      <section className="relative w-full overflow-hidden bg-gray-50">
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
          <Image
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2000&auto=format&fit=crop"
            alt="Fallback Banner"
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>
      </section>
    );
  }

  const goToNext = () =>
    setCurrentIndex((prev) => (prev + 1) % normalizedData.length);

  const goToPrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + normalizedData.length) % normalizedData.length
    );

  return (
    <section className="relative w-full group overflow-hidden bg-gray-50">
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
        {normalizedData.map((banner, index) => {
          const imgUrl = banner.content.imageUrl;
          const linkUrl = banner.content.link;

          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Link href={linkUrl} className="block w-full h-full relative">
                <Image
                  src={imgUrl}
                  alt={banner.content.altText}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                  unoptimized
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {normalizedData.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/80 p-2 opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {normalizedData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;