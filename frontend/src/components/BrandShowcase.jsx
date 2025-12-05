export default function BrandShowcase() {
  const brands = ["/brand1.png", "/brand2.png", "/brand3.png", "/brand4.png"];

  return (
    <section className="py-20 bg-cream text-center">
      <h2 className="text-3xl mb-8">Our Featured Brands</h2>
      <div className="flex flex-wrap justify-center gap-16">
        {brands.map((b, i) => (
          <img key={i} src={b} alt="Brand" className="h-16 opacity-70 hover:opacity-100 transition" />
        ))}
      </div>
    </section>
  );
}
