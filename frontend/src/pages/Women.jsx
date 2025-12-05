import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const womenCategories = [
  { name: "Tops", image: "https://source.unsplash.com/600x600/?womentop" },
  { name: "Bottoms", image: "https://source.unsplash.com/600x600/?womenpants" },
  { name: "Outerwear", image: "https://source.unsplash.com/600x600/?womenjacket" },
  { name: "Accessories", image: "https://source.unsplash.com/600x600/?womenaccessories" },
];

export default function Women() {
  // ✅ Ensure page starts from top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* ✅ Navbar on top */}
      <Navbar />

      {/* ✅ Page content */}
      <motion.div
        className="min-h-screen bg-white pt-24 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl text-center font-serif mb-12">
          Women’s Collection
        </h1>

        {/* ✅ Grid layout: 2 per row on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {womenCategories.map((cat, i) => (
            <Link to={`/women/${cat.name.toLowerCase()}`} key={i}>
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-lg group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-56 sm:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h2 className="text-white text-2xl font-medium">
                    {cat.name}
                  </h2>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ✅ Footer at bottom */}
      <Footer />
    </>
  );
}
