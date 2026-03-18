// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useProducts(categorySlug?: string) {
  return useQuery({
    queryKey: ['products', 'flower-fairy-dehradun', categorySlug || null],
    queryFn: async () => {
      // 1. Fetch data using your existing apiClient
      const response: any = await apiClient.get('/products/catalog/flower-fairy-dehradun');
      
      // 2. Extract the actual array. 
      // Based on your previous logs, NestJS often returns { products: [...] }
      const data = response?.data || response;
      const productList = Array.isArray(data?.products) ? data.products : (Array.isArray(data) ? data : []); 

      // 3. Filter by category if a slug was provided
      if (categorySlug && productList.length > 0) {
        return productList.filter((p: any) => p.category?.slug === categorySlug);
      }
      
      return productList;
    },
    staleTime: 1000 * 60 * 10,
  });
}