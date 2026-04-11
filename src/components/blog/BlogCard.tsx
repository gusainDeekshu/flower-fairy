// src\components\blog\BlogCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';

interface BlogCardProps {
  blog: any;
  isFeatured?: boolean;
}

export default function BlogCard({ blog, isFeatured = false }: BlogCardProps) {
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (isFeatured) {
    return (
      <Link href={`/blog/${blog.slug}`} className="group block relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto md:h-full w-full overflow-hidden">
            <Image 
              src={blog.coverImage} 
              alt={blog.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#006044] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              {blog.category?.name || 'Journal'}
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
              <Calendar size={16} /> {date}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#006044] transition-colors leading-tight">
              {blog.title}
            </h2>
            <p className="text-gray-600 text-lg mb-6 line-clamp-3">
              {blog.excerpt}
            </p>
            <span className="inline-block text-[#006044] font-semibold tracking-wide border-b-2 border-transparent group-hover:border-[#006044] transition-all w-max pb-1">
              Read Full Article →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Standard Grid Card
  return (
    <Link href={`/blog/${blog.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image 
          src={blog.coverImage} 
          alt={blog.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#006044] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {blog.category?.name || 'Journal'}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-3 gap-1.5 font-medium">
          <Calendar size={14} /> {date}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#006044] transition-colors line-clamp-2 leading-snug">
          {blog.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {blog.excerpt}
        </p>
        <span className="text-sm font-semibold text-[#006044] mt-auto">
          Read Article →
        </span>
      </div>
    </Link>
  );
}