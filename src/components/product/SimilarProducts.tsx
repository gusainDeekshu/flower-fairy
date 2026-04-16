import Image from 'next/image';
import Link from 'next/link';
import { ProductApi } from '@/services/product.service';

interface SimilarProductsProps {
  category: any; // Can be a string or the populated {id, name, slug} object
  productId: string;
}

export default async function SimilarProducts({ category, productId }: SimilarProductsProps) {
  // 1. Safely extract the category string/slug
  const categorySlug = typeof category === 'object' && category !== null 
    ? category.slug || category.name 
    : category;

  if (!categorySlug) return null;

  try {
    // 2. Fetch real data using your API service
    const rawSimilarProducts = await ProductApi.getSimilarProducts(categorySlug);
    
    // 3. Filter out the current product so it doesn't show in its own "Similar" list
    const similarProducts = rawSimilarProducts.filter(p => p.id !== productId);

    if (!similarProducts || similarProducts.length === 0) {
      return null;
    }

    return (
      <section className="space-y-6 pt-4">
        <h2 className="text-xl font-bold text-gray-900">Products related to this item</h2>
        
        {/* Horizontal scroll container like Amazon */}
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x">
          {similarProducts.map((item) => {
            // Calculate dynamic discount for each similar product
            const hasDiscount = item.oldPrice && item.oldPrice > item.price;
            const itemDiscount = hasDiscount 
              ? Math.round(((item.oldPrice! - item.price) / item.oldPrice!) * 100) 
              : 0;
console.log("Similar Product:", item); // Debug log to verify data structure
            // Use the first image array item OR the single image string based on your schema
            const displayImage = (item.images && item.images[0]) || item.image || '/placeholder.png';

            return (
              <Link 
                href={`/product/${item.id}`} // Or item.slug if your similar schema has it
                key={item.id} 
                className="min-w-[160px] md:min-w-[200px] max-w-[200px] flex flex-col space-y-2 group snap-start"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 group-hover:border-orange-300 transition-colors">
                  <Image 
                    src={displayImage}
                    alt={item.name}
                    fill
                    className="object-contain p-2 mix-blend-multiply"
                    sizes="(max-width: 768px) 160px, 200px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-medium text-blue-700 group-hover:text-orange-600 line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  
                  <div className="mt-auto pt-2 flex flex-col">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-[#FFA41C]">★★★★☆</span> {/* Note: SimilarProductSchema didn't have rating, if you add it, use dynamic stars here too */}
                    </div>
                    
                    <div className="flex items-baseline space-x-2 mt-1">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-500 line-through">
                          ₹{item.oldPrice?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-red-600 font-medium">({itemDiscount}% off)</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return null; // Fail gracefully if the similar products endpoint fails
  }
}