"use client";
import React, { useState } from 'react';
import { 
  Heart, Share2, Star, Truck, ShieldCheck, Leaf, 
  Minus, Plus, MessageCircle, Clock 
} from 'lucide-react';

const ProductDetailsPage = () => {
  // --- STATE FOR INTERACTIVE ELEMENTS ---
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1000");
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState("1kg");

  const thumbnails = [
    "https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1000",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=1000",
  ];

  const weights = ["500g", "1kg", "1.5kg", "2kg"];

  return (
    <div className="bg-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* --- LEFT SIDE: PRODUCT IMAGES --- */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-xl border border-gray-100">
              <img 
                src={mainImage} 
                alt="Product" 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            <div className="flex gap-4">
              {thumbnails.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${mainImage === img ? 'border-[#006044] ring-2 ring-green-100' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>

            <div className="flex gap-4 pt-2">
              <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm">
                <Heart size={18} className="text-gray-400" /> WISHLIST
              </button>
              <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold text-sm">
                <Share2 size={18} className="text-gray-400" /> SHARE
              </button>
            </div>
          </div>

          {/* --- RIGHT SIDE: PRODUCT INFORMATION --- */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase">RED ROSES BOUQUET</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">4.9 (567 reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl font-black text-gray-900">₹699</span>
              <span className="text-xl text-gray-400 line-through font-medium">₹899</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase">22% OFF</span>
            </div>

            {/* Selection Options */}
            <div className="mb-8">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Select Weight</label>
              <div className="flex flex-wrap gap-3">
                {weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-8 py-3 rounded-2xl font-black text-sm transition-all border-2 ${selectedWeight === w ? 'bg-[#006044] border-[#006044] text-white shadow-lg' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mb-8 flex items-center gap-6">
               <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-500"><Minus size={18}/></button>
                 <span className="w-12 text-center font-black text-lg">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-500"><Plus size={18}/></button>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="flex-1 bg-[#006044] text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#004d36] transition-all tracking-tight">
                ADD TO CART
              </button>
              <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-rose-100 hover:opacity-95 transition-all tracking-tight">
                BUY NOW
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-b py-8 mb-10">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="text-[#006044]" size={28} />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Leaf className="text-[#006044]" size={28} />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fresh Products</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="text-[#006044]" size={28} />
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">100% Safe</span>
              </div>
            </div>

            {/* --- PRODUCT DETAILS & SPECS --- */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-400 font-bold text-sm uppercase">Weight</span><span className="font-black text-gray-800">12 stems</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-400 font-bold text-sm uppercase">Serves</span><span className="font-black text-gray-800">Perfect for any occasion</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-400 font-bold text-sm uppercase">Delivery</span><span className="font-black text-gray-800">2-4 hours delivery</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-3"><span className="text-gray-400 font-bold text-sm uppercase">Category</span><span className="font-black text-gray-800">Flowers</span></div>
              </div>

              <div>
                <h3 className="font-black text-xl mb-4 uppercase tracking-tighter text-[#006044]">Description</h3>
                <p className="text-gray-600 leading-relaxed font-medium">Express your love with this stunning bouquet of fresh red roses. Each stem is carefully selected and arranged to create a timeless gift that speaks volumes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-black text-sm mb-4 uppercase tracking-widest text-gray-400">Ingredients</h3>
                  <p className="text-gray-700 font-bold">Fresh red roses, Greenery, Premium wrapping</p>
                </div>
                <div>
                  <h3 className="font-black text-sm mb-4 uppercase tracking-widest text-gray-400">Care Instructions</h3>
                  <ul className="text-gray-700 font-bold space-y-1 text-sm">
                    <li>• Store in refrigerator below 5°C</li>
                    <li>• Consume within 24 hours</li>
                    <li>• Keep away from direct sunlight</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                <h3 className="font-black text-lg mb-4 uppercase tracking-tight flex items-center gap-3">
                  <Clock size={20} className="text-[#006044]"/> Delivery Info
                </h3>
                <ul className="text-gray-500 space-y-2 text-sm font-bold">
                  <li>• Same day delivery available for orders before 2 PM</li>
                  <li>• Midnight delivery available in select cities</li>
                  <li>• Free delivery on orders above ₹999</li>
                </ul>
              </div>

              {/* HELP CARD */}
              <div className="bg-[#006044] p-10 rounded-[50px] text-white flex flex-col items-center text-center shadow-2xl shadow-green-100">
                <h3 className="text-3xl font-black mb-2 tracking-tight">Need Help?</h3>
                <p className="text-green-100 opacity-80 mb-8 font-bold">Chat with our flower experts on WhatsApp</p>
                <button className="bg-white text-[#006044] px-12 py-4 rounded-full font-black flex items-center gap-3 hover:bg-green-50 transition-all shadow-xl uppercase text-sm tracking-widest">
                  <MessageCircle size={20} fill="#006044" /> CHAT NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS --- */}
        <div className="mt-24">
          <h2 className="text-4xl font-black mb-12 text-gray-900 uppercase tracking-tighter">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 p-5 cursor-pointer">
                <div className="aspect-square rounded-[24px] overflow-hidden bg-gray-50 mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1000" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" 
                    alt="Product"
                  />
                </div>
                <h3 className="font-black text-gray-800 mb-2 uppercase text-sm tracking-tight">Red Roses Bouquet</h3>
                <div className="flex items-center gap-3">
                  <span className="font-black text-xl text-[#006044]">₹699</span>
                  <span className="text-sm text-gray-300 line-through font-bold">₹899</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;