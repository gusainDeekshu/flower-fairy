import { BundleBuilder } from "./BundleBuilder";
import CategoryTabs from "./CategoryTabs";
import { HeroBanner } from "./HeroAndCategories";
import { ProductGrid } from "./ProductGrid";
import TrustBadges from "./TrustBadges";

// src/components/home/SectionRenderer.tsx
const COMPONENTS: any = {
  HERO: HeroBanner,
  CATEGORIES: CategoryTabs,
  FEATURED_PRODUCTS: ProductGrid,
  BUNDLE_BUILDER: BundleBuilder,
  TRUST_BADGES: TrustBadges,
};

export default function SectionRenderer({ config, data }: any) {
  return (
    <>
      {config.sectionsOrder.map((section: string) => {
        const Component = COMPONENTS[section];
        return Component ? <Component key={section} data={data} /> : null;
      })}
    </>
  );
}