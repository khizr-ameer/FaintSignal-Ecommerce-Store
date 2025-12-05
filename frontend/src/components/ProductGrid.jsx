const demoProducts = [
  { id: 1, title: "Classic White Shirt", price: 120, image: "/hero1.jpg" },
  { id: 2, title: "Wool Jacket", price: 450, image: "/hero2.jpg" },
  { id: 3, title: "Silk Scarf", price: 80, image: "/hero3.jpg" },
];

export default function ProductGrid({ gender, category }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
      {demoProducts.map((p) => (
        <div
          key={p.id}
          className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          <img src={p.image} alt={p.title} className="h-80 w-full object-cover" />
          <div className="p-4 text-center">
            <h3 className="text-xl font-serif">{p.title}</h3>
            <p className="text-gray-500">${p.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
