import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";
import { BRAND } from "@/config/brand.config";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import MegaMenu from "@/components/layout/MegaMenu";

// 🔥 NEW: Import the Search Modal
import SearchModal from "@/components/layout/SearchModal"; 

export const metadata: Metadata = {
  title: "Flower Fairy | Premium Gifts",
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
              {/* 🔥 NEW: Mount the modal globally within the providers */}
              <SearchModal />
              
              <Header megaMenu={<MegaMenu />} />
              
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