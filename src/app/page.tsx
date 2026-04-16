import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";

import HomeRenderer from "@/components/home/HomeRenderer";
import { apiClient } from "@/lib/api-client";

// 🔥 1. Import the new Blog Section
import HomeBlogSection from "@/components/home/HomeBlogSection";

export const revalidate = 600;

export default async function Home() {
  const queryClient = getQueryClient();

  // 1. Multi-Tenant SSR Logic: Extract the domain
  const headersList = await headers();
  const domain =
    headersList.get("x-forwarded-host") ||
    headersList.get("host") ||
    "localhost";

  // 2. Fetch the Aggregated Homepage Data from NestJS
  const homeData = await queryClient.fetchQuery({
    queryKey: ["home-data", domain],
    queryFn: async () => {
      try {
        let backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
        if (backendUrl.startsWith("/")) {
          backendUrl = `http://localhost:4000${backendUrl}`;
        }

        const response = await apiClient.get(`/admin/stores/home`, {
          headers: {
            "x-tenant-domain": domain, 
          },
        });
        return response.data;
      } catch (error) {
        console.error("[SSR] Failed to fetch homepage aggregator data:", error);
        return null;
      }
    },
  });

  // 3. Graceful Fallback if the API is down
  if (!homeData || !homeData.config) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-800">Store Unavailable</h1>
          <p className="mt-2 text-gray-500">We are currently updating our storefront. Please check back later.</p>
        </div>
      </main>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="min-h-screen bg-white pb-10">
        
        {/* Dynamic CMS Sections controlled by Admin */}
        <HomeRenderer 
          config={homeData.config} 
          data={homeData.data} 
        />

        {/* 🔥 2. Add the Blog Section here! 
            By placing it after HomeRenderer, it will always reliably show up 
            near the bottom of the page, acting as a great pre-footer SEO section. 
        */}
        <HomeBlogSection />

      </main>
    </HydrationBoundary>
  );
}