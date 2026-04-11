export interface HomepageConfig {
  heroBanners: any[];
  sectionsOrder: Array<{ id: string; type: 'HERO' | 'CATEGORIES' | 'FEATURED_PRODUCTS' | 'BUNDLE_BUILDER'; settings: any }>;
  featuredLimit: number;
}