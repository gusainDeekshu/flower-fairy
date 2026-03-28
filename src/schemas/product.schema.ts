// src/schemas/product.schema.ts
import { z } from "zod";

export const ProductAttributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceModifier: z.number(),
  stock: z.number(),
});

export const ProductSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),

    description: z.string().nullable().optional(),

    price: z.number(),
    oldPrice: z.number().nullable().optional(),

    // Support both single image (from your Prisma) and images array
    image: z.string().optional(),
    images: z.array(z.string()).optional(),

    ingredients: z.string().nullable().optional(),

    careInstructions: z.array(z.string()).optional(),
    deliveryInfo: z.array(z.string()).optional(),

    // Make these optional so it doesn't crash if new products lack ratings
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
    reviews: z.array(z.any()).optional(),

    categoryId: z.string(),
    storeId: z.string(),

    attributes: z.array(ProductAttributeSchema).optional(),
    variants: z.array(ProductVariantSchema).optional(),

    // NEW: Allow the "extra" data we created for A+ content to pass validation
    extra: z.any().optional(),

    isActive: z.boolean().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),

    category: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      })
      .optional(),
  })
  .passthrough(); // passthrough allows any other unknown fields to pass through safely

export type Product = z.infer<typeof ProductSchema>;