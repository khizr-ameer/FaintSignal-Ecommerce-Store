import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutDrawer from "../components/CheckoutDrawer";
import { Trash2 } from "lucide-react";
import { fetchCart, addToCart, removeLine, updateLine, clearCart } from "../utils/cartAPI";

export default function Cart() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  // Load cart on mount
  async function loadCart() {
    const cart = await fetchCart();
    setCartItems(cart.items);
    setSubtotal(cart.subtotal);
    setCheckoutUrl(cart.checkoutUrl);
  }

  useEffect(() => {
    loadCart();
  }, []);

  // Remove single item
  const handleRemove = async (lineId) => {
    const cart = await removeLine(lineId);
    if (cart) {
      setCartItems(cart.items);
      setSubtotal(cart.subtotal);
      setCheckoutUrl(cart.checkoutUrl);
    }
  };

  // Update quantity
  const handleUpdateQty = async (lineId, quantity) => {
    if (quantity < 1) return;
    const cart = await updateLine(lineId, quantity);
    if (cart) {
      setCartItems(cart.items);
      setSubtotal(cart.subtotal);
      setCheckoutUrl(cart.checkoutUrl);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    const cart = await clearCart();
    if (cart) {
      setCartItems(cart.items);
      setSubtotal(cart.subtotal);
      setCheckoutUrl(cart.checkoutUrl);
    } else {
      setCartItems([]);
      setSubtotal(0);
      setCheckoutUrl("");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] bg-gray-50 px-4 sm:px-6 py-10 pt-24">
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl sm:text-4xl tracking-widest text-gray-900">
              Your Cart
            </h1>

            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition"
              >
                <Trash2 size={18} />
                <span>Clear Cart</span>
              </button>
            )}
          </div>

          <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-base sm:text-lg">
                <p>Your cart is empty 🛍</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500">Variant: {item.variant}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                              className="px-2 py-1 border rounded"
                            >−</button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQty(item.id, Number(e.target.value))}
                              className="w-12 text-center border rounded py-1"
                            />
                            <button
                              onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                              className="px-2 py-1 border rounded"
                            >+</button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-semibold text-sm sm:text-base">
                          {item.price} {item.currency}
                        </div>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal + Checkout */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mt-6 border-t pt-4">
                  <div className="text-center sm:text-left">
                    <div className="text-gray-600 text-sm sm:text-base">Subtotal</div>
                    <div className="text-xl sm:text-2xl font-bold">
                      {subtotal} {cartItems[0]?.currency || "USD"}
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(checkoutUrl, "_blank")}
                    className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition ${
                      cartItems.length > 0 ? "bg-gray-900 hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!checkoutUrl || cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <CheckoutDrawer open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}