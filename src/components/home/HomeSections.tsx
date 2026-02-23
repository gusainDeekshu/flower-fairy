"use client";

import React from "react";
import { Star, Heart, MessageCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BRAND } from "@/config/brand.config";

/**
 * 3️⃣ HERO BANNER SECTION
 * Large rounded banner matching the reference layout.
 */
export function HeroBanner() {
  return (
    <section className="w-full pt-4">
      <div className="relative h-[200px] md:h-[400px] w-full rounded-2xl md:rounded-[32px] overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80" 
          alt="Luxury Flower Arrangements" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </section>
  );
}

/**
 * 4️⃣ CATEGORY QUICK ICONS ROW
 * Horizontal scrollable cards with circular/square images and labels.
 */
export function CategoryRow() {
  const categories = [
    { name: "Roses", icon: "🌹" },
    { name: "Cakes", icon: "🎂" },
    { name: "Combos", icon: "🎁" },
    { name: "Chocolates", icon: "🍫" },
    { name: "Plants", icon: "🪴" },
    { name: "Gifts", icon: "🧸" },
  ];

  return (
    <section className="py-8">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-6 pb-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className="h-20 w-20 md:h-28 md:w-28 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{cat.name}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </section>
  );
}

/**
 * 5️⃣ SHOP BY OCCASIONS & RELATIONS
 * Grid of 4 cards with bottom-left text overlays.
 */
