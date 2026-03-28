
export default function ProductDetails({ product }: { product: any }) {
  // 🔥 FIX: Safely extract the category string
  const categoryName = product.category?.name || product.category;

  const detailsList = [
    { label: 'Manufacturer', value: product.extra?.manufacturer },
    { label: 'Country of Origin', value: product.extra?.countryOfOrigin },
    { label: 'Item Weight', value: product.attributes?.weight },
    // 🔥 FIX: Use the extracted string instead of the raw object
    { label: 'Category', value: categoryName }, 
  ].filter(item => item.value); 

  Object.entries(product.attributes || {}).forEach(([key, value]) => {
    if (key.toLowerCase() !== 'weight') { 
      const safeValue = typeof value === 'object' && value !== null 
          ? (value as any).name || JSON.stringify(value) 
          : String(value);
      detailsList.push({ label: key, value: safeValue });
    }
  });

  if (detailsList.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-zinc-900">Product details</h2>
      <div className="max-w-2xl border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <tbody>
            {detailsList.map((detail, idx) => (
              <tr key={idx} className="border-b border-zinc-200 last:border-0">
                <th className="w-1/3 bg-zinc-50 px-4 py-3 font-medium text-zinc-900 border-r border-zinc-200">
                  {detail.label}
                </th>
                <td className="px-4 py-3 text-zinc-700 bg-white">
                  {detail.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}