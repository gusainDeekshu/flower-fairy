import { 
  HeroSection, QuickCategoriesRow, OccasionGrid, 
  BestSellingSection, EventGiftingGuide, WhatsAppCTASection 
} from "@/components/home/HomeSections";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="space-y-8 px-5 pt-6">
        <QuickCategoriesRow />
        <OccasionGrid />
        <BestSellingSection />
        <EventGiftingGuide />
        <WhatsAppCTASection />
      </div>
    </main>
  );
}