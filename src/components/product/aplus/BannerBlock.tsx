// src\components\product\aplus\BannerBlock.tsx
import { BannerBlockContent } from '@/types/aplus';
import Link from 'next/link';

// Helper function to extract YouTube ID from any YouTube link format
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function BannerBlock({ content }: { content: BannerBlockContent }) {
  // Check if the provided video URL is a YouTube link
  const youtubeId = getYouTubeId(content.videoUrl || '');

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-zinc-100 group aspect-square md:aspect-[21/9]">
      
      {/* 1. BACKGROUND IMAGE (Always render as a fallback/poster) */}
      {content.imageUrl && (
        <img 
          src={content.imageUrl} 
          alt={content.overlayTitle || "Banner"} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      )}

      {/* 2. YOUTUBE VIDEO (If a YouTube link was pasted) */}
      {youtubeId && (
        <iframe
          className="absolute inset-0 w-full h-full z-10"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: 'none' }} // Prevents user from pausing the background video
        />
      )}

      {/* 3. RAW MP4 / CLOUDINARY VIDEO (If an MP4 was uploaded) */}
      {content.videoUrl && !youtubeId && (
        <video 
          src={content.videoUrl} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* 4. OVERLAY TEXT */}
      {(content.overlayTitle || content.ctaText) && (
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-end p-8 md:p-16 text-center pointer-events-none">
          
          {content.overlayTitle && (
            <h3 className="text-white text-3xl md:text-5xl font-black mb-3 drop-shadow-lg tracking-tight">
              {content.overlayTitle}
            </h3>
          )}
          
          {content.overlaySubtitle && (
            <p className="text-zinc-200 text-sm md:text-xl max-w-2xl mb-8 drop-shadow font-medium">
              {content.overlaySubtitle}
            </p>
          )}
          
          {content.ctaText && content.ctaLink && (
            <Link 
              href={content.ctaLink} 
              className="pointer-events-auto bg-[#006044] text-white px-8 py-3.5 rounded-full font-black text-sm hover:bg-[#004d36] transition-all shadow-xl hover:-translate-y-1"
            >
              {content.ctaText}
            </Link>
          )}
          
        </div>
      )}
    </div>
  );
}