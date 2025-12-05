export default function SubcategoryMenu({ gender, setCategory }) {
  if (!gender) return null;

  const items = ["Tops", "Bottoms", "Outerwear", "Accessories"];

  return (
    <div className="flex justify-center gap-6 mb-8">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(item.toLowerCase())}
          className="border border-dark px-6 py-2 rounded-full hover:bg-gold hover:text-dark transition"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
