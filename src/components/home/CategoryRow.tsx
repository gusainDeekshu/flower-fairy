export default function CategoryRow() {
  const categories = [
    { name: 'Roses', img: '/cats/roses.jpg' },
    { name: 'Cakes', img: '/cats/cakes.jpg' },
    { name: 'Combos', img: '/cats/combos.jpg' },
    { name: 'Chocolates', img: '/cats/chocolates.jpg' },
    { name: 'Plants', img: '/cats/plants.jpg' },
    { name: 'Gifts', img: '/cats/gifts.jpg' },
  ];

  return (
    <section className="py-10">
      <div className="flex overflow-x-auto gap-4 md:gap-0 md:justify-between no-scrollbar pb-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}