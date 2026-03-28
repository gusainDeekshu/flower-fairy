export default function ProductDetailsTable({ extra }: { extra: any }) {
  if (!extra) return null;

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Product Details</h2>
      <div className="bg-white border rounded-lg overflow-hidden max-w-3xl">
        <table className="w-full text-sm text-left">
          <tbody>
            {extra.manufacturer && (
              <tr className="border-b"><th className="bg-gray-50 p-4 w-1/3">Manufacturer</th><td className="p-4">{extra.manufacturer}</td></tr>
            )}
            {extra.countryOfOrigin && (
              <tr className="border-b"><th className="bg-gray-50 p-4 w-1/3">Country of Origin</th><td className="p-4">{extra.countryOfOrigin}</td></tr>
            )}
            {extra.weight && (
              <tr className="border-b"><th className="bg-gray-50 p-4 w-1/3">Weight</th><td className="p-4">{extra.weight}</td></tr>
            )}
            {extra.dimensions && (
              <tr className="border-b"><th className="bg-gray-50 p-4 w-1/3">Dimensions</th><td className="p-4">{extra.dimensions}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}