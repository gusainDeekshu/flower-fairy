// src\components\product\aplus\GridBlock.tsx
import Image from 'next/image';
import { ImageGridBlockContent } from '@/types/aplus';

export default function GridBlock({ content }: { content: ImageGridBlockContent }) {
  return (
    <div className="space-y-8">
      {content.title && (
        <h3 className="text-3xl font-bold text-center text-gray-900">{content.title}</h3>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {content.images.map((img, idx) => (
          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src={img}
              alt={`Grid image ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}