export function OccasionGrid() {
  const items = ["Anniversary", "Birthday", "Romance", "Congratulation"];
  return (
    <section className="py-6">
      <h2 className="text-xl font-black text-slate-800 mb-6 text-center">Shop By Occasion</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm">
            <img src={`https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=60&w=400`} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-white font-bold text-sm">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 6️⃣ BEST SELLING FLOWERS & GIFTS
 * Product grid with Sale badges and Wishlist icons.
 */
export function ProductShowcase({ title }: { title: string }) {
  const products = [1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-slate-800">{title}</h2>
        <Button variant="outline" className="rounded-full border-[#006044] text-[#006044] font-bold text-xs h-8">View All</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <div key={p} className="group relative flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <Badge className="absolute top-3 left-0 rounded-l-none bg-[#006044] px-3 py-1 text-[10px] font-bold z-10">SALE</Badge>
            <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-slate-400 hover:text-red-500 z-10 shadow-sm"><Heart size={16} /></button>
            <div className="aspect-[4/5] bg-slate-50 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1522673607200-1648832cee77?auto=format&fit=crop&q=60&w=400" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Product" />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-xs font-bold text-slate-800 truncate">Premium Roses Bouquet</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base font-black text-[#006044]">₹499</span>
                <span className="text-[10px] text-slate-400 line-through font-bold">₹699</span>
              </div>
              <Button className="w-full mt-3 bg-[#006044] hover:bg-[#004d3d] text-white rounded-lg text-xs font-bold h-9">ADD TO CART</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 7️⃣ VALENTINE'S SPECIAL OFFER BANNER
 */
export function SpecialOffer() {
  return (
    <section className="py-8">
      <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl md:rounded-[32px] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-red-200">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-2">Valentine's Special</h2>
          <p className="text-sm md:text-lg font-medium opacity-90">Get Flat 20% OFF on all Luxury Bunches</p>
        </div>
        <Button className="bg-white text-red-500 rounded-full px-10 py-6 font-black text-base hover:bg-slate-50">SHOP NOW</Button>
      </div>
    </section>
  );
}

/**
 * 8️⃣ SMALL INFO CARDS SECTION
 */
export function InfoCards() {
  const cards = [
    { title: "Same Day Delivery", sub: "Order by 6 PM" },
    { title: "Personalized Gifts", sub: "Add a custom note" },
    { title: "Freshness Assured", sub: "7 days freshness" },
    { title: "Secure Checkout", sub: "100% Safe Payment" },
  ];
  return (
    <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
          <h4 className="text-xs font-bold text-slate-800 mb-1">{c.title}</h4>
          <p className="text-[10px] text-slate-500 font-medium">{c.sub}</p>
        </div>
      ))}
    </section>
  );
}

/**
 * 9️⃣ EVENT-BASED GIFTING GUIDE
 */
export function EventGiftingGuide() {
  const events = [
    { title: "Anniversary Gifts", color: "bg-red-500" },
    { title: "Birthday Specials", color: "bg-purple-500" },
    { title: "Valentine's Day", color: "bg-pink-500" },
    { title: "Wedding Gifts", color: "bg-orange-500" },
  ];
  return (
    <section className="py-8">
      <h2 className="text-xl font-black text-slate-800 mb-6 text-center">Gifting Guide</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((e) => (
          <div key={e.title} className="flex h-40 rounded-3xl overflow-hidden shadow-sm">
            <div className={`${e.color} flex-1 p-6 flex flex-col justify-center text-white`}>
              <h3 className="text-lg font-black mb-2 leading-tight">{e.title}</h3>
              <button className="flex items-center text-[10px] font-bold uppercase tracking-widest hover:translate-x-1 transition-transform">Shop Now <ChevronRight size={14} /></button>
            </div>
            <div className="flex-1 bg-slate-100">
               <img src="https://images.unsplash.com/photo-1525268771113-32d9e9021a97?auto=format&fit=crop&q=60&w=400" className="h-full w-full object-cover" alt={e.title} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 🔟 CUDDLY RED TEDDY BEAR PROMO
 */
export function TeddyPromo() {
  return (
    <section className="py-8">
      <div className="grid md:grid-cols-2 rounded-[32px] overflow-hidden bg-[#fff0f3] min-h-[400px] border border-pink-100 shadow-sm">
        <div className="p-12 flex flex-col justify-center items-start">
          <h2 className="text-4xl md:text-6xl font-black text-[#d63384] italic mb-4 leading-none">Cuddly Red <br/> Teddy Bear</h2>
          <p className="text-slate-600 font-medium mb-8 max-w-xs">The perfect companion to pair with your fresh flower bouquet.</p>
          <Button className="bg-[#d63384] hover:bg-[#b82a6f] text-white rounded-full px-10 py-6 font-bold uppercase text-sm">Shop Now</Button>
        </div>
        <div className="relative h-64 md:h-auto">
          <img src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&q=80" className="h-full w-full object-cover" alt="Teddy Bear" />
        </div>
      </div>
    </section>
  );
}

/**
 * 1️⃣1️⃣ CUSTOMER TESTIMONIALS
 */
export function Testimonials() {
  return (
    <section className="py-12 bg-slate-50 -mx-4 px-4 md:-mx-12 md:px-12 rounded-[32px] mt-8">
      <h2 className="text-xl font-black text-slate-800 text-center mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((t) => (
          <div key={t} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed mb-6 font-medium">"Beautiful flowers, arrived exactly on time for our anniversary. Highly recommended!"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200" />
              <span className="text-xs font-bold text-slate-800 tracking-tight">Anjali Singh</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 1️⃣2️⃣ FEATURED BLOG SECTION
 */
export function BlogSection() {
  return (
    <section className="py-12">
      <h2 className="text-xl font-black text-slate-800 mb-8 text-center uppercase tracking-tight">From Our Blog</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((b) => (
          <div key={b} className="group cursor-pointer">
            <div className="aspect-video rounded-2xl overflow-hidden mb-4 shadow-sm">
              <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=60&w=600" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Blog" />
            </div>
            <h3 className="font-black text-slate-800 text-sm mb-2 group-hover:text-[#006044] transition-colors">How to make your flowers last longer</h3>
            <p className="text-[10px] text-slate-500 font-medium line-clamp-2">Learn the best industry tips to keep your floral arrangements fresh for over a week...</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 1️⃣3️⃣ WHATSAPP CTA SECTION
 */
export function WhatsAppCTA() {
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${BRAND.whatsapp}?text=Hi! I would like to order flowers.`, '_blank');
  };
  return (
    <section className="py-12">
      <div className="bg-[#25D366] rounded-[32px] p-10 text-center text-white shadow-xl shadow-green-100">
        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#25D366] shadow-lg">
          <MessageCircle size={32} fill="currentColor" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black mb-2">Quick & Easy Ordering on WhatsApp</h2>
        <p className="text-sm font-medium opacity-90 mb-8">Skip the checkout process and chat with our gifting experts directly.</p>
        <Button onClick={handleWhatsAppClick} className="bg-white text-[#25D366] hover:bg-slate-50 px-10 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-lg">
          Message Us Now
        </Button>
      </div>
    </section>
  );
}