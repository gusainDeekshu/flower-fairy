// src/components/ui/ProductCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
    category?: { name: string } | string;
    stock?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercent = product.oldPrice
    ? Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      )
    : 0;

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name;

  return (
    <article
      className="
        group relative flex flex-col h-full rounded-2xl border border-neutral-200 
        bg-white overflow-hidden transition-all duration-300 
        hover:shadow-lg hover:-translate-y-0.5
        focus-within:ring-2 focus-within:ring-black/10
      "
    >
      {/* IMAGE */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] bg-neutral-100 overflow-hidden"
        aria-label={product.name}
      >
        <Image
          src={product.images?.[0] || "/placeholder-product.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span
            className="
              absolute top-2 left-2 z-10 
              rounded-md bg-red-600 text-white 
              text-[10px] font-semibold px-2 py-1
            "
          >
            {discountPercent}% OFF
          </span>
        )}
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-grow p-3 sm:p-4">
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1 text-xs text-neutral-600">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">
              {product.rating.toFixed(1)}
            </span>
            {product.reviewCount && (
              <span className="text-neutral-400">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3
            className="
              text-sm sm:text-base font-medium text-neutral-900 
              leading-snug line-clamp-2 
              transition-colors duration-200 
              group-hover:text-neutral-700
            "
          >
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        {categoryName && (
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {categoryName}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Pricing */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-base sm:text-lg font-semibold text-neutral-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.oldPrice && (
            <span className="text-xs sm:text-sm text-neutral-400 line-through">
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-3">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              images: product.images,
            }}
            stock={product.stock}
          />
        </div>
      </div>
    </article>
  );
}