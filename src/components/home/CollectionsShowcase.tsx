// src\components\home\CollectionsShowcase.tsx


"use client";

import React from "react";
import Link from "next/link";
import ProductCard from "../ui/ProductCard";
import { ArrowRight, PackageSearch, Sparkles } from "lucide-react";

interface CollectionsShowcaseProps {
  data: any[];
  settings: {
    title?: string;
    collectionId?: string;
    showHighlights?: boolean;
  };
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({
  data = [],
  settings,
}) => {
  const title = settings?.title || "";
  const collection = data?.length > 0 ? data[0] : null;


  const ADMIN_URL =
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  "http://localhost:3000";


  /* ---------------- EMPTY STATE ---------------- */
  if (!settings?.collectionId) {
    return (
      <section className="w-full px-4 sm:px-6 md:px-8 mt-6 md:mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-center">
            <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              No Collection Selected
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- NO DATA STATE ---------------- */
  if (!collection || !collection.products || collection.products.length === 0) {
  return (
    <section className="w-full px-4 sm:px-6 md:px-8 mt-6 md:mt-10">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900">
              {title}
            </h2>

            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        )}

        {/* EMPTY STATE */}
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-zinc-300 bg-gradient-to-br from-zinc-50 to-white py-20 px-6">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_35%)]" />

          <div className="relative flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 shadow-sm">
              <PackageSearch className="w-10 h-10 text-amber-600" />
            </div>

            {/* Heading */}
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-3">
              No products available yet
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed mb-8 max-w-md">
              This collection is currently empty. Add products from your admin
              dashboard to make them visible on your storefront.
            </p>

            {/* CTA */}
            <Link
              href={`${ADMIN_URL}/storefront`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-sm font-medium transition-all hover:scale-105"
            >
              Manage Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

  /* ---------------- SUCCESS STATE ---------------- */

  const rawProducts = collection.products;
  const productsToRender = rawProducts
    .map((p: any) => (p.product ? p.product : p))
    .slice(0, 4);

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        {title && (
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              {title}
            </h2>

            {rawProducts.length > 4 && (
              <Link
                href={`/collections/${collection.slug || collection.id}`}
                className="text-sm font-medium text-[#217A6E] hover:underline transition"
                aria-label={`View all products in ${title}`}
              >
                View all
              </Link>
            )}
          </div>
        )}

        {/* GRID */}
        <div className="
          grid grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-3 sm:gap-4 md:gap-6
        ">
          {productsToRender.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};