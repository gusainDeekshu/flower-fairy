import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { BRAND } from "@/config/brand.config";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import MegaMenu from "@/components/layout/MegaMenu";
// Observability Imports
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 🔥 NEW: Import the Search Modal
import SearchModal from "@/components/layout/SearchModal"; 
import { CartDrawer } from "./cart/CartDrawer";
import { Google_Sans_Flex } from "next/font/google";



const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans",
});

export const metadata: Metadata = {
 title: "AE Naturals | Nature’s Finest Products",
description: "Premium natural products crafted for wellness, skincare, haircare, and everyday healthy living.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body

      className={googleSans.variable}
        style={{
          ["--primary" as string]: BRAND.theme.primary,
          ["--secondary" as string]: BRAND.theme.secondary,
          ["--accent" as string]: BRAND.theme.accent,
        }}
      >
        <div className="flex flex-col min-h-screen">
          <QueryProvider>
            <AuthProvider>
              {/* 🔥 NEW: Mount the modal globally within the providers */}
              <SearchModal />
              <CartDrawer /> {/* 2. DROP THIS HERE */}
              
              <Header megaMenu={<MegaMenu />} />
              
              <main className="flex-1 flex flex-col w-full">
                <Toaster position="top-center" richColors />
                {children}
              </main>

              <Footer />
            </AuthProvider>
          </QueryProvider>
        </div>
        {/* Vercel Observability */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}