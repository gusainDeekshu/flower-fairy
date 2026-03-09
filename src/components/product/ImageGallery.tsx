"use client";
import { useState } from 'react';
import { cn } from "@/lib/utils";

export function ImageGallery({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Thumbnails list on the left for Desktop */}
      <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onMouseEnter={() => setActiveImage(img)} // Change on hover for "Instant" feel
            className={cn(
              "w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all",
              activeImage === img ? "border-[#006044] shadow-md" : "border-transparent"
            )}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image on the right */}
      <div className="order-1 md:order-2 flex-1 aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
        <img src={activeImage} className="w-full h-full object-cover animate-in fade-in duration-300" />
      </div>
    </div>
  );
}