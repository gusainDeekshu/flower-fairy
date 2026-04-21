// src/app/[slug]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Metadata } from "next";

// 1. Define Types
interface PageSection {
  id: string;
  title: string;
  contentHtml: string;
}

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  introText: string | null;
  sections: PageSection[];
  updatedAt: string;
}

// Next.js 15+ requires params to be typed as a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. Fetch data dynamically
async function getPageData(slug: string): Promise<CustomPage | null> {
  try {
    const response = await apiClient.get(`/pages/${slug}`);
    return response.data || response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; 
    }
    console.error(`Failed to fetch page /${slug}:`, error.message);
    return null;
  }
}

// 3. Dynamic Metadata for SEO 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 🔥 FIX: Await the params Promise before accessing slug
  const { slug } = await params;
  const pageData = await getPageData(slug);
  
  if (!pageData) {
    return { title: "Page Not Found | AE Naturals" };
  }

  return {
    title: `${pageData.title} | AE Naturals`,
    description: pageData.introText || `Read the ${pageData.title} for AE Naturals.`,
  };
}

// 4. The Universal Page Component
export default async function DynamicCustomPage({ params }: Props) {
  // 🔥 FIX: Await the params Promise before accessing slug
  const { slug } = await params;
  const pageData = await getPageData(slug);

  if (!pageData || !pageData.sections) {
    notFound();
  }

  const formattedDate = new Date(pageData.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          {pageData.title}
        </h1>
        {pageData.introText && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {pageData.introText}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-4">
          Last Updated: <span className="font-semibold">{formattedDate}</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {pageData.sections.length > 0 && (
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {pageData.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-[#009688]/10 hover:text-[#009688] transition-colors"
                    >
                      <span className="truncate">{section.title}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          <main className="flex-1 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#009688] hover:prose-a:text-[#007A6E]">
              
              {pageData.sections.length === 0 ? (
                <p className="text-gray-500 italic text-center py-10">This page currently has no content.</p>
              ) : (
                pageData.sections.map((section) => (
                  <section key={section.id} id={section.id} className="mb-12 scroll-mt-24">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      {section.title}
                    </h2>
                    <div 
                      className="text-gray-600 space-y-4"
                      dangerouslySetInnerHTML={{ __html: section.contentHtml }} 
                    />
                  </section>
                ))
              )}
              
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}