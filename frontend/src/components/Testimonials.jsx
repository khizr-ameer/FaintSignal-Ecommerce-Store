export default function Testimonials() {
  const reviews = [
    { name: "Sophia", text: "Absolutely love the fabric quality!" },
    { name: "Liam", text: "Stylish, elegant, and super comfortable!" },
    { name: "Emma", text: "A perfect blend of luxury and design." },
  ];

  return (
    <section className="bg-white py-20 text-center">
      <h2 className="text-3xl sm:text-4xl mb-12">
        What Our Clients Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="p-8 bg-[#faf7f2] rounded-xl shadow hover:shadow-lg transition"
          >
            <p className="text-base md:text-lg italic mb-4">“{r.text}”</p>
            <h4 className="font-semibold">{r.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
