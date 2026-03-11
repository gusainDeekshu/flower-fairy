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
    const res = await apiClient.get("/products", {
      params: { category },
    });

    console.log("RAW PRODUCTS:", res);

    const validated = z.array(ProductSchema).parse(res);

    return validated;
  }

  /* --------------------------- GET PRODUCT BY SLUG ------------------------- */

  static async getProductBySlug(slug: string): Promise<Product> {
    try {
      const res = await apiClient.get(`/products/${slug}`);

      console.log("RAW PRODUCT:", res);

      const validated = ProductSchema.parse(res);

      return validated;
    } catch (error) {
      console.error("Zod Validation Error:", error);
      throw error;
    }
  }

  /* -------------------------- GET SIMILAR PRODUCTS ------------------------- */

  static async getSimilarProducts(category: string): Promise<SimilarProduct[]> {
    const res = await apiClient.get(`/products/similar/${category}`);

    console.log("RAW SIMILAR PRODUCTS:", res);

    const validated = z.array(SimilarProductSchema).parse(res);

    return validated;
  }
}