import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import images
import men1 from "../assets/men1.jpg";
// import men2 from "../assets/men2.jpg";
// import men3 from "../assets/men3.jpg";
import women1 from "../assets/women1.jpg";
// import women2 from "../assets/women2.jpg";
// import women3 from "../assets/women3.jpg";

const CategorySection = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      title: "Men", 
      link: "/men",
      images: [men1]
    },
    { 
      title: "Women", 
      link: "/women",
      images: [women1]
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <motion.div
            key={cat.title}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(cat.link)}
            className="relative cursor-pointer rounded-3xl overflow-hidden shadow-xl h-80 md:h-96 group"
          >
            {/* Background images stacked */}
            {cat.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${cat.title} ${idx + 1}`}
                className={`absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  idx === 0 ? "" : "opacity-80 transform scale-95"
                }`}
                style={{ zIndex: idx }}
              />
            ))}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white text-3xl md:text-5xl font-bold tracking-wide">
                {cat.title}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
