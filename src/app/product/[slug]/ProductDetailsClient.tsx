// src/app/product/[slug]/ProductDetailsClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductApi } from '@/services/product.service';
import { 
  Heart, Share2, Star, Truck, ShieldCheck, Leaf, 
  Minus, Plus, MessageCircle, Clock, Info 
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
// --- TYPES ---

export default function ProductDetailsClient({ slug }: { slug: string }) {
  // --- MAIN PRODUCT DATA ---
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const data = await ProductApi.getProductBySlug(slug);
      if (!data) throw new Error("Product not found");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // --- SIMILAR PRODUCTS ---
  const { data: similarProducts = [] } = useQuery({
    queryKey: ['products', 'similar', product?.categoryId],
    queryFn: async () => {
      const data = await ProductApi.getSimilarProducts(product!.categoryId);
      return data ?? []; // FIX: Ensure we never return undefined
    },
    enabled: !!product?.categoryId,
  });

  // --- UI STATE ---
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Sync state when product data arrives
  useEffect(() => {
    if (product) {
      setMainImage(product.images?.[0] || null);
      setSelectedVariantId(product.variants?.[0]?.id || "");
    }
  }, [product]);

  if (isLoading) return <ProductSkeleton />;
  if (isError || !product) return <ErrorState />;

  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);
  const discount = product.oldPrice ? Math.round(((product.oldPrice - currentPrice) / product.oldPrice) * 100) : 0;

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* --- LEFT SIDE: GALLERY --- */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[40px] shadow-2xl border border-zinc-100 bg-zinc-50">
              {/* FIX: Avoid empty string in src */}
              <img 
                src={mainImage || product.images?.[0] || "/placeholder.png"} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${mainImage === img ? 'border-[#006044] ring-4 ring-green-50' : 'border-transparent opacity-70'}`}
                >
                  <img src={img || "/placeholder.png"} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all"><Heart size={16}/> Wishlist</button>
              <button className="flex items-center gap-2 px-8 py-3 rounded-full border border-zinc-200 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all"><Share2 size={16}/> Share</button>
            </div>
          </div>

          {/* --- RIGHT SIDE: INFO --- */}
          <div className="flex flex-col">
            <h1 className="text-5xl font-black text-zinc-900 mb-2 tracking-tight uppercase">{product.name}</h1>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < Math.floor(product.rating || 4) ? "currentColor" : "none"} />)}
              </div>
              <span className="text-sm text-zinc-400 font-black tracking-widest uppercase">{product.rating} ({product.reviews || 0} REVIEWS)</span>
            </div>

            <div className="flex items-baseline gap-6 mb-10">
              <span className="text-6xl font-black text-zinc-900">₹{currentPrice}</span>
              {product.oldPrice && <span className="text-2xl text-zinc-300 line-through font-bold">₹{product.oldPrice}</span>}
              {discount > 0 && <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{discount}% OFF</span>}
            </div>

            {/* VARIANT SELECTION */}
            <div className="mb-10">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Select Option</label>
              <div className="grid grid-cols-4 gap-3">
                {product.variants?.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`py-4 rounded-2xl font-black text-sm transition-all border-2 ${selectedVariantId === v.id ? 'bg-[#006044] border-[#006044] text-white shadow-xl shadow-green-100' : 'border-zinc-100 text-zinc-500 hover:border-zinc-300'}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mb-12">
              <div className="flex items-center bg-zinc-50 rounded-3xl p-1 border border-zinc-100">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-zinc-400 hover:text-zinc-900"><Minus size={20}/></button>
                <span className="w-10 text-center font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-zinc-400 hover:text-zinc-900"><Plus size={20}/></button>
              </div>
              <button className="flex-1 bg-[#006044] text-white rounded-3xl font-black text-lg shadow-2xl shadow-green-100 hover:bg-[#004d36] transition-all">ADD TO CART</button>
              <button className="flex-1 bg-rose-500 text-white rounded-3xl font-black text-lg shadow-2xl shadow-rose-100 hover:bg-rose-600 transition-all uppercase tracking-tighter">Buy Now</button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 border-t border-b py-10 mb-12">
              <div className="flex flex-col items-center gap-3 text-center">
                <Truck className="text-[#006044]" size={32} />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <Leaf className="text-[#006044]" size={32} />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Fresh Products</span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <ShieldCheck className="text-[#006044]" size={32} />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">100% Safe</span>
              </div>
            </div>

            {/* PRODUCT SPECIFICATIONS */}
            <div className="space-y-6 mb-12">
              {product.attributes?.map((attr: any) => (
                <div key={attr.id} className="flex justify-between items-center text-sm border-b border-zinc-50 pb-4">
                  <span className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">{attr.name}</span>
                  <span className="text-zinc-900 font-black uppercase tracking-tighter">{attr.value}</span>
                </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-12">
              <h3 className="font-black text-2xl mb-4 tracking-tighter uppercase text-zinc-800">Description</h3>
              <p className="text-zinc-500 leading-relaxed font-medium text-lg">{product.description}</p>
            </div>

            {/* INGREDIENTS & CARE */}
            <div className="grid grid-cols-2 gap-12 mb-12 pt-8 border-t">
              <div>
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-6">Ingredients</h4>
                <p className="text-zinc-800 font-black text-sm leading-relaxed">{product.ingredients || "Handpicked seasonal blooms"}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em] mb-6">Care Instructions</h4>
                <ul className="space-y-3">
                  {product.careInstructions?.map((line: string, i: number) => (
                    <li key={i} className="text-zinc-800 font-black text-xs leading-tight flex gap-2">
                      <span className="text-zinc-300">•</span> {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* DELIVERY INFO */}
            <div className="bg-zinc-50 p-10 rounded-[40px] border border-zinc-100 mb-12">
              <h4 className="flex items-center gap-3 font-black text-zinc-900 mb-6 uppercase tracking-tight">
                <Clock size={24} className="text-[#006044]"/> Delivery Info
              </h4>
              <ul className="space-y-4">
                {product.deliveryInfo?.map((info: string, i: number) => (
                  <li key={i} className="text-zinc-500 font-bold text-sm flex gap-3 italic">
                    <span className="text-zinc-300">•</span> {info}
                  </li>
                ))}
              </ul>
            </div>

            {/* HELP CARD */}
            <div className="bg-[#006044] p-12 rounded-[50px] text-white flex flex-col items-center text-center shadow-3xl shadow-green-100">
              <h3 className="text-4xl font-black mb-4 tracking-tight uppercase">Need Help?</h3>
              <p className="text-green-100 opacity-80 mb-10 font-bold max-w-xs">Chat with our experts on WhatsApp for custom orders</p>
              <button className="bg-white text-[#006044] px-14 py-5 rounded-full font-black flex items-center gap-4 hover:scale-105 transition-all shadow-2xl uppercase text-sm tracking-widest">
                <MessageCircle size={24} fill="#006044" /> Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS SECTION --- */}
        <div className="mt-32 pt-24 border-t border-zinc-100">
          <h2 className="text-5xl font-black mb-16 text-zinc-900 uppercase tracking-tighter">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {similarProducts.length > 0 ? similarProducts.slice(0, 4).map((sim: any) => (
              <div key={sim.id} className="group cursor-pointer">
                <div className="aspect-square rounded-[40px] overflow-hidden bg-zinc-50 mb-6 border border-zinc-50">
                  <img src={sim.images?.[0] || sim.image || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={sim.name} />
                </div>
                <h3 className="font-black text-zinc-900 mb-2 uppercase text-xs tracking-widest">{sim.name}</h3>
                <div className="flex items-center gap-4">
                  <span className="font-black text-2xl text-[#006044]">₹{sim.price}</span>
                  {sim.oldPrice && <span className="text-sm text-zinc-300 line-through font-bold">₹{sim.oldPrice}</span>}
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-zinc-400 font-bold italic">No similar products currently available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="bg-red-50 p-8 rounded-full mb-4"><ShieldCheck size={48} className="text-red-400" /></div>
      <h2 className="text-2xl font-black uppercase italic tracking-tighter">Product Unavailable</h2>
      <p className="text-gray-400 font-bold">This flower might be out of season!</p>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <Skeleton className="aspect-square rounded-[40px] bg-zinc-100" />
        <div className="space-y-8">
          <Skeleton className="h-16 w-3/4 bg-zinc-100 rounded-2xl" />
          <Skeleton className="h-20 w-1/3 bg-zinc-100 rounded-2xl" />
          <Skeleton className="h-40 w-full bg-zinc-100 rounded-[32px]" />
          <Skeleton className="h-20 w-full bg-zinc-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}