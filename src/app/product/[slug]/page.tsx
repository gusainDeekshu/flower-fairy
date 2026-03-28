import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { AxiosError } from 'axios';

// API Service
import { ProductApi } from '@/services/product.service';

// Components
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ImportantInfo from '@/components/product/ImportantInfo';
import ProductDescription from '@/components/product/ProductDescription';
import APlusContent from '@/components/product/APlusContent';
import ProductDetails from '@/components/product/ProductDetails';
import SimilarProducts from '@/components/product/SimilarProducts';
import StickyAddToCart from '@/components/product/StickyAddToCart';

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Await the params (Next.js 15+ requirement)
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let product = null;

  // 2. Fetch the product using your new ProductApi service
  try {
    product = await ProductApi.getProductBySlug(slug);
  } catch (error) {
    // 3. Gracefully handle 404 Not Found errors thrown by Axios/NestJS
    if (error instanceof AxiosError && error.response?.status === 404) {
      product = null; // Will trigger notFound() below
    } else {
      console.error(`🚨 Error fetching product [${slug}]:`, error);
      product = null;
    }
  }

  // 4. If product doesn't exist or API fails with 404, show not-found.tsx
  if (!product) {
    notFound();
  }

  // 5. Render the Amazon-style layout in strict order
  return (
    <div className="min-h-screen bg-white pb-24 md:pb-8 relative">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 1. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
  <div className="lg:col-span-5">
    <ProductGallery images={product.images || []} name={product.name} />
  </div>

  <div className="lg:col-span-7">
    <ProductInfo product={product as any} />
  </div>
</div>

        <hr className="border-gray-200" />

        {/* 2. SIMILAR PRODUCTS */}
        <Suspense fallback={<div className="h-64 bg-gray-50 animate-pulse rounded-lg w-full max-w-7xl mx-auto" />}>
          {/* Assuming SimilarProducts internally fetches using ProductApi.getSimilarProducts */}
          <SimilarProducts category={product.category} productId={product.id} />
        </Suspense>

        <hr className="border-gray-200" />

        {/* 3. IMPORTANT INFORMATION */}
        {product.extra && (
          <ImportantInfo extra={product.extra} />
        )}

        {/* 4. PRODUCT DESCRIPTION */}
        {product.description && (
          <ProductDescription description={product.description} />
        )}

        {/* 5. A+ CONTENT */}
        {product.extra?.aPlusContent && product.extra.aPlusContent.length > 0 && (
          <APlusContent blocks={product.extra.aPlusContent} />
        )}

        {/* 6. PRODUCT DETAILS TABLE */}
        <ProductDetails product={product as any} />

      </main>

      {/* MOBILE STICKY ADD TO CART */}
      <StickyAddToCart product={product as any} />
    </div>
  );
}