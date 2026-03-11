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

    description: z.string().nullable(),

    price: z.number(),
    oldPrice: z.number().nullable(),

    images: z.array(z.string()),

    ingredients: z.string().nullable(),

    careInstructions: z.array(z.string()),
    deliveryInfo: z.array(z.string()),

    rating: z.number(),
    reviews: z.number(),

    categoryId: z.string(),
    storeId: z.string(),

    attributes: z.array(ProductAttributeSchema),
    variants: z.array(ProductVariantSchema),

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
  .passthrough();

export type Product = z.infer<typeof ProductSchema>;