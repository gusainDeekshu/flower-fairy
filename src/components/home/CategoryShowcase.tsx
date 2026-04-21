// src\components\home\CategoryShowcase.tsx

// src/components/home/CategoryShowcase.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Skincare", image: "/skincare-cat.jpg", href: "/collections/skincare" },
  { name: "Haircare", image: "/haircare-cat.jpg", href: "/collections/haircare" },
  { name: "Combos & Kits", image: "/combos-cat.jpg", href: "/collections/combos" },
  { name: "Best Sellers", image: "/bestsellers-cat.jpg", href: "/collections/bestsellers" },
];

export function CategoryShowcase({ data }: { data?: any[] }) {
  // If your NestJS backend sends dynamic categories, you can map 'data' here instead of the static array above.
  const displayCategories = data?.length ? data : categories;

  return (
    <section className="py-16 max-w-[1600px] mx-auto px-4 md:px-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-gray-500 font-medium">
            Discover formulations tailored to your specific needs.
          </p>
        </div>
        <Link 
          href="/collections" 
          className="hidden md:inline-block text-sm font-bold border-b-2 border-transparent hover:border-gray-900 transition-colors pb-0.5 uppercase tracking-widest text-gray-900"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {displayCategories.map((cat, idx) => (
          <Link 
            key={cat.id || cat.name || idx} 
            href={cat.href || `/collections/${cat.slug}`} 
            className="group relative aspect-[3/4] overflow-hidden bg-gray-100 block"
          >
            <Image 
              src={cat.image || cat.imageUrl || "/placeholder-category.jpg"} 
              alt={cat.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-white text-lg md:text-xl font-bold tracking-wide">
                {cat.name}
              </h3>
              <span className="text-white/90 text-xs uppercase tracking-widest font-bold mt-2 block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}