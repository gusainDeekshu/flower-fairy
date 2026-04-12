import Image from 'next/image';
import { APlusBlock } from '@/types/product';

export default function APlusContent({ blocks }: { blocks: APlusBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="space-y-12">
      {blocks.map((block, index) => {
        if (block.type === 'banner') {
          return (
            <div key={index} className="relative w-full rounded-xl overflow-hidden bg-gray-100">
              <div className="relative w-full aspect-[21/9]">
                <Image
                  src={block.imageUrl || "/placeholder-image.jpg"}
                  alt={block.title || "Product banner"}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              {block.title && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
                  <h3 className="text-white text-2xl md:text-4xl font-bold max-w-2xl drop-shadow-lg">
                    {block.title}
                  </h3>
                </div>
              )}
            </div>
          );
        }

        if (block.type === 'split') {
          const isRight = block.align === 'right';
          return (
            <div key={index} className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-12 items-center`}>
              <div className="w-full md:w-1/2 relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                <Image
                  src={block.imageUrl || "/placeholder-image.jpg"}
                  alt={block.title || "Product feature"}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                {block.title && <h3 className="text-2xl font-bold text-gray-900">{block.title}</h3>}
                {block.text && <p className="text-gray-600 leading-relaxed text-lg">{block.text}</p>}
              </div>
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}