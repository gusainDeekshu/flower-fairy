import Image from 'next/image';

interface Block {
  type: 'banner' | 'split';
  imageUrl: string;
  title: string;
  text?: string;
  align?: 'left' | 'right';
}

export default function APlusContent({ blocks }: { blocks: Block[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className="mt-16 space-y-12">
      <h2 className="text-2xl font-bold mb-6 text-center">From the Manufacturer</h2>
      
      {blocks.map((block, idx) => {
        if (block.type === 'banner') {
          return (
            <div key={idx} className="relative w-full h-[400px] rounded-xl overflow-hidden">
              <Image 
                src={block.imageUrl} 
                alt={block.title} 
                fill 
                className="object-cover"
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgo..." 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h3 className="text-white text-4xl font-bold">{block.title}</h3>
              </div>
            </div>
          );
        }

        if (block.type === 'split') {
          return (
            <div key={idx} className={`flex flex-col md:flex-row gap-8 items-center ${block.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2 relative h-[300px]">
                <Image src={block.imageUrl} alt="Feature" fill className="object-cover rounded-lg" />
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">{block.title}</h3>
                <p className="text-gray-600 leading-relaxed">{block.text}</p>
              </div>
            </div>
          );
        }
        return null;
      })}
    </section>
  );
}