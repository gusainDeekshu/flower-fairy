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