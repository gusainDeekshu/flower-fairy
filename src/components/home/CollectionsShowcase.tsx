// src/components/home/CollectionsShowcase.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PackageSearch, Sparkles, Gem } from "lucide-react";

import ProductCard from "../ui/ProductCard";
import { BRAND } from "@/config/brand.config";

interface CollectionsShowcaseProps {
  data: any[];
  settings: {
    title?: string;
    collectionId?: string;
    showHighlights?: boolean;
  };
}

const SECTION_SPACING = "py-12 md:py-16 lg:py-24";
const CONTAINER_SPACING = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

/* ─────────────────────────────────────────────
   Shared decorative background shell
   ───────────────────────────────────────────── */
const BgShell: React.FC<{
  primary: string;
  secondary: string;
  children: React.ReactNode;
  compact?: boolean;
}> = ({ primary, secondary, children, compact }) => (
  <div
    className={`relative overflow-hidden rounded-[44px] ${
      compact ? "p-8 md:p-12" : "p-5 sm:p-7 lg:p-10"
    }`}
    style={{
      /* Rich multi-stop background */
      background: `
        radial-gradient(ellipse 80% 60% at 10% -10%, ${primary}22 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 90% 110%, ${secondary}1e 0%, transparent 55%),
        radial-gradient(ellipse 40% 40% at 50% 50%, ${primary}08 0%, transparent 70%),
        linear-gradient(155deg,
          #fafffe 0%,
          #f4faf8 25%,
          #edf6f3 50%,
          #f0f9f7 75%,
          #fafffe 100%
        )
      `,
      boxShadow: `
        0 0 0 1px ${primary}18,
        0 40px 140px -20px ${primary}20,
        0 20px 60px -10px rgba(0,0,0,0.06),
        inset 0 1px 0 rgba(255,255,255,0.9)
      `,
    }}
  >
    {/* ── Floating ambient orbs ── */}
    <div
      className="pointer-events-none absolute -top-32 -right-16 h-[500px] w-[500px] rounded-full"
      style={{
        background: `radial-gradient(circle, ${primary}28 0%, ${primary}00 70%)`,
        filter: "blur(48px)",
      }}
    />
    <div
      className="pointer-events-none absolute -bottom-24 -left-20 h-[420px] w-[420px] rounded-full"
      style={{
        background: `radial-gradient(circle, ${secondary}22 0%, ${secondary}00 70%)`,
        filter: "blur(48px)",
      }}
    />
    <div
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full"
      style={{
        background: `radial-gradient(circle, ${primary}0a 0%, transparent 65%)`,
        filter: "blur(60px)",
      }}
    />

    {/* ── Fine grain texture overlay ── */}
    <div
      className="pointer-events-none absolute inset-0 rounded-[44px] opacity-[0.018]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px 180px",
      }}
    />

    {/* ── Subtle grid lines ── */}
    <div
      className="pointer-events-none absolute inset-0 rounded-[44px]"
      style={{
        backgroundImage: `
          linear-gradient(to right, ${primary}0c 1px, transparent 1px),
          linear-gradient(to bottom, ${primary}0c 1px, transparent 1px)
        `,
        backgroundSize: "36px 36px",
      }}
    />

    {/* ── Top gloss edge ── */}
    <div className="pointer-events-none absolute inset-x-0 top-0 h-32 rounded-t-[44px] bg-gradient-to-b from-white/60 to-transparent" />

    {/* ── Bottom vignette ── */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-[44px] bg-gradient-to-t from-black/[0.02] to-transparent" />

    <div className="relative z-10">{children}</div>
  </div>
);

/* ─────────────────────────────────────────────
   Badge pill
   ───────────────────────────────────────────── */
