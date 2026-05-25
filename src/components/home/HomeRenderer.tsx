// src/components/home/HomeRenderer.tsx

"use client";

import React from "react";

import { HeroBanner } from "./HeroBanner";
import { ProductCarousel } from "./ProductCarousel";
import { PromotionalBanner } from "./PromotionalBanner";
import { TrustTicker } from "./TrustTicker";
import { BrandStory } from "./BrandStory";
import { FeaturedProducts } from "./FeaturedProducts";
import { HomeBlogSection } from "./HomeBlogSection";
import { CollectionsShowcase } from "./CollectionsShowcase";
import { VideoShoppableSection } from "./VideoShoppableSection";
import { cn } from "@/lib/utils";

// SECTION REGISTRY
const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  HERO: HeroBanner,
  COLLECTIONS: CollectionsShowcase,
  FEATURED_PRODUCTS: FeaturedProducts,
  PRODUCT_CAROUSEL: ProductCarousel,
  PROMO_BANNER: PromotionalBanner,
  TRUST_BADGES: TrustTicker,
  BRAND_STORY: BrandStory,
  BLOG_SECTION: HomeBlogSection,
  VIDEO_SHOPPABLE: VideoShoppableSection,
};

interface HomeRendererProps {
  config: {
    sectionsOrder: any[];
  };
  data: any;
}

export default function HomeRenderer({
  config,
  data,
}: HomeRendererProps) {
  const sectionsToRender = config?.sectionsOrder || [];

  if (!sectionsToRender.length) return null;

  return (
    <div className="w-full flex flex-col gap-0 bg-white">
      {sectionsToRender
        ?.filter((section) => section.isActive !== false)
        ?.map((section) => {
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;

          const resolvedData = resolveData(section, data);

          // Full-width containers config wrapper
          const isFullWidth = ["HERO", "PROMO_BANNER"].includes(section.type);

          return (
            <section
              key={section.id}
              id={section.id}
              className={cn("w-full", !isFullWidth && "px-4 md:px-0")}
            >
              {isFullWidth ? (
                <Component
                  data={resolvedData}
                  settings={section.settings || {}}
                />
              ) : (
                <div className="max-w-7xl mx-auto w-full">
                  <Component
                    data={resolvedData}
                    settings={section.settings || {}}
                  />
                </div>
              )}
            </section>
          );
        })}
    </div>
  );
}

/**
 * DATA RESOLVER
 * Ensures each section receives the proper backend data configuration array mapping
 */
function resolveData(section: any, data: any) {
  const settings = section.settings || {};
  const sourceKey = settings.dataSource;

  switch (section.type) {
    case "FEATURED_PRODUCTS":
      return data?.featuredProducts || [];

    case "PRODUCT_CAROUSEL":
      if (sourceKey?.startsWith("collection_")) {
        const slug = sourceKey.replace("collection_", "");

        const targetCollection = data.collections?.find(
          (collection: any) => collection.slug === slug
        );

        return (
          targetCollection?.products?.map(
            (product: any) => product.product || product
          ) || []
        );
      }

      return data?.[sourceKey] || [];

    case "COLLECTIONS":
      // FIX: Filter down to the single matching selection using collectionId settings
      if (settings?.collectionId && data?.collections) {
        const selectedCollection = data.collections.find(
          (c: any) => String(c.id) === String(settings.collectionId)
        );
        // Wrap in an array so collection = data[0] remains safe and functional
        if (selectedCollection) {
          return [selectedCollection];
        }
      }
      // Fallback matching setup
      return data?.collections || [];

    case "BLOG_SECTION":
      return data?.blogs || [];

    case "HERO":
    case "PROMO_BANNER":
      return data?.banners || [];

    // 🚀 ADD THIS CASE HERE
    case 'VIDEO_SHOPPABLE':
      // The config panel saves the reels inside settings.slides, so we return that!
      return settings.slides || [];

    default:
      return [];
  }
}