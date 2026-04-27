// src/components/home/ProductCarousel.tsx

"use client";

import React, { useRef } from "react";
import Link from "next/link";
import ProductCard from "../ui/ProductCard";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, PackageSearch, Sparkles } from "lucide-react";

interface ProductCarouselProps {
  data: any[];
  settings: {
    title?: string;
    showHighlights?: boolean;
  };
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  data = [],
  settings,
}) => {
  const title = settings?.title || "";
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  "http://localhost:3000";


  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.8;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* ---------------- EMPTY STATE ---------------- */
  if (!data || data.length === 0) {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto">
        {/* EMPTY STATE */}
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-white py-20 px-6">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_35%)]" />

          <div className="relative flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 shadow-sm">
              <PackageSearch className="w-10 h-10 text-amber-600" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold tracking-wide text-zinc-600 uppercase">
                Empty Catalog
              </span>
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-3">
              No products available
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed mb-8 max-w-md">
              Your storefront doesn’t have any products yet. Add products from
              the admin dashboard to start showcasing them here.
            </p>

            {/* CTA */}
            <Link
              href={`${ADMIN_URL}/storefront`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium transition-all hover:scale-105"
            >
              Add Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 mt-8 md:mt-12">
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={sectionVariants}
        className="max-w-7xl mx-auto"
      >
        {/* HEADER */}
        {title && (
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              {title}
            </h2>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 transition"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 transition"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* CAROUSEL */}
        <div className="relative">
          {/* Right fade (scroll hint) */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10 hidden md:block" />

          <div
            ref={scrollRef}
            className="
              flex gap-4 sm:gap-5 md:gap-6
              overflow-x-auto overflow-y-hidden
              snap-x snap-mandatory
              scrollbar-none
              pb-3
            "
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            {data.map((item: any) => {
              const product = item.product ? item.product : item;

              return (
                <motion.div
                  key={product.id}
                  variants={shouldReduceMotion ? {} : itemVariants}
                  className="
                    snap-start
                    min-w-[72%]
                    sm:min-w-[48%]
                    md:min-w-[300px]
                    lg:min-w-[320px]
                    transition-transform duration-300
                    hover:scale-[1.03]
                  "
                >
                  <ProductCard product={product} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ---------------- ANIMATION SYSTEM ---------------- */

const easing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
};