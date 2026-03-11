import { Star, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ProductCard({ product }: any) {
  return (

    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 relative">
      <Link href={`/product/${product.slug}`} prefetch={true}>
      <div className="absolute top-3 left-0 bg-[#006044] text-white text-[10px] font-bold px-3 py-1 rounded-r-full z-10">SALE</div>
      <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full shadow-sm hover:text-red-500 z-10 transition-colors">
        <Heart size={16} />
      </button>

      <div className="aspect-[4/5] overflow-hidden">
        <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
          <span className="text-[10px] text-gray-400 font-bold ml-1">(120)</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-black text-[#006044]">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.price + 200}</span>
        </div>
        <button className="w-full bg-[#006044] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#004d3d] transition-colors">
          Add to Cart
        </button>
      </div>
      </Link>
    </div>
  );
}