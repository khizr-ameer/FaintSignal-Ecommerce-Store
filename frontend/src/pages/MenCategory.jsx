import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function MenCategory() {
  const { category } = useParams();

  return (
    <motion.div
      className="min-h-screen bg-[#faf7f2] pt-24 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-5xl font-serif text-center mb-8 capitalize">
        Men’s {category}
      </h1>
      <p className="text-center mb-6 text-gray-600">
        Discover our latest {category} styles, made for comfort and class.
      </p>

      <div className="text-center">
        <Link
          to={`/men/${category}/products`}
          className="inline-block bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition"
        >
          View All Products
        </Link>
      </div>
    </motion.div>
  );
}
