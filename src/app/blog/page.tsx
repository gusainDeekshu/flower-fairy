// src/app/blog/page.tsx

import { BlogService } from '@/services/blog.service';
import BlogCard from '@/components/blog/BlogCard';
import Link from 'next/link';

export const metadata = {
  title: 'Journal & Guides | AE Naturals',
  description: 'Discover skincare tips, wellness routines, and the science behind our ingredients.',
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || 'all';

  // Fetch data in parallel for speed
  const [categories, blogs, featuredBlogs] = await Promise.all([
    BlogService.getCategories(),
    BlogService.getBlogs({ category: activeCategory }),
    BlogService.getBlogs({ isFeatured: true }),
  ]);

  // Use the first featured blog for the hero section (if viewing 'all' category)
  const heroBlog = activeCategory === 'all' && featuredBlogs.length > 0 ? featuredBlogs[0] : null;
  
  // Remove hero blog from main list to avoid duplication
  const displayBlogs = heroBlog 
    ? blogs.filter((b: any) => b.id !== heroBlog.id) 
    : blogs;

  return (
    <main className="min-h-screen bg-[#faf9f6]"> {/* Soft off-white background */}
      
      {/* Header Section */}
      <section className="bg-[#006044] text-white py-16 md:py-24 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">The Journal</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto">
          Discover your true beauty. Expert tips, wellness routines, and the science behind nature's best ingredients.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link 
            href="/blog"
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === 'all' 
                ? 'bg-[#006044] text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Articles
          </Link>
          {categories.map((cat: any) => (
            <Link 
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.slug 
                  ? 'bg-[#006044] text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Hero / Featured Article */}
        {heroBlog && (
          <div className="mb-16">
            <BlogCard blog={heroBlog} isFeatured={true} />
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayBlogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {displayBlogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No articles found in this category.</p>
            <Link href="/blog" className="text-[#006044] font-semibold mt-4 inline-block hover:underline">
              Clear filters
            </Link>
          </div>
        )}

        {/* Load More Button (Static UI for now, can wire up pagination later) */}
        {displayBlogs.length > 8 && (
          <div className="flex justify-center mb-24">
            <button className="px-8 py-3 border-2 border-[#006044] text-[#006044] font-bold rounded-full hover:bg-[#006044] hover:text-white transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss a Glow Up</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Subscribe to our newsletter for exclusive skincare tips, early access to sales, and new product launches.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-grow px-5 py-3 rounded-full text-gray-900 outline-none focus:ring-2 focus:ring-[#006044]"
            />
            <button 
              type="submit" 
              className="px-8 py-3 bg-[#006044] text-white font-bold rounded-full hover:bg-[#004d36] transition-colors whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}