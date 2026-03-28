"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeImg, setActiveImg] = useState(
    images?.[0] || "/placeholder.png"
  );

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] no-scrollbar shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onMouseEnter={() => setActiveImg(img)}
              onClick={() => setActiveImg(img)}
              className={`relative w-16 h-16 rounded-md border overflow-hidden shrink-0 transition ${
                activeImg === img
                  ? "border-orange-500"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <Image
                src={img}
                alt={`${name}-${idx}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="relative w-full h-[400px] md:h-[500px] bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={activeImg}
            alt={name}
            fill
            priority
            className="object-contain p-4"
          />
        </div>
      </div>
    </div>
  );
}