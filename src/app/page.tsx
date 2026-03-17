
//src/app/page.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  HeroBanner, CategoryRow, OccasionGrid,  
  SpecialOffer, InfoCards, EventGiftingGuide, TeddyPromo, 
  Testimonials, BlogSection,  WhatsAppCTA
} from "@/components/home/HomeSections";
import { ProductShowcase } from "@/components/home/ProductShowcase";



export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* <Header /> */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-20">
        <HeroBanner />
        <CategoryRow />
        <OccasionGrid />
{/* Dynamic Sections using the shared logic */}
      <ProductShowcase title="Best Selling Flowers" />
      <ProductShowcase title="Fresh Birthday Cakes" category="cakes" />
        <SpecialOffer />
        <InfoCards />
        <EventGiftingGuide />
        <TeddyPromo />
        <Testimonials />
        <BlogSection />
        <WhatsAppCTA />
      </div>
      {/* <Footer /> */}
    </main>
  );
}