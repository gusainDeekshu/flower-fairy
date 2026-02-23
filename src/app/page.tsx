import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  HeroBanner, CategoryRow, OccasionGrid, ProductShowcase, 
  SpecialOffer, InfoCards, EventGiftingGuide, TeddyPromo, 
  Testimonials, BlogSection,  WhatsAppCTA
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* <Header /> */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pb-20">
        <HeroBanner />
        <CategoryRow />
        <OccasionGrid />
        <ProductShowcase title="Best Selling Flowers & Gifts" />
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