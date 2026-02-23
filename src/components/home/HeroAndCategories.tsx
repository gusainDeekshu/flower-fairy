// src/components/home/HeroAndCategories.tsx
export function HeroBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg relative bg-gray-200">
        <img 
          src="/hero-banner.jpg" 
          className="w-full h-full object-cover" 
          alt="Flower Banner" 
        />
      </div>

      {/* 4️⃣ Category Quick Icons Row */}
      <div className="flex overflow-x-auto gap-6 py-10 no-scrollbar justify-between">
        {['Roses', 'Cakes', 'Combos', 'Chocolates', 'Plants', 'Gifts'].map((cat) => (
          <div key={cat} className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer">
            <div className="w-24 h-24 rounded-lg shadow-sm border overflow-hidden transition-transform group-hover:scale-105">
              <img src={`/cat-${cat.toLowerCase()}.jpg`} className="w-full h-full object-cover" alt={cat} />
            </div>
            <span className="text-xs font-bold text-gray-700 uppercase">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}