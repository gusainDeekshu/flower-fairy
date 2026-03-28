import { ProductExtra } from '@/types/product';

export default function ImportantInfo({ extra }: { extra: ProductExtra }) {
  const hasContent = extra.safetyInfo || extra.ingredients || extra.directions;
  
  if (!hasContent) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Important information</h2>
      <div className="text-sm text-gray-700 space-y-6">
        {extra.safetyInfo && (
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Safety Information</h4>
            <p className="leading-relaxed">{extra.safetyInfo}</p>
          </div>
        )}
        {extra.ingredients && (
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Ingredients</h4>
            <p className="leading-relaxed">{extra.ingredients}</p>
          </div>
        )}
        {extra.directions && (
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Directions</h4>
            <p className="leading-relaxed">{extra.directions}</p>
          </div>
        )}
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Legal Disclaimer</h4>
          <p className="leading-relaxed text-gray-500">
            Actual product packaging and materials may contain more and different information than what is shown on our app or website. We recommend that you do not rely solely on the information presented here and that you always read labels, warnings, and directions before using or consuming a product.
          </p>
        </div>
      </div>
    </section>
  );
}