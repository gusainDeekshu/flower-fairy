import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import ProductCard from "@/components/ui/ProductCard";

export const revalidate = 60; // ISR cache for 60 seconds

// 🚨 1. Type params as a Promise for Next.js 15
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  // 🚨 2. Await the params to extract the actual slug string
  const { slug } = await params;
  
  const headersList = await headers();
  const domain = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost";
  
  let collection = null;

  try {
    // 🚨 3. Pass the unwrapped slug to the API
    const res = await apiClient.get(`/collections/${slug}`, {
      headers: { "x-tenant-domain": domain },
    });
    
    // Safely extract the data accounting for custom Axios interceptors
    collection = Array.isArray(res) ? res : (res.data || res);

  } catch (error) {
    console.error(`[SSR] Failed to fetch collection for slug: ${slug}`, error);
    return notFound(); // Triggers your Next.js not-found.tsx
  }

  // Fallback if data is missing or empty
  if (!collection || !collection.products) return notFound();



const isValidImageUrl = (url?: string) => {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('/')) return true; // Relative paths like /placeholder.png are fine
  try {
    new URL(url); // This will throw an error if the URL is malformed/dummy text
    return true;
  } catch {
    return false;
  }
};





  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Section for Collection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
                {collection.description}
              </p>
            )}
            <div className="mt-6 inline-flex items-center bg-green-50 text-[#217A6E] px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
              {collection.products.length} Products
            </div>
          </div>

          {/* 🚨 THE FIX: Only render the image wrapper if the image URL is strictly valid */}
          {collection.image && isValidImageUrl(collection.image) && (
            <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-1/3 aspect-[4/3] opacity-10 md:opacity-100 rounded-2xl overflow-hidden bg-gray-100">
              <Image 
                src={collection.image} 
                alt={collection.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Fade mask to ensure mobile text remains readable over the background image */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent md:hidden" />
            </div>
          )}

        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Explore Collection</h2>
          
          {/* Sort Dropdown */}
          {/* <select className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#217A6E] shadow-sm cursor-pointer hover:border-[#217A6E] transition-colors">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select> */}
        </div>

        {collection.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {collection.products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
               <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-400">No products found in this collection.</h3>
          </div>
        )}
      </div>
    </main>
  );
}