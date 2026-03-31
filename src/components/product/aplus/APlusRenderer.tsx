// src\components\product\aplus\APlusRenderer.tsx
import { APlusBlockType, APlusContentResponse } from '@/types/aplus';
import BannerBlock from './BannerBlock';
import SplitBlock from './SplitBlock';
import GridBlock from './GridBlock';
import TextBlock from './TextBlock';

export default function APlusRenderer({ blocks }: { blocks: APlusContentResponse[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 md:space-y-20 py-12">
      {blocks.map((block, index) => {
        const blockKey = block.id || `aplus-block-${index}`;
        switch (block.type) {
          case APlusBlockType.BANNER:
            return <BannerBlock key={blockKey} content={block.content as any} />;
          case APlusBlockType.SPLIT:
            return <SplitBlock key={blockKey} content={block.content as any} />;
          case APlusBlockType.IMAGE_GRID:
            return <GridBlock key={blockKey} content={block.content as any} />;
          case APlusBlockType.TEXT:
            return <TextBlock key={blockKey} content={block.content as any} />;
          default:
            return null;
        }
      })}
    </div>
  );
}