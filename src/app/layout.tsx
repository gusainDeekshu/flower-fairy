//src/app/layout.tsx
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { BRAND } from "@/config/brand.config";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import MegaMenu from "@/components/layout/MegaMenu";

export const metadata: Metadata = {
  title: "AE Naturals | Premium Gifts",
  description: "Fresh flowers and cakes delivered same day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="antialiased"
        style={{
          ["--primary" as string]: BRAND.theme.primary,
          ["--secondary" as string]: BRAND.theme.secondary,
          ["--accent" as string]: BRAND.theme.accent,
        }}
      >
        <div className="flex flex-col min-h-screen">
          <QueryProvider>
            <AuthProvider>
              <Header />
              <MegaMenu />
              {/* 🔥 FIX: Removed max-w-7xl and px-4 from here. 
                  Let the pages (children) handle their own width and padding! */}
              <main className="flex-1 flex flex-col w-full">
                <Toaster position="top-center" richColors />
                {children}
              </main>

              <Footer />
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
