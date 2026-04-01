// src/services/product.service.ts

import { apiClient } from "@/lib/api-client";
import { ProductSchema, Product } from "@/schemas/product.schema";
import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                         SIMILAR PRODUCT SCHEMA                             */
/* -------------------------------------------------------------------------- */

const SimilarProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  oldPrice: z.number().nullable().optional(),
  images: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export type SimilarProduct = z.infer<typeof SimilarProductSchema>;

/* -------------------------------------------------------------------------- */
/*                                PRODUCT API                                 */
/* -------------------------------------------------------------------------- */

export class ProductApi {
  /* ------------------------------ GET PRODUCTS ----------------------------- */

  static async getProducts(category?: string): Promise<Product[]> {
   // Extract data!
    const { data } = await apiClient.get("/products", {
      params: { category },
    });

// Parse the data!
    const validated = z.array(ProductSchema).parse(data);
    return validated;
  }

  /* --------------------------- GET PRODUCT BY SLUG ------------------------- */

  static async getProductBySlug(slug: string): Promise<Product> {
    try {

      // const res = await apiClient.get(`/products/${slug}`);
// 🚨 FIX: Destructure { data } from the response
      const { data } = await apiClient.get(`/products/${slug}`);
      
      // 🚨 FIX: Pass the data into Zod, not the full Axios response
      const validated = ProductSchema.parse(data);

      // const validated = ProductSchema.parse(res);

      return validated;
    } catch (error) {
      console.error("Zod Validation Error:", error);
      throw error;
    }
  }

  /* -------------------------- GET SIMILAR PRODUCTS ------------------------- */

  static async getSimilarProducts(category: string) {
    try {
      // 🚨 FIX 1: Destructure { data } from the Axios response
      const { data } = await apiClient.get("/products", {
        params: { category },
      });

      // 🚨 FIX 2: Pass 'data' to Zod, not 'res'
      const validated = z.array(SimilarProductSchema).parse(data);

      return validated;
    } catch (error) {
      console.error("Failed to fetch similar products:", error);
      throw error;
    }
  }
}