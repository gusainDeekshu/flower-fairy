// src\app\blog\[slug]\page.tsx

import { BlogService } from '@/services/blog.service';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronRight, Share2 } from 'lucide-react';

// Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await BlogService.getBlogBySlug(resolvedParams.slug);
  if (!blog) return { title: 'Article Not Found' };
  return {
    title: `${blog.title} | AE Naturals Journal`,
    description: blog.excerpt,
    openGraph: { images: [blog.coverImage] },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await BlogService.getBlogBySlug(resolvedParams.slug);
  
  if (!blog) return notFound();

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center text-sm text-gray-500 gap-2">
          <Link href="/" className="hover:text-[#006044]">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-[#006044]">Journal</Link>
          <ChevronRight size={14} />
          <Link href={`/blog?category=${blog.category?.slug}`} className="hover:text-[#006044] capitalize">
            {blog.category?.name}
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-block bg-green-50 text-[#006044] font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-6">
          {blog.category?.name || 'Journal'}
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-gray-500 font-medium">
          <span className="flex items-center gap-2"><Calendar size={18} /> {date}</span>
          <button className="flex items-center gap-2 hover:text-[#006044] transition-colors">
            <Share2 size={18} /> Share
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-lg">
          <Image 
            src={blog.coverImage || "/images/placeholder.jpg"} 
            alt={blog.title || "Blog cover image"} 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Rich Text Content */}
      {/* Note: The [&>p] classes apply styles to the raw HTML tags inside the content */}
      <article className="max-w-3xl mx-auto px-4">
        <div 
          className="text-lg leading-relaxed text-gray-700 
            [&>p]:mb-6 
            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:font-serif
            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-4
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#006044] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-xl [&>blockquote]:text-gray-600 [&>blockquote]:my-8
            [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full [&>img]:shadow-md
            [&>a]:text-[#006044] [&>a]:underline [&>a]:font-semibold"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-2">
            <span className="text-gray-900 font-semibold mr-2 flex items-center">Tags:</span>
            {blog.tags.map((tag: string, i: number) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

    </main>
  );
}