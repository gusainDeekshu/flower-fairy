export default function TeddyPromo() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden min-h-[400px]">
        <div className="bg-[#ffebf0] p-10 md:p-20 flex flex-col justify-center items-start">
          <h2 className="text-4xl md:text-5xl font-black text-[#d63384] mb-4 leading-tight italic">Cuddly Red <br/> Teddy Bear</h2>
          <p className="text-gray-600 mb-8 max-w-md font-medium">Express your love with the softest huggable companion. Perfect for anniversaries and birthdays.</p>
          <button className="bg-[#d63384] text-white px-10 py-4 rounded-full font-bold uppercase text-sm hover:scale-105 transition-transform shadow-lg">Shop Now</button>
        </div>
        <div className="h-[300px] md:h-auto">
          <img src="/promo/teddy.jpg" className="w-full h-full object-cover" alt="Teddy Promo" />
        </div>
      </div>
    </section>
  );
}