import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flower Fairy | Premium Gifts",
  description: "Fresh flowers and cakes delivered same day.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          {/* Use max-w-7xl to look great on Laptop screens */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
            {children}
          </main>
          <Footer />
          {/* Mobile only navigation */}
         
        </div>
      </body>
    </html>
  );
}