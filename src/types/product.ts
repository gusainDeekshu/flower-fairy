export interface APlusBlock {
  type: 'banner' | 'split' | 'image_grid'; // Added grid for WOW style callouts
  imageUrl?: string;
  images?: string[]; // For grids
  title?: string;
  text?: string;
  align?: 'left' | 'right';
  link?: string;
}

export interface HomepageConfig {
  sectionsOrder: Array<{
    id: string;
    type: 'HERO' | 'CATEGORIES' | 'FEATURED_PRODUCTS' | 'BUNDLE_BUILDER' | 'TRUST_BADGES';
    settings: any;
  }>;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number;
  stock: number;
}


export interface ProductExtra {
  safetyInfo?: string;
  ingredients?: string;
  directions?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  aPlusContent?: APlusBlock[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  attributes: Record<string, string>;
  // variants: Array<{ id: string; name: string; value: string }>;
  careInstructions: string[];
  deliveryInfo: string[];
  extra: ProductExtra;
  variants: ProductVariant[];
}