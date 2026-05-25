//src\components\ui\ProductCard.tsx

"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { cn } from "@/lib/utils";
import {
  normalizeMediaCollection,
  resolveFirstProductImage,
} from "@/utils/media-normalization"; // 🔥 IMPORT RESOLVER HELPER

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    rating?: number;
    reviewCount?: number;
    category?: { name: string } | string;
    variants: any[];
    isCodEnabled: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Derive base pricing entirely from variants
  const variants = product.variants || [];

  const cheapestVariant =
    variants.length > 0
      ? variants.reduce(
          (prev, curr) => (prev.price < curr.price ? prev : curr),
          variants[0],
        )
      : null;

  const currentPrice = cheapestVariant?.price || 0;
  const oldPrice = cheapestVariant?.oldPrice;

  // 2. Calculate discount safely from the variant's prices
  const discountPercent =
    oldPrice && oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  // Logic for category name
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name;

  // Default to the first variant if available for the AddToCart payload
  const [selectedVariant] = useState(variants[0] || null);

  // 🔥 3. Media Handling & Hover Extraction
  // const staticImageUrl = resolveFirstProductImage(product.images) || "/placeholder-product.png";

  // Safely parse out raw media strings to extract dynamic paths
  let rawMediaArray: string[] = [];
  try {
    rawMediaArray = Array.isArray(product.images)
      ? product.images
      : typeof product.images === "string"
        ? JSON.parse(product.images)
        : [];
  } catch {
    rawMediaArray = [];
  }

  // Scan files for video extensions or native graphic interchange formats (GIFs)
  // 🔥 Normalize all media properly
  const normalizedMedia = normalizeMediaCollection(product.images);

  // First static image fallback
  const staticImage = normalizedMedia.find((m) => m.type === "image") || null;

  const staticImageUrl = staticImage?.url || "/placeholder-product.png";

  // Find first hoverable media
  const hoverVideo = normalizedMedia.find((m) => m.type === "video");

  const hoverGif = normalizedMedia.find((m) => m.type === "gif");

  const hasDynamicHoverMedia = !!(hoverVideo || hoverGif);

  return (
    <article
      className={cn(
        "group relative flex flex-col h-full rounded-2xl border border-neutral-200",
        "bg-white overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        "focus-within:ring-2 focus-within:ring-black/10",
      )}
    >
      {/* IMAGE / VIDEO HOVER SECTION */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] bg-neutral-100 overflow-hidden"
        aria-label={product.name}
        onMouseEnter={() => {
          setIsHovered(true);

          requestAnimationFrame(() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
            }
          });
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Rewind video back to frame one
          }
        }}
      >
        {/* 🔥 DYNAMIC HOVER CONDITIONAL RENDER */}
        {isHovered && hasDynamicHoverMedia ? (
          hoverVideo ? (
            <video
              ref={videoRef}
              src={hoverVideo.url}
              poster={hoverVideo.posterUrl || undefined}
              autoPlay // 🔥 Forces instantaneous playback upon hover attachment
              muted // 🔥 Required by browsers to permit programmatic autoplay execution
              loop // 🔥 Continuous seamless playback loop
              playsInline // 🔥 Prevents iOS Safari from snapping into fullscreen native players
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-0"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src={hoverGif!.url}
                alt={`${product.name} Preview`}
                fill
                className="object-cover"
                unoptimized // Keep animated frames moving, avoids Next.js static asset parsing freeze
              />
            </div>
          )
        ) : (
          /* DEFAULT RESOLVED STATIC FALLBACK */
          <Image
            src={staticImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            priority={false}
          />
        )}

        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 z-10 rounded-md bg-red-600 text-white text-[10px] font-semibold px-2 py-1">
            {discountPercent}% OFF
          </span>
        )}
      </Link>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-grow p-3 sm:p-4 z-10 bg-white">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1 text-xs text-neutral-600">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            {product.reviewCount && (
              <span className="text-neutral-400">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm sm:text-base font-medium text-neutral-900 leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-neutral-700">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {categoryName && (
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {categoryName}
          </p>
        )}

        <div className="flex-grow" />

        {/* Pricing (Derived strictly from Variants) */}
        <div className="mt-3 flex items-baseline gap-2">
          {variants.length > 1 && (
            <span className="text-xs font-medium text-neutral-500">From</span>
          )}
          <span className="text-base sm:text-lg font-semibold text-neutral-900">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          {oldPrice && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* CTA SECTION */}
        <div className="mt-3">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: currentPrice,
              images: product.images,
              variants: variants,
              isCodEnabled: product.isCodEnabled,
            }}
            variantId={selectedVariant?.id}
            stock={selectedVariant?.stock || 0}
          />
        </div>
      </div>
    </article>
  );
}
