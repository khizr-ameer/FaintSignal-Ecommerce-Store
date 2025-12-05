import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, ArrowLeft, Menu } from "lucide-react";
import logo from "../assets/logo.jpg";
import { fetchCart } from "../utils/cartAPI"; // ← added to get cart count

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null);

  // ---------------------------
  // Cart Count (Badge)
  // ---------------------------
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadCartCount() {
      const cart = await fetchCart();
      const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);
    }
    loadCartCount();
  }, []);
  // ---------------------------

  const categories = {
    men: ["Tops", "Bottoms", "Outerwear", "Accessories"],
    women: ["Tops", "Bottoms", "Outerwear", "Accessories"],
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* NAVBAR MAIN ROW */}
      <div className="flex justify-between items-center px-6 py-6 w-full">
        {/* LEFT (Desktop): Contact Us */}
        <div className="hidden md:flex items-center gap-1 text-gray-800 hover:opacity-70 transition">
          <Plus size={18} />
          <Link to="/contact" className="font-medium">
            Contact Us
          </Link>
        </div>

        {/* CENTER: Logo */}
        <Link to="/" className="mx-auto">
          <img src={logo} alt="Faint Store Logo" className="h-12 sm:h-16" />
        </Link>

        {/* RIGHT SIDE: Cart + Menu */}
        <div className="flex items-center gap-7">

          {/* ------------------------------
              Cart Icon with Badge
          ------------------------------ */}
          <Link to="/cart" className="relative hover:opacity-70 transition">
            <ShoppingBag size={24} />

            {cartCount > 0 && (
              <span className="
                absolute -top-2 -right-2 
                bg-black text-white 
                text-xs w-5 h-5 
                flex items-center justify-center 
                rounded-full
              ">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Menu Button */}
          <button
            onClick={() => {
              setMenuOpen(true);
              setSubmenu(null);
            }}
            className="flex items-center gap-2 text-gray-800 hover:opacity-70 transition"
          >
            <Menu size={24} />
            <span className="hidden md:inline text-lg font-medium">Menu</span>
          </button>
        </div>
      </div>

      {/* SIDE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Desktop Drawer */}
            <motion.div
              className="hidden md:flex fixed right-0 top-0 h-full w-1/2 sm:w-1/3 bg-white backdrop-blur-xl shadow-2xl z-50 p-8 flex flex-col items-center border-l border-gray-200"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
            >
              {/* Logo inside drawer */}
              <Link to="/" onClick={() => setMenuOpen(false)} className="mb-8">
                <div className="bg-white/70 p-2 rounded">
                  <img src={logo} alt="Faint Store Logo" className="h-12 w-auto" />
                </div>
              </Link>

              {/* BACK (Submenu) */}
              {submenu && (
                <button
                  onClick={() => setSubmenu(null)}
                  className="absolute top-6 left-6 flex items-center gap-1 text-gray-700 hover:text-black transition"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}

              {/* CLOSE */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSubmenu(null);
                }}
                className="absolute top-6 right-6 text-gray-700 hover:text-black text-lg"
              >
                ✕
              </button>

              {/* MAIN MENU */}
              {!submenu && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center space-y-8 text-2xl font-serif text-gray-800 mt-16"
                >
                  <button onClick={() => setSubmenu("men")} className="hover:opacity-60">
                    Men
                  </button>
                  <button onClick={() => setSubmenu("women")} className="hover:opacity-60">
                    Women
                  </button>
                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="hover:opacity-60"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="hover:opacity-60"
                  >
                    Contact
                  </Link>
                </motion.div>
              )}

              {/* SUBMENU */}
              {submenu && (
                <motion.div
                  key={submenu}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="flex flex-col items-center space-y-6 text-xl font-serif text-gray-800 mt-16"
                >
                  <h2 className="text-3xl mb-4 capitalize">{submenu}</h2>
                  {categories[submenu].map((cat) => (
                    <Link
                      key={cat}
                      to={`/${submenu}/${cat.toLowerCase()}`}
                      className="hover:opacity-60"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Mobile Drawer */}
            <motion.div
              className="md:hidden fixed bottom-0 left-0 w-full h-[95%] bg-white backdrop-blur-xl shadow-2xl z-50 p-6 rounded-t-3xl flex flex-col items-center"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            >
              {/* Logo inside mobile drawer */}
              <Link to="/" onClick={() => setMenuOpen(false)} className="mb-6">
                <div className="bg-white p-2 rounded">
                  <img src={logo} alt="Faint Store Logo" className="h-12 w-auto" />
                </div>
              </Link>

              {/* BACK */}
              {submenu && (
                <button
                  onClick={() => setSubmenu(null)}
                  className="absolute top-6 left-6 flex items-center gap-1 text-gray-700 hover:text-black transition"
                >
                  <ArrowLeft size={18} /> Back
                </button>
              )}

              {/* CLOSE */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSubmenu(null);
                }}
                className="absolute top-6 right-6 text-gray-700 hover:text-black text-lg"
              >
                ✕
              </button>

              {/* MAIN MENU */}
              {!submenu && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center space-y-6 text-2xl font-serif text-gray-800 mt-4"
                >
                  <button onClick={() => setSubmenu("men")} className="hover:opacity-60">
                    Men
                  </button>
                  <button onClick={() => setSubmenu("women")} className="hover:opacity-60">
                    Women
                  </button>
                  <Link
                    to="/about"
                    onClick={() => setMenuOpen(false)}
                    className="hover:opacity-60"
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="hover:opacity-60"
                  >
                    Contact
                  </Link>
                </motion.div>
              )}

              {/* SUBMENU */}
              {submenu && (
                <motion.div
                  key={submenu}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="flex flex-col items-center space-y-6 text-xl font-serif text-gray-800 mt-16"
                >
                  <h2 className="text-3xl mb-4 capitalize">{submenu}</h2>
                  {categories[submenu].map((cat) => (
                    <Link
                      key={cat}
                      to={`/${submenu}/${cat.toLowerCase()}`}
                      className="hover:opacity-60"
                      onClick={() => setMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
