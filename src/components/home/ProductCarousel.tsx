// src/components/home/ProductCarousel.tsx

"use client";

import React from "react";
import Link from "next/link";

import {
  motion,
  Variants,
  useReducedMotion,
} from "framer-motion";

import {
  ArrowRight,
  PackageSearch,
  Sparkles,
} from "lucide-react";

import ProductCard from "../ui/ProductCard";

interface ProductCarouselProps {
  data: any[];

  settings: {
    title?: string;
    showHighlights?: boolean;
  };
}

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const SECTION_SPACING =
  "py-8 md:py-12 lg:py-16";

const CONTAINER_SPACING =
  "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

const easing: [
  number,
  number,
  number,
  number
] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*                              ANIMATION SYSTEM                              */
/* -------------------------------------------------------------------------- */

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.6,
      ease: easing,
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.45,
      ease: easing,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export const ProductCarousel: React.FC<
  ProductCarouselProps
> = ({
  data = [],
  settings = {},
}) => {
  const title = settings?.title || "";

  const shouldReduceMotion =
    useReducedMotion();

  const hasProducts =
    data && data.length > 0;

  const ADMIN_URL =
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    "http://localhost:3000";

  /* ---------------------------------------------------------------------- */
  /*                               EMPTY STATE                              */
  /* ---------------------------------------------------------------------- */

  if (!hasProducts) {
    return (
      <section
        className={`w-full ${SECTION_SPACING}`}
        aria-labelledby="product-carousel-heading"
      >
        <div className={CONTAINER_SPACING}>
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-b from-white to-zinc-50 p-8 text-center shadow-sm md:p-12 lg:p-14">
            {/* Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.10),transparent_35%)]" />

            <div className="relative mx-auto flex max-w-lg flex-col items-center">
              {/* Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 ring-8 ring-zinc-50 shadow-sm">
                <PackageSearch className="h-8 w-8 text-zinc-500" />
              </div>

              {/* Content */}
              <div className="mt-6 space-y-4">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Product Collection Empty
                </div>

                {/* Heading */}
                <h3 className="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                  No products available
                </h3>

                {/* Description */}
                <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500 md:text-base">
                  Add products from your admin
                  dashboard to showcase trending,
                  bestselling, or newly launched
                  items here.
                </p>
              </div>

              {/* CTA */}
              <Link
                href={`${ADMIN_URL}/admin/storefront`}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:opacity-90"
              >
                Manage Products

                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Helper Text */}
              <p className="mt-4 text-xs text-zinc-400">
                Products will automatically appear
                here once added.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                              SUCCESS STATE                             */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      className={`w-full ${SECTION_SPACING}`}
      aria-labelledby="product-carousel-heading"
    >
      <div className={CONTAINER_SPACING}>
        <motion.div
          initial={
            shouldReduceMotion
              ? false
              : "hidden"
          }
          whileInView="visible"
          viewport={{
            once: true,
            margin: "-80px",
          }}
          variants={sectionVariants}
        >
          {/* Header */}
          {title && (
            <div className="mb-8 md:mb-10">
              <div className="flex items-center justify-between">
                <h2
                  id="product-carousel-heading"
                  className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl lg:text-3xl"
                >
                  {title}
                </h2>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
            {data.map((item: any) => {
              const product =
                item.product || item;

              return (
                <motion.div
                  key={product.id}
                  variants={
                    shouldReduceMotion
                      ? {}
                      : itemVariants
                  }
                  className="transform-gpu transition-transform duration-300 hover:scale-[1.02]"
                >
                  <ProductCard
                    product={product}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};