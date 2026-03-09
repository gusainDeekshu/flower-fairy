//src/services/product.service.ts
import { apiClient } from '@/lib/api-client';

// Typing based on your Prisma Schema
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  variants?: {
    id: string;
    name: string;
    priceModifier: number;
  }[];
}
export class ProductApi {
  static async getProducts(category?: string): Promise<Product[]> {
    return apiClient.get('/products', { params: { category } });
  }
  
  static async getProductBySlug(slug: string) {
    try {
      const response = await apiClient.get(`/products/${slug}`);
      return response; 
    } catch (error) {
      console.error(`Error fetching product ${slug}:`, error);
      return null;
    }
  }
}