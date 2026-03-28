"use client";

export default function ProductInfoBox({ product }: { product: any }) {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      
      {product.extra?.manufacturer && (
        <p className="text-sm text-blue-600 font-semibold">Brand: {product.extra.manufacturer}</p>
      )}

      <div className="text-2xl font-bold">
        ₹{product.price}
      </div>

      <div className="prose prose-sm text-gray-600 max-w-none mt-4" 
           dangerouslySetInnerHTML={{ __html: product.description || '' }} />

      <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold transition-all w-full md:w-auto mt-6">
        Add to Cart
      </button>
    </div>
  );
}