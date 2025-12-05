import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [
  {
    image: slide1,

    subtitle: "Discover the new era of luxury fashion.",
  },
  {
    image: slide2,
    title: "Timeless Style",
    subtitle: "Where sophistication meets innovation.",
  },
  {
    image: slide3,
    title: "Redefine Luxury",
    subtitle: "Crafted with passion, worn with pride.",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] md:h-[90vh] overflow-hidden">
      <AnimatePresence>
        <motion.img
          key={slides[current].image}
          src={slides[current].image}
          alt={slides[current].title}
          className="absolute w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
        <motion.h1
          key={slides[current].title}
          className="text-4xl sm:text-5xl md:text-7xl font-serif mb-4 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {slides[current].title}
        </motion.h1>
        <motion.p
          key={slides[current].subtitle}
          className="text-md sm:text-lg md:text-xl mb-6 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {slides[current].subtitle}
        </motion.p>
        <button className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition">
          Explore Collection
        </button>
      </div>
    </section>
  );
}