const BadgePill: React.FC<{
  primary: string;
  icon: React.ReactNode;
  label: string;
}> = ({ primary, icon, label }) => (
  <div
    className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md"
    style={{
      background: `linear-gradient(135deg, ${primary}14, ${primary}0a)`,
      borderColor: `${primary}28`,
      boxShadow: `0 2px 12px ${primary}14, inset 0 1px 0 rgba(255,255,255,0.6)`,
    }}
  >
    <span style={{ color: primary }}>{icon}</span>
    <span
      className="text-[10px] font-black uppercase tracking-[0.3em]"
      style={{ color: primary }}
    >
      {label}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({
  data = [],
  settings,
}) => {
  const title = settings?.title || "";
  const collection = data?.length > 0 ? data[0] : null;

  const ADMIN_URL =
    process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3000";

  const primary = BRAND.theme.primary;
  const secondary = BRAND.theme.secondary;

  /* ── No collection selected ── */
  if (!settings?.collectionId) {
    return (
      <section className={`w-full ${SECTION_SPACING}`}>
        <div className={CONTAINER_SPACING}>
          <BgShell primary={primary} secondary={secondary} compact>
            <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
              <p
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: `${primary}70` }}
              >
                No Collection Selected
              </p>
            </div>
          </BgShell>
        </div>
      </section>
    );
  }

  /* ── Collection exists but no products ── */
  if (!collection || !collection.products || collection.products.length === 0) {
    return (
      <section className={`w-full ${SECTION_SPACING}`}>
        <div className={CONTAINER_SPACING}>
          <BgShell primary={primary} secondary={secondary} compact>
            {title && (
              <div className="mb-10">
                <BadgePill
                  primary={primary}
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  label="Featured Collection"
                />
                <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
                  {title}
                </h2>
              </div>
            )}

            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              {/* Icon card */}
              <div
                className="flex h-24 w-24 items-center justify-center rounded-[28px]"
                style={{
                  background: `linear-gradient(135deg, ${primary}16, ${secondary}1a)`,
                  boxShadow: `0 12px 40px ${primary}1e, inset 0 1px 0 rgba(255,255,255,0.7)`,
                  border: `1px solid ${primary}20`,
                }}
              >
                <PackageSearch
                  className="h-11 w-11"
                  style={{ color: primary }}
                />
              </div>

              <div className="mt-8 space-y-3">
                <h3 className="text-2xl font-black tracking-tight text-zinc-900">
                  No products available yet
                </h3>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-500 md:text-base">
                  This collection is currently empty. Add products from your
                  admin dashboard to make them visible on your storefront.
                </p>
              </div>

              <Link
                href={`${ADMIN_URL}/storefront`}
                target="_blank"
                className="group mt-8 inline-flex items-center gap-3 rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:brightness-110"
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                  boxShadow: `0 16px 48px ${primary}38`,
                }}
              >
                Manage Products
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </BgShell>
        </div>
      </section>
    );
  }

  /* ── Success: render products ── */
  const rawProducts = collection.products;
  const productsToRender = rawProducts
    .map((p: any) => (p.product ? p.product : p))
    .slice(0, 4);

  return (
    <section className={`w-full ${SECTION_SPACING}`}>
      <div className={CONTAINER_SPACING}>
        <BgShell primary={primary} secondary={secondary}>
          {/* ═══════════════ HEADER ═══════════════ */}
          {title && (
            <div className="mb-10 md:mb-14">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                {/* LEFT side */}
                <div className="max-w-2xl space-y-5">
                  <BadgePill
                    primary={primary}
                    icon={<Gem className="h-3.5 w-3.5" />}
                    label="Curated Collection"
                  />

                  <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                      {title}
                    </h2>

                    {/* Animated accent bar */}
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1 w-16 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${primary}, ${secondary})`,
                          boxShadow: `0 2px 8px ${primary}40`,
                        }}
                      />
                      <div
                        className="h-1 w-4 rounded-full opacity-40"
                        style={{ background: primary }}
                      />
                      <div
                        className="h-1 w-2 rounded-full opacity-20"
                        style={{ background: primary }}
                      />
                    </div>

                    <p className="max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-base">
                      Discover handcrafted premium natural essentials curated
                      for wellness, beauty, and mindful living.
                    </p>
                  </div>
                </div>

                {/* RIGHT: desktop CTA */}
                {rawProducts.length > 4 && (
                  <Link
                    href={`/collections/${collection.slug || collection.id}`}
                    className="group hidden items-center gap-3 rounded-2xl border px-6 py-3 text-sm font-bold text-zinc-700 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 md:inline-flex"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      borderColor: `${primary}22`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.06), 0 2px 8px ${primary}14`,
                    }}
                  >
                    View all products
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${primary}18, ${secondary}14)`,
                      }}
                    >
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        style={{ color: primary }}
                      />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════ PRODUCT GRID ═══════════════ */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {productsToRender.map((product: any, i: number) => (
              <div
                key={product.id}
                className="group relative transition-all duration-300 hover:-translate-y-1.5"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                {/* Per-card glow on hover */}
                <div
                  className="pointer-events-none absolute -inset-1 rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 100%, ${primary}18, transparent 70%)`,
                    filter: "blur(12px)",
                  }}
                />

                {/* Card surface lift */}
                <div
                  className="relative transition-shadow duration-300"
                  style={{
                    filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.04))`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════════ MOBILE CTA ═══════════════ */}
          {rawProducts.length > 4 && (
            <div className="mt-8 flex justify-center md:hidden">
              <Link
                href={`/collections/${collection.slug || collection.id}`}
                className="group inline-flex items-center gap-3 rounded-2xl border px-6 py-3 text-sm font-bold text-zinc-700 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  borderColor: `${primary}22`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.06)`,
                }}
              >
                View all products
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${primary}18, ${secondary}14)`,
                  }}
                >
                  <ArrowRight
                    className="h-4 w-4"
                    style={{ color: primary }}
                  />
                </div>
              </Link>
            </div>
          )}
        </BgShell>
      </div>
    </section>
  );
};
