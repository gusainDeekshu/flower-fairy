import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ProductGallery from './ProductGallery';
import ProductInfoBox from './ProductInfoBox';
import { ProductApi } from '@/services/product.service';

const ProductDetailsTable = dynamic(() => import('./ProductDetailsTable'));
const APlusContent = dynamic(() => import('./APlusContent'));
const StickyAddToCart = dynamic(() => import('./StickyAddToCart'));

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await ProductApi.getProductBySlug(resolvedParams.slug);
  
  return {
    title: `${product.name} | YourBrand`,
    description: product.description?.substring(0, 160) || '',
    openGraph: product.image ? { images: [product.image] } : undefined
  };
}

// FIXED: Add `: Props` right here!
export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await ProductApi.getProductBySlug(resolvedParams.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: { '@type': 'Brand', name: product.extra?.manufacturer || 'YourBrand' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          {/* Note: product.image handles the single image from Prisma */}
          <ProductGallery image={product.image} variants={product.variants} />
          <ProductInfoBox product={product} />
        </div>

        <hr className="my-10" />

        {product.extra && <ProductDetailsTable extra={product.extra} />}

        {product.extra?.aPlusContent && (
          <APlusContent blocks={product.extra.aPlusContent} />
        )}

        <StickyAddToCart product={product} />
      </main>
    </>
  );
}