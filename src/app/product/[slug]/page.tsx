// src/app/product/[slug]/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import ProductDetailsClient from './ProductDetailsClient';
import { ProductApi } from '@/services/product.service';

// 1. Change the type to Promise<{ slug: string }>
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Await the params before destructuring
  const { slug } = await params; 
  
  const queryClient = new QueryClient();

  // Prefetching logic
  await queryClient.prefetchQuery({
    queryKey: ['product', slug],
    queryFn: () => ProductApi.getProductBySlug(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailsClient slug={slug} />
    </HydrationBoundary>
  );
}