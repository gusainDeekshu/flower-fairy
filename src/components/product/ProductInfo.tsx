"use client";

import { useState } from 'react';
import { ShoppingCart, Zap, Info, ShieldCheck } from 'lucide-react';

export default function ProductInfo({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  
  // Dynamic discount calculation
  const discount = product.oldPrice > product.price 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Dynamic Star Rating Generator (e.g., 4.5 stars)
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex text-[#FFA41C] text-lg leading-none">
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        {hasHalfStar && <span>⯪</span>} {/* Half star character */}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300">★</span>)}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Title & Rating */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center space-x-2 mt-2">
          {renderStars(product.rating)}
          <span className="text-sm text-blue-600 hover:underline cursor-pointer font-medium">
            {product.rating || 0} ({product.reviewCount || 0} ratings)
          </span>
        </div>
      </div>

      {/* Price Block */}
      <div className="flex flex-col border-y border-gray-100 py-4">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-gray-900">
            ₹{product.price?.toLocaleString('en-IN') || 0}
          </span>
          {discount > 0 && (
            <>
              <span className="text-lg text-gray-500 line-through">
                ₹{product.oldPrice?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Available Options:</h3>
          <div className="flex flex-wrap gap-3">
            {product.variants.map((v: any) => (
              <button 
                key={v.id} 
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:border-orange-500 hover:bg-orange-50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Info Badges (from careInstructions or deliveryInfo) */}
      {(product.deliveryInfo?.length > 0 || product.careInstructions?.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
          {product.deliveryInfo?.map((info: string, idx: number) => (
            <div key={`del-${idx}`} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gray-50 rounded-full text-blue-600"><ShieldCheck size={20} /></div>
              <span className="text-xs text-gray-600 font-medium">{info}</span>
            </div>
          ))}
          {product.careInstructions?.map((info: string, idx: number) => (
            <div key={`care-${idx}`} className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-gray-50 rounded-full text-green-600"><Info size={20} /></div>
              <span className="text-xs text-gray-600 font-medium">{info}</span>
            </div>
          ))}
        </div>
      )}

      {/* Buy Actions */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="qty" className="text-sm font-medium text-gray-700">Quantity:</label>
          <select 
            id="qty" 
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 text-sm py-1.5 pl-3 pr-8 bg-white border"
          >
            {/* Dynamic quantity based on your needs, assuming up to 5 for now */}
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex flex-col space-y-3">
          <button className="w-full flex justify-center items-center space-x-2 bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-medium py-3 px-6 rounded-full shadow-sm transition-colors">
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
          <button className="w-full flex justify-center items-center space-x-2 bg-[#FFA41C] hover:bg-[#FA8900] text-gray-900 font-medium py-3 px-6 rounded-full shadow-sm transition-colors">
            <Zap size={18} fill="currentColor" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}