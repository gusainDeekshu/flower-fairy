export default function ProductDescription({ description }: { description: string }) {
  if (!description) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Product description</h2>
      <div className="prose prose-gray max-w-4xl text-gray-700 leading-relaxed">
        <p>{description}</p>
      </div>
    </section>
  );
}