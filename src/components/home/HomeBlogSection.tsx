// src\components\home\HomeBlogSection.tsx

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogService } from '@/services/blog.service';
import { ArrowRight } from 'lucide-react';

export  function HomeBlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch blogs and take only the latest 3 for the homepage
        const response = await BlogService.getBlogs();
        setBlogs(response.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch blogs for homepage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // If loading or no blogs, return null so the layout doesn't break
  if (isLoading || blogs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 tracking-tight">
            Journal
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => {
            const dateObj = new Date(blog.createdAt);
            const day = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
            const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

            return (
              <Link 
                href={`/blog/${blog.slug}`} 
                key={blog.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Image & Date Badge */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Floating Date Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm shadow-md rounded-lg px-3 py-1.5 flex flex-col items-center justify-center z-10 border border-gray-50">
                    <span className="text-lg font-black text-gray-900 leading-none">{day}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{month}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] font-bold text-[#006044] uppercase tracking-widest mb-3">
                    {blog.category?.name || 'Journal'}
                  </span>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#006044] transition-colors line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>
                  
                  {/* "Read More" Bottom action */}
                  <div className="mt-auto flex items-center text-sm font-bold text-gray-800 group-hover:text-[#006044] transition-colors">
                    Read More 
                    <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/blog"
            className="px-8 py-3.5 bg-[#006044] text-white text-sm font-bold tracking-wide uppercase rounded-full hover:bg-[#004d36] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            View All Posts
          </Link>
        </div>

      </div>
    </section>
  );
}