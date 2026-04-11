"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionPill {
  id: string;
  name: string;
  slug: string;
  image?: string; // 🚨 Changed to match your Collection schema
}

export const CategoryTabs = ({ data }: { data: CollectionPill[] }) => {
  if (!data || data.length === 0) return null;



  // 🚨 HELPER: Safely check if a string is a valid URL to prevent Next.js crashes
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
    <section className="w-full border-b border-gray-100 bg-white py-8">
      {/* Hide scrollbar but keep functionality */}
      <div className="no-scrollbar mx-auto max-w-7xl overflow-x-auto px-4">
        <div className="flex min-w-max space-x-6 pb-2 md:justify-center">
          {data.map((item) => (
            <Link 
              key={item.id} 
              href={`/collections/${item.slug}`} 
              className="group flex flex-col items-center"
            >
              {/* Circular Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-transparent bg-gray-50 p-1 transition-all group-hover:border-green-600 group-hover:shadow-md">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-200">
                  {/* 🚨 THE FIX: Only render <Image /> if the URL is valid */}
                  {isValidImageUrl(item.image) ? (
                    <Image 
                      src={item.image!} 
                      alt={item.name} 
                      fill 
                      className="object-cover" 
                      sizes="80px"
                    />
                  ) : (
                    // Fallback pattern if no image or if URL is dummy text
                    <div className="h-full w-full bg-gradient-to-br from-green-50 to-[#006044]/20 flex items-center justify-center">
                      <span className="text-[#006044] font-black text-xl opacity-50 uppercase">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className="mt-3 text-xs font-bold uppercase tracking-wider text-gray-700 transition-colors group-hover:text-green-700">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTabs;