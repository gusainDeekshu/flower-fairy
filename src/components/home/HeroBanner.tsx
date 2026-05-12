// src/components/home/HeroBanner.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroBannerProps {
  data?: any[];
  settings?: {
    banners?: {
      imageUrl: string;
      link?: string;
      title?: string;
      subtitle?: string;
      ctaText?: string;
    }[];
  };
}

const AUTO_SLIDE_INTERVAL = 6000;

// Swipe Physics Thresholds
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export const HeroBanner = ({ data = [], settings }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const banners = useMemo(() => {
    const rawBanners = settings?.banners?.length ? settings.banners : data;
    return rawBanners
      .map((banner: any) => ({
        imageUrl: banner.imageUrl || banner.content?.imageUrl || "",
        link: banner.link || banner.content?.link || "#",
        title: banner.title || banner.content?.title || "",
        subtitle: banner.subtitle || banner.content?.subtitle || "",
        ctaText: banner.ctaText || banner.content?.ctaText || "Shop Collection",
      }))
      .filter((banner: any) => Boolean(banner.imageUrl));
  }, [data, settings]);

  const totalSlides = banners.length;

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [goToNext, isPaused, totalSlides]);

  const handleDragEnd = (e: Event, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      goToNext();
    } else if (swipe > swipeConfidenceThreshold) {
      goToPrev();
    }
  };

  if (!totalSlides) return null;

  return (
    // 🔥 FIX: Added z-0 to ensure it establishes a base stacking context strictly below the header
    <section 
      className="relative z-0 w-full bg-white pt-0 pb-8 md:pb-12"
      aria-roledescription="carousel"
      aria-label="Promotional Offers"
    >
      <div className="mx-auto px-3 sm:px-3 md:px-4">
        
        <div 
          className="relative w-full h-[55vh] md:h-[65vh] lg:h-[85vh] min-h-[400px] rounded-[24px] md:rounded-[22px] overflow-hidden bg-neutral-900 shadow-sm touch-pan-y"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <Image
                src={banners[currentIndex].imageUrl}
                alt={banners[currentIndex].title || `Hero Banner Slide ${currentIndex + 1}`}
                fill
                priority // Always prioritize the active slide for LCP performance
                className="object-cover object-center select-none"
                sizes="(max-width: 1600px) 100vw, 1600px"
                quality={90}
                draggable={false}
              />

              {(banners[currentIndex].title || banners[currentIndex].subtitle) && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/10 md:to-transparent pointer-events-none" />
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="px-8 md:px-16 lg:px-24 w-full">
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl text-white"
                      >
                        {banners[currentIndex].subtitle && (
                          <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-3 text-white/90 drop-shadow-md">
                            {banners[currentIndex].subtitle}
                          </span>
                        )}
                        {banners[currentIndex].title && (
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-tight drop-shadow-lg">
                            {banners[currentIndex].title}
                          </h2>
                        )}
                        {banners[currentIndex].link && (
                          <Link
                            href={banners[currentIndex].link}
                            className="inline-flex items-center group pointer-events-auto"
                            draggable={false}
                          >
                            <span className="px-8 py-3.5 bg-[#f26522] hover:bg-[#d8581e] text-white text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5">
                              {banners[currentIndex].ctaText}
                            </span>
                          </Link>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          {totalSlides > 1 && (
            <>
              <div className="absolute inset-y-0 left-4 md:left-6 flex items-center z-20">
                <button
                  onClick={goToPrev}
                  className="p-2.5 text-white/80 hover:text-gray-900 transition-colors bg-black/20 hover:bg-white rounded-full backdrop-blur-md shadow-sm border border-white/10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 md:right-6 flex items-center z-20">
                <button
                  onClick={goToNext}
                  className="p-2.5 text-white/80 hover:text-gray-900 transition-colors bg-black/20 hover:bg-white rounded-full backdrop-blur-md shadow-sm border border-white/10"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} strokeWidth={2} />
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="group relative h-1.5 w-8 md:w-12 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div 
                      className={cn(
                        "absolute inset-0 bg-white rounded-full transition-transform duration-500",
                        currentIndex === index ? "translate-x-0" : "-translate-x-full"
                      )}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};