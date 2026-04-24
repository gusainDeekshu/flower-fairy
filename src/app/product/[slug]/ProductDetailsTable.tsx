// src/app/product/[slug]/ProductDetailsTable.tsx
import React from 'react';
import { Store, Tag, Star, Activity } from 'lucide-react';

interface ProductDetailsProps {
  productData: any; // The data you provided
  extra: any; // product.extra
}

export default function ProductDetailsTable({ productData, extra }: ProductDetailsProps) {
  return (
    <section className="w-full mt-10">
      <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight mb-6">
        Product Specifications
      </h2>

      <div className="border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <tbody className="divide-y divide-zinc-200">
            {/* --- TOP METADATA SECTION --- */}
            <tr className="bg-zinc-50/50">
              <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest w-1/3 flex items-center gap-2">
                <Store size={14} className="text-[#217A6E]" /> Brand / Store
              </th>
              <td className="px-6 py-4 font-bold text-zinc-900">
                {productData.store?.name || "Flower Fairy Store"}
              </td>
            </tr>
            <tr>
              <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest w-1/3 flex items-center gap-2">
                <Tag size={14} className="text-[#217A6E]" /> Category
              </th>
              <td className="px-6 py-4 font-bold text-zinc-900">
                {productData.category?.name || "Cakes"}
              </td>
            </tr>
            <tr className="bg-zinc-50/50">
              <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest w-1/3 flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Customer Rating
              </th>
              <td className="px-6 py-4 font-bold text-zinc-900">
                {productData.rating || "4.5"} / 5.0
              </td>
            </tr>

            {/* --- TECHNICAL DETAILS (from extra) --- */}
            {extra?.manufacturer && (
              <tr>
                <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest">Manufacturer</th>
                <td className="px-6 py-4 text-zinc-600">{extra.manufacturer}</td>
              </tr>
            )}
            {extra?.countryOfOrigin && (
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest">Country of Origin</th>
                <td className="px-6 py-4 text-zinc-600">{extra.countryOfOrigin}</td>
              </tr>
            )}
            {extra?.genericName && (
              <tr>
                <th className="px-6 py-4 font-black text-zinc-500 uppercase text-[10px] tracking-widest">Generic Name</th>
                <td className="px-6 py-4 text-zinc-600">{extra.genericName}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}