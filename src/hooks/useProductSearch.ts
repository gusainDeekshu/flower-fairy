// src\hooks\useProductSearch.ts

import { useQuery } from '@tanstack/react-query';
import {apiClient} from '@/lib/api-client'; // Using your existing axios instance

export function useProductSearch(searchTerm: string) {
  return useQuery({
    queryKey: ['product-search', searchTerm],
    queryFn: async ({ signal }) => {
      if (searchTerm.length < 2) return [];

      // 🛑 The signal parameter is automatically passed by React Query.
      // Wiring it to the apiClient config enables automatic request cancellation 
      // if the user types another character before this network request finishes.
      const res = await apiClient.get('/products/search', {
        params: { q: searchTerm, limit: 12 },
        signal, 
      });
      
      return res.data || [];
    },
    // Only execute the query if the debounced term is 2+ chars
    enabled: searchTerm.length >= 2,
    // Keep previous data on the screen while fetching the next keystroke
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });
}