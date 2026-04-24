// src/app/blog/[slug]/page.tsx

import { BlogService } from '@/services/blog.service';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ChevronRight, Share2 } from 'lucide-react';

// ---------------- SEO ----------------
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const blog = await BlogService.getBlogBySlug(resolvedParams.slug);

  if (!blog) return { title: 'Article Not Found' };

  return {
    title: `${blog.title} | AE Naturals Journal`,
    description: blog.excerpt,
    openGraph: { images: [blog.coverImage] },
  };
}

// ---------------- PAGE ----------------
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const blog = await BlogService.getBlogBySlug(resolvedParams.slug);

  if (!blog) return notFound();

  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <main className="min-h-screen bg-background pb-20">

      {/* ---------------- BREADCRUMB ---------------- */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-4 flex items-center text-sm text-muted-foreground gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Journal
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/blog?category=${blog.category?.slug}`}
            className="hover:text-primary transition-colors capitalize"
          >
            {blog.category?.name}
          </Link>
        </div>
      </div>

      {/* ---------------- HEADER ---------------- */}
      <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-12 pb-8 text-center">
        
        {/* Category Badge */}
        <div className="inline-block bg-accent text-accent-foreground font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-6">
          {blog.category?.name || 'Journal'}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 serif-font leading-tight">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar size={16} /> {date}
          </span>

          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Share2 size={16} /> Share
          </button>
        </div>
      </header>

      {/* ---------------- HERO IMAGE ---------------- */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 mb-12">
        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden">
          <Image
            src={blog.coverImage || "/images/placeholder.jpg"}
            alt={blog.title || "Blog cover image"}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* ---------------- CONTENT ---------------- */}
      <article className="max-w-3xl mx-auto px-6 sm:px-8">
        <div
          className="
            text-base sm:text-lg leading-relaxed text-muted-foreground

            [&>p]:mb-6

            [&>h2]:text-2xl sm:[&>h2]:text-3xl
            [&>h2]:font-semibold
            [&>h2]:text-foreground
            [&>h2]:mt-12 [&>h2]:mb-6
            [&>h2]:serif-font

            [&>h3]:text-xl sm:[&>h3]:text-2xl
            [&>h3]:font-semibold
            [&>h3]:text-foreground
            [&>h3]:mt-8 [&>h3]:mb-4

            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:mb-2

            [&>blockquote]:border-l-4
            [&>blockquote]:border-primary
            [&>blockquote]:pl-4
            [&>blockquote]:italic
            [&>blockquote]:text-lg
            [&>blockquote]:text-muted-foreground
            [&>blockquote]:my-8

            [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full

            [&>a]:text-primary [&>a]:underline [&>a]:font-medium
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* ---------------- TAGS ---------------- */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-2 items-center">
            <span className="text-foreground font-semibold mr-2">
              Tags:
            </span>

            {blog.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

    </main>
  );
}