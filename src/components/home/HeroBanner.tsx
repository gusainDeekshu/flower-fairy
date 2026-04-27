// src/components/home/HeroBanner.tsx

"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Sparkles,
  UploadCloud,
} from "lucide-react";

interface HeroBannerProps {
  data?: any[];
  settings?: {
    banners?: { imageUrl: string; link?: string }[];
  };
}

export const HeroBanner = ({ data = [], settings }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const MIN_SWIPE_DISTANCE = 50;

  const ADMIN_URL =
    process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000";

  // Normalize banner data
  const normalizedData = useMemo(() => {
    const rawBanners = settings?.banners?.length ? settings.banners : data;

    return rawBanners
      .map((banner: any) => {
        const imgUrl =
          banner.imageUrl ||
          banner.content?.imageUrl ||
          banner.content?.image ||
          "";

        const linkUrl =
          banner.link ||
          banner.content?.link ||
          banner.content?.url ||
          "#";

        return {
          imageUrl: imgUrl,
          link: linkUrl,
          altText:
            banner.content?.altText || banner.title || "Hero banner image",
        };
      })
      .filter((b) => b.imageUrl);
  }, [data, settings]);

  const total = normalizedData.length;

  // Navigation
  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const interval = setInterval(goToNext, 5000);

    return () => clearInterval(interval);
  }, [goToNext, total, isPaused]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      setIsPaused(false);
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) >= MIN_SWIPE_DISTANCE) {
      if (distance > 0) {
        // Swipe left → next
        goToNext();
      } else {
        // Swipe right → previous
        goToPrev();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  // Empty state
  if (!total) {
    return (
      <section
        aria-label="Hero Banner Placeholder"
        className="relative w-full overflow-hidden px-4 sm:px-6 md:px-8 mt-6 md:mt-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-white min-h-[500px] md:min-h-[600px] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_35%)]" />

            <div className="relative flex flex-col items-center justify-center text-center max-w-xl mx-auto">
              <div className="w-24 h-24 rounded-3xl bg-amber-100 flex items-center justify-center mb-6 shadow-sm">
                <ImageIcon className="w-12 h-12 text-amber-600" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 mb-5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold tracking-wide text-zinc-600 uppercase">
                  Hero Section Empty
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 mb-4 tracking-tight">
                Your hero banners are waiting
              </h2>

              <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-lg mb-8">
                Add banners for promotions, product launches, seasonal
                campaigns, or featured collections to activate your storefront
                hero section.
              </p>

              <Link
                href={`${ADMIN_URL}/admin/storefront`}
                className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium transition-all hover:scale-105"
              >
                <UploadCloud className="w-4 h-4" />
                Upload Hero Slides
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-8 rounded-2xl bg-zinc-50 border border-zinc-200 px-5 py-4 text-xs text-zinc-500 space-y-1">
                <p>Recommended size: 1600 × 700px</p>
                <p>Supports JPG, PNG, WebP</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-100"
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero banners"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Slides */}
      <div
        className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {normalizedData.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Link
              href={banner.link}
              aria-label={`Go to slide ${index + 1}`}
              className="block w-full h-full relative"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.altText}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </Link>

            {/* Overlay (doesn't block touch) */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {/* Controls */}
      {total > 1 && (
        <>
          {/* Previous */}
          <button
            onClick={goToPrev}
            aria-label="Previous slide"
            className="hidden sm:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-black/40"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Next */}
          <button
            onClick={goToNext}
            aria-label="Next slide"
            className="hidden sm:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur shadow-md hover:bg-white transition focus:outline-none focus:ring-2 focus:ring-black/40"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20"
            role="tablist"
            aria-label="Slide navigation"
          >
            {normalizedData.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  index === currentIndex
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};