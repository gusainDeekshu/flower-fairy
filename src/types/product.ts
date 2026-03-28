export interface APlusBlock {
  type: 'banner' | 'split';
  imageUrl: string;
  title?: string;
  text?: string;
  align?: 'left' | 'right';
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
  variants: Array<{ id: string; name: string; value: string }>;
  careInstructions: string[];
  deliveryInfo: string[];
  extra: ProductExtra;
}