// src/types/profile.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export interface WishlistItem {
  id: string;
  product: ProductSummary;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  product: ProductSummary;
}