"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductCard } from "@/components/ui/product-card";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/config/brand.config";

export function HeroSection() {
  return (
    <div className="relative h-[250px] w-full bg-primary overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="relative z-20 text-center text-white px-4">
            <h1 className="serif-font text-3xl font-bold mb-2">Fresh Flowers & Gifts</h1>
            <p className="text-sm opacity-90 mb-4">Delivered with love, straight to their door.</p>
            <Button className="bg-white text-primary rounded-full px-6 hover:bg-slate-100 font-bold">Shop Now</Button>
        </div>
    </div>
  );
}

export function QuickCategoriesRow() {
  const cats = ["Flowers", "Cakes", "Combos", "Plants", "Gifts"];
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max gap-4 pb-4">
        {cats.map((c) => (
          <div key={c} className="flex flex-col items-center gap-2 min-w-[70px]">
            <div className="h-16 w-16 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-xs text-primary font-medium">{c[0]}</div>
            <span className="text-[10px] font-semibold text-slate-700">{c}</span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  );
}

export function OccasionGrid() {
  const occasions = [
    { title: "Anniversary", color: "bg-emerald-100" },
    { title: "Birthday", color: "bg-teal-100" },
    { title: "Congratulations", color: "bg-green-100" },
    { title: "Get Well Soon", color: "bg-lime-100" },
  ];
  return (
    <section>
      <h2 className="serif-font mb-4 text-xl font-bold text-primary">Shop by Occasion</h2>
      <div className="grid grid-cols-2 gap-3">
        {occasions.map((occ) => (
          <div key={occ.title} className={`relative flex h-24 items-end overflow-hidden rounded-2xl p-3 shadow-sm ${occ.color}`}>
            <h3 className="relative z-10 w-full text-sm font-bold text-primary">{occ.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BestSellingSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="serif-font text-xl font-bold text-primary">Bestselling Gifts</h2>
        <button className="text-xs font-semibold text-secondary hover:underline">View All</button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max gap-4 pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[150px]">
              <ProductCard name={`Premium Plant ${i}`} price={499} rating={4.8} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  );
}

export function EventGiftingGuide() {
  return (
    <section>
      <h2 className="serif-font mb-4 text-xl font-bold text-primary text-center">Gifting Guide</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-primary p-4 text-white h-32 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <h3 className="relative z-10 font-bold text-sm">Anniversary</h3>
            <Button variant="secondary" className="relative z-10 bg-white text-primary hover:bg-slate-100 text-[10px] px-3 h-6 w-fit rounded-full font-bold">Explore</Button>
            <div className="absolute right-[-20px] bottom-[-20px] h-20 w-20 rounded-full bg-white/10 blur-xl" />
        </div>
        <div className="rounded-2xl bg-secondary p-4 text-white h-32 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <h3 className="relative z-10 font-bold text-sm">Birthdays</h3>
            <Button variant="secondary" className="relative z-10 bg-white text-secondary hover:bg-slate-100 text-[10px] px-3 h-6 w-fit rounded-full font-bold">Explore</Button>
            <div className="absolute right-[-20px] bottom-[-20px] h-20 w-20 rounded-full bg-white/20 blur-xl" />
        </div>
      </div>
    </section>
  );
}

export function WhatsAppCTASection() {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${BRAND.whatsapp}?text=Hi!`, '_blank');
  };
  return (
    <section className="relative overflow-hidden rounded-3xl bg-secondary p-6 text-white shadow-md text-center">
      <div className="mb-3 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary shadow-sm">
        <MessageCircle size={24} fill="currentColor" />
      </div>
      <h3 className="serif-font mb-1 text-lg font-bold">Order on WhatsApp</h3>
      <p className="mb-4 text-xs opacity-90">Chat with gifting experts instantly.</p>
      <Button onClick={handleWhatsAppClick} className="h-10 rounded-full bg-white px-6 font-bold text-primary hover:bg-slate-50 text-sm shadow-sm">
        Chat with us
      </Button>
    </section>
  );
}