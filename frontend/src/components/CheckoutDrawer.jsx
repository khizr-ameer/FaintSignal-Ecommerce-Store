import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CheckoutDrawer({ open, onClose }) {
  // 🧠 Function to show temporary alert
  const handleConfirm = () => {
    alert("🚧 Checkout not ready yet — coming soon!");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dim background */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 💻 Desktop: Slide in from right */}
          <motion.div
            className="hidden md:flex fixed right-0 top-0 h-full w-[90%] bg-[#607d8b] z-50 shadow-2xl p-8 flex-col rounded-l-3xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <X size={28} />
            </button>

            <h2 className="text-4xl font-serif mb-6 text-white">Checkout</h2>
            <div className="flex-1 overflow-y-auto text-white">
              <p>Your checkout summary will appear here.</p>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
            >
              Confirm Order
            </button>
          </motion.div>

          {/* 📱 Mobile: Slide up from bottom */}
          <motion.div
            className="md:hidden fixed bottom-0 left-0 w-full h-[95%] bg-[#607d8b] z-50 shadow-2xl p-6 rounded-t-3xl flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-serif text-white">Checkout</h2>
              <button onClick={onClose} className="text-gray-600 hover:text-black">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto text-white">
              <p>Your checkout summary will appear here.</p>
            </div>

            <button
              onClick={handleConfirm}
              className="mt-6 w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition text-lg font-medium"
            >
              Confirm Order
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
