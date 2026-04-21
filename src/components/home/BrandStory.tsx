// src/components/home/BrandStory.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";

export function BrandStory({ settings }: { settings?: any }) {
  // Allow NestJS CMS to inject these, or fall back to premium defaults
  const title = settings?.title || "The AE Naturals Philosophy";
  const description = settings?.description || "We believe in the power of pure, potent, and proven ingredients. Our formulations are meticulously crafted to bridge the gap between ancient botanical wisdom and modern dermatological science.";
  const imageUrl = settings?.imageUrl || "https://images.unsplash.com/photo-1615397323145-81673815db99?q=80&w=1200&auto=format&fit=crop"; // Premium fallback image
  const buttonText = settings?.buttonText || "Discover Our Story";
  const link = settings?.link || "/about";

  return (
    <section className="w-full bg-[#006044] text-white overflow-hidden py-16 md:py-24 my-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          {/* Image Side - Strict aspect ratio for editorial feel */}
          <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/5] overflow-hidden group bg-green-900">
            <Image
              src={imageUrl}
              alt="Brand Philosophy"
              fill
              className="object-cover transition-transform duration-[15s] ease-out group-hover:scale-110 opacity-90 mix-blend-luminosity hover:mix-blend-normal"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
              {title}
            </h2>
            
            {/* Elegant separator line */}
            <div className="w-16 h-1 bg-white mb-8 opacity-80" />
            
            <p className="text-base md:text-lg text-green-50/90 mb-10 leading-relaxed font-medium max-w-xl">
              {description}
            </p>
            
            <div>
              <Link
                href={link}
                className="inline-block border border-white text-white px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#006044] transition-colors duration-300 rounded-none"
              >
                {buttonText}
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}