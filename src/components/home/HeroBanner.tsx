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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroBannerProps {
  data?: any[];
  settings?: {
    banners?: {
      imageUrl: string;
      link?: string;
      collectionId?: string;
    }[];
  };
}

const SECTION_SPACING = "py-8 md:py-12 lg:py-16";
const CONTAINER_SPACING = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const MIN_SWIPE_DISTANCE = 50;
const AUTO_SLIDE_INTERVAL = 5000;

export const HeroBanner = ({
  data = [],
  settings,
}: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  /**
   * Normalize incoming banner data
   */
  const banners = useMemo(() => {
    const rawBanners =
      settings?.banners?.length && settings.banners.length > 0
        ? settings.banners
        : data;

    return rawBanners
      .map((banner: any) => ({
        imageUrl:
          banner.imageUrl ||
          banner.content?.imageUrl ||
          banner.content?.image ||
          "",
        link:
          banner.link ||
          banner.content?.link ||
          banner.content?.url ||
          "",
        altText:
          banner.content?.altText ||
          banner.title ||
          "Hero Banner",
      }))
      .filter((banner) => Boolean(banner.imageUrl));
  }, [data, settings]);

  const totalSlides = banners.length;

  /**
   * Navigation
   */
  const goToNext = useCallback(() => {
    if (totalSlides <= 1) return;

    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    if (totalSlides <= 1) return;

    setCurrentIndex(
      (prev) => (prev - 1 + totalSlides) % totalSlides
    );
  }, [totalSlides]);

  /**
   * Auto-play
   */
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(
      goToNext,
      AUTO_SLIDE_INTERVAL
    );

    return () => clearInterval(interval);
  }, [goToNext, isPaused, totalSlides]);

  /**
   * Touch support
   */
  const resetTouchState = () => {
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      resetTouchState();
      return;
    }

    const swipeDistance =
      touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > MIN_SWIPE_DISTANCE) {
      swipeDistance > 0 ? goToNext() : goToPrev();
    }

    resetTouchState();
  };

  if (!totalSlides) return null;

  return (
    <section className={`w-full bg-white ${SECTION_SPACING}`}>
      <div className={CONTAINER_SPACING}>
        <div
          className="group relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Hero Slider */}
          <div className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px] xl:h-[560px]">
            {banners.map((banner, index) => {
              const href = banner.link?.trim() || "#";
              const isActive = index === currentIndex;

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? "z-10 opacity-100"
                      : "z-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <Link
                    href={href}
                    className="block h-full w-full"
                    aria-label={banner.altText}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.altText}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover object-center"
                        unoptimized
                      />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrev();
                }}
                aria-label="Previous slide"
                className="
                  absolute left-6 top-1/2 z-20 hidden h-11 w-11
                  -translate-y-1/2 items-center justify-center
                  rounded-full bg-white/95 shadow-md backdrop-blur-sm
                  opacity-0 scale-95 transition-all duration-300
                  group-hover:opacity-100 group-hover:scale-100
                  hover:scale-110 hover:shadow-lg
                  md:flex
                "
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next slide"
                className="
                  absolute right-6 top-1/2 z-20 hidden h-11 w-11
                  -translate-y-1/2 items-center justify-center
                  rounded-full bg-white/95 shadow-md backdrop-blur-sm
                  opacity-0 scale-95 transition-all duration-300
                  group-hover:opacity-100 group-hover:scale-100
                  hover:scale-110 hover:shadow-lg
                  md:flex
                "
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            {banners.map((_, index) => {
              const isActive = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-3 w-3 bg-slate-700"
                      : "h-2 w-2 bg-slate-300"
                  }`}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};