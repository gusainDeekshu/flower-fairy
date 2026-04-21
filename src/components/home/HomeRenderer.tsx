// src/components/home/HomeRenderer.tsx

"use client";

import React from "react";
import { HeroBanner } from "./HeroBanner";
import { CategoryShowcase } from "./CategoryShowcase";
import { ProductCarousel } from "./ProductCarousel";
import { BrandStory } from "./BrandStory";
import { PromotionalBanner } from "./PromotionalBanner";
import { TrustTicker } from "./TrustTicker";
import HomeBlogSection from "./HomeBlogSection";

// 1. Centralized Registry Mapping
const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  HERO: HeroBanner,
  CATEGORIES: CategoryShowcase,
  PRODUCT_CAROUSEL: ProductCarousel,
  PROMO_BANNER: PromotionalBanner,
  TRUST_BADGES: TrustTicker,
  BRAND_STORY: BrandStory,
  BLOG_SECTION: HomeBlogSection,
};

interface HomeRendererProps {
  config: { sectionsOrder: any[] };
  data: any;
}

export default function HomeRenderer({ config, data }: HomeRendererProps) {
  if (!config?.sectionsOrder) return null;

  return (
    <div className="flex flex-col gap-y-16 md:gap-y-24 bg-white min-h-screen">
      {config.sectionsOrder
        .filter((section) => section.isActive)
        .map((section) => {
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) {
            console.warn(`Missing component for type: ${section.type}`);
            return null;
          }

          // 2. Resolve 'Lazy Data' from the aggregated payload
          const resolvedData = resolveData(section, data);

          return (
            <section key={section.id} id={section.id} className="w-full animate-in fade-in duration-700">
              <Component 
                data={resolvedData} 
                settings={section.settings || {}} 
              />
            </section>
          );
        })}
    </div>
  );
}

function resolveData(section: any, data: any) {
  switch (section.type) {
    case 'PRODUCT_CAROUSEL':
      return data[section.settings?.dataSource] || [];
    case 'CATEGORIES':
      return data.collections || [];
    case 'BLOG_SECTION':
      return data.blogs || [];
    case 'HERO':
      return data.banners || []; // If banners are handled via separate model
    default:
      return null;
  }
}