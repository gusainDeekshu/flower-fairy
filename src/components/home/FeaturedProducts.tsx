// src/components/home/FeaturedProducts.tsx

"use client";

import React from "react";
import ProductCard from "../ui/ProductCard";
import Link from "next/link";
import { ArrowRight, PackageSearch, Sparkles } from "lucide-react";

interface FeaturedProductsProps {
  data?: any[];
  settings?: {
    title?: string;
  };
}

export const FeaturedProducts = ({
  data = [],
  settings = {},
}: FeaturedProductsProps) => {
  const title = settings?.title;

  const hasProducts = data && data.length > 0;


  const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  "http://localhost:3000";

  return (
    <section
      className="w-full px-4 py-10 sm:py-12 lg:py-16"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        {title && (
          <div className="mb-6 sm:mb-8 flex items-center justify-between">
            <h2
              id="featured-products-heading"
              className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-neutral-900"
            >
              {title}
            </h2>
          </div>
        )}

        {/* EMPTY STATE */}
      
{!hasProducts && (
  <div className="relative overflow-hidden rounded-[28px] border border-dashed border-zinc-300 bg-gradient-to-b from-white to-zinc-50 px-8 py-14 text-center shadow-sm">

    {/* Icon */}
    <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-3xl bg-zinc-100 ring-8 ring-zinc-50">
      <PackageSearch className="h-8 w-8 text-zinc-500" />
    </div>

    {/* Badge */}
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500">
      <Sparkles className="h-3.5 w-3.5" />
      Featured Collection Empty
    </div>

    {/* Heading */}
    <h3 className="mt-5 text-xl font-semibold tracking-tight text-zinc-900">
      No featured products yet
    </h3>

    {/* Description */}
    <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-md mx-auto">
      Mark products as <span className="font-medium">featured</span> from your
      admin panel to highlight bestsellers, trending items, or recommended picks.
    </p>

    {/* CTA */}
    <Link
      href={`${ADMIN_URL}/admin/storefront`}
      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:opacity-90"
    >
      Manage Products
      <ArrowRight className="h-4 w-4" />
    </Link>

    {/* Helper */}
    <p className="mt-4 text-xs text-zinc-400">
      Featured products will automatically appear here once enabled.
    </p>
  </div>
)}

        {/* GRID */}
        {hasProducts && (
          <div
            className="
              grid 
              grid-cols-2 
              gap-4 
              sm:grid-cols-2 
              sm:gap-5 
              md:grid-cols-3 
              lg:grid-cols-4 
              lg:gap-6
            "
          >
            {data.map((product: any) => {
              const normalizedProduct = product.product
                ? product.product
                : product;

              return (
                <ProductCard
                  key={normalizedProduct.id}
                  product={normalizedProduct}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};