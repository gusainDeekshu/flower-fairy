// src\components\product\aplus\SplitBlock.tsx
import Image from 'next/image';
import { SplitBlockContent } from '@/types/aplus';

export default function SplitBlock({ content }: { content: SplitBlockContent }) {
  const { leftImageUrl, rightTitle, rightDescription, reverse } = content;

  return (
    <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}>
      <div className="w-full md:w-1/2 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
        <Image
          src={leftImageUrl}
          alt={rightTitle || "Feature"}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-6 px-4 md:px-0">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {rightTitle}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
          {rightDescription}
        </p>
      </div>
    </div>
  );
}