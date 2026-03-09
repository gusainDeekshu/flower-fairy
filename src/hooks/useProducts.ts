// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProducts(categorySlug?: string) {
  return useQuery({
    // Keep keys consistent with your console error: ["products", "store", slug]
    queryKey: ['products', 'flower-fairy-dehradun', categorySlug || null],
    queryFn: async () => {
      // apiClient already returns response.data due to your interceptor
      const data: any = await apiClient.get('/products/catalog/flower-fairy-dehradun');
      
      // Ensure we always return an array, never undefined
      const products = data?.products || data || []; 

      if (categorySlug && Array.isArray(products)) {
        return products.filter((p: any) => p.category?.slug === categorySlug);
      }
      
      return products;
    },
    staleTime: 1000 * 60 * 10,
  });
}