import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { shopifyGraphQL } from "../shopify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getStoredCartId = () => localStorage.getItem("cartId");
const setStoredCartId = (id) => localStorage.setItem("cartId", id);

// -----------------------------
// Shopify Cart API helpers
// -----------------------------
const getCart = async () => {
  let cartId = getStoredCartId();
  if (!cartId) {
    // Create new cart
    const res = await shopifyGraphQL(`
      mutation { cartCreate { cart { id lines(first:10){edges{node{id}}} checkoutUrl} } }
    `);
    cartId = res.cartCreate.cart.id;
    setStoredCartId(cartId);
    return res.cartCreate.cart;
  } else {
    // Fetch existing cart
    const res = await shopifyGraphQL(
      `
      query getCart($cartId: ID!) {
        cart(id:$cartId) { id lines(first:50){edges{node{id quantity merchandise{...on ProductVariant{id title priceV2{amount currencyCode}}}}}} checkoutUrl }
      }
    `,
      { cartId }
    );
    return res.cart;
  }
};

const addToCartAPI = async (variantId, quantity = 1) => {
  try {
    const cart = await getCart();
    const res = await shopifyGraphQL(
      `
      mutation cartLinesAdd($cartId:ID!, $lines:[CartLineInput!]!){
        cartLinesAdd(cartId:$cartId, lines:$lines){ cart { id checkoutUrl lines(first:50){edges{node{id quantity merchandise{...on ProductVariant{id title priceV2{amount currencyCode}}}}}} } }
      }
    `,
      { cartId: cart.id, lines: [{ merchandiseId: variantId, quantity }] }
    );
    return res.cartLinesAdd.cart;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateCartLineAPI = async (lineId, quantity) => {
  try {
    const cartId = getStoredCartId();
    if (!cartId) return;
    await shopifyGraphQL(
      `
      mutation cartLinesUpdate($cartId:ID!, $lines:[CartLineUpdateInput!]!){
        cartLinesUpdate(cartId:$cartId, lines:$lines){ cart { id lines(first:50){edges{node{id quantity}}} } }
      }
    `,
      { cartId, lines: [{ id: lineId, quantity }] }
    );
  } catch (err) {
    console.error(err);
  }
};

const removeCartLineAPI = async (lineId) => {
  try {
    const cartId = getStoredCartId();
    if (!cartId) return;
    await shopifyGraphQL(
      `
      mutation cartLinesRemove($cartId:ID!, $lines:[CartLineInput!]!){
        cartLinesRemove(cartId:$cartId, lines:$lines){ cart { id lines(first:50){edges{node{id}}} } }
      }
    `,
      { cartId, lines: [{ id: lineId }] }
    );
  } catch (err) {
    console.error(err);
  }
};

const clearCartAPI = async () => {
  try {
    const cart = await getCart();
    const lineIds = cart.lines.edges.map((e) => ({ id: e.node.id }));
    if (lineIds.length > 0) {
      const cartId = getStoredCartId();
      await shopifyGraphQL(
        `
        mutation cartLinesRemove($cartId:ID!, $lines:[CartLineInput!]!){
          cartLinesRemove(cartId:$cartId, lines:$lines){ cart { id lines(first:50){edges{node{id}}} } }
        }
      `,
        { cartId, lines: lineIds }
      );
    }
  } catch (err) {
    console.error(err);
  }
};

export default function Product() {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [openSection, setOpenSection] = useState("");
  const [addingCart, setAddingCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = `
          query ProductByHandle($handle: String!) {
            productByHandle(handle: $handle) {
              id title description handle
              images(first: 12) { edges { node { url altText } } }
              variants(first: 20) {
                edges { node { id title availableForSale sku priceV2 { amount currencyCode } image { url altText } } }
              }
            }
          }
        `;
        const data = await shopifyGraphQL(query, { handle });
        const prod = data.productByHandle;
        setProduct(prod);
        setSelectedVariant(prod?.variants?.edges?.[0]?.node || null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [handle]);

  const images = product?.images?.edges || [];
  const totalImages = images.length || 1;
  const displayImg = images[activeImage]?.node?.url || "/placeholder.jpg";
  const displayAlt = images[activeImage]?.node?.altText || product?.title;
  const price =
    selectedVariant?.priceV2?.amount ||
    product?.variants?.edges?.[0]?.node?.priceV2?.amount ||
    "";
  const currency =
    selectedVariant?.priceV2?.currencyCode ||
    product?.variants?.edges?.[0]?.node?.priceV2?.currencyCode ||
    "";

  const nextImage = () => setActiveImage((s) => (s + 1) % totalImages);
  const prevImage = () =>
    setActiveImage((s) => (s - 1 + totalImages) % totalImages);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product]);

  const addToCart = async (checkout = false) => {
    if (!selectedVariant) return;
    setAdding(true);
    setError(null);

    try {
      const cart = await addToCartAPI(selectedVariant.id, qty);
      if (checkout && cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
      } else {
        alert("Added to cart!");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loading)
    return <div className="min-h-screen pt-24 text-center">Loading... :) </div>;
  if (error)
    return (
      <div className="min-h-screen pt-24 text-red-600 text-center">{error}</div>
    );
  if (!product)
    return (
      <div className="min-h-screen pt-24 text-center">Product not found</div>
    );

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 px-4 sm:px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Image Carousel */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden bg-white shadow-lg">
              <img
                src={displayImg}
                alt={displayAlt}
                className="w-full h-[560px] object-cover"
              />
            </div>
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white px-3 py-2 rounded-full shadow"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative rounded-lg overflow-hidden border ${
                        i === activeImage
                          ? "border-gray-900"
                          : "border-transparent"
                      }`}
                      aria-label={`Show image ${i + 1}`}
                    >
                      <img
                        src={img.node.url}
                        alt={img.node.altText || `${product.title} ${i + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="pt-2">
            <h1 className="text-4xl tracking-wide text-gray-900">
              {product.title}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <div className="text-2xl font-semibold">
                {price} {currency}
              </div>
              <div
                className={`text-sm px-2 py-1 rounded ${
                  selectedVariant?.availableForSale
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedVariant?.availableForSale ? "In stock" : "Sold out"}
              </div>
            </div>

            {/* Variants */}
            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Choose size
              </div>
              <div className="flex flex-wrap gap-3">
                {product.variants.edges.map(({ node: v }) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.availableForSale}
                      className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                        isSelected
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900 hover:shadow-sm"
                      } ${
                        !v.availableForSale
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {v.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + CTA */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2"
                >
                  −
                </button>
                <input
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-16 text-center border-l border-r px-2 py-2"
                  type="number"
                  min="1"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2"
                >
                  +
                </button>
              </div>
              <div className="flex-1 flex gap-3">
                {/* ADD TO CART */}
                <button
                  onClick={async () => {
                    setAddingCart(true);
                    await addToCart(false);
                    setAddingCart(false);
                  }}
                  disabled={
                    addingCart ||
                    buyingNow ||
                    !selectedVariant?.availableForSale
                  }
                  className=" px-6 py-3 bg-gray-900 text-white rounded-lg 
               hover:bg-gray-800 transition text-center whitespace-nowrap 
               disabled:opacity-60"
                >
                  {addingCart ? "Adding..." : "Add to Cart"}
                </button>

                {/* BUY NOW */}
                <button
                  onClick={async () => {
                    setBuyingNow(true);
                    await addToCart(true);
                    setBuyingNow(false);
                  }}
                  disabled={
                    buyingNow ||
                    addingCart ||
                    !selectedVariant?.availableForSale
                  }
                  className="px-6 py-3 bg-white border border-gray-900 text-gray-900 rounded-lg 
               hover:bg-gray-100 transition text-center 
               disabled:opacity-60"
                >
                  {buyingNow ? "Processing..." : "Buy Now"}
                </button>
              </div>
            </div>

            {/* Collapsibles */}
            <div className="mt-8 space-y-3">
              {[
                {
                  title: "Description",
                  key: "description",
                  content: (
                    <div
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ),
                },
                { title: "Size Guide", key: "size", content: <SizeGuide /> },
                {
                  title: "Fabric & Care",
                  key: "fabric",
                  content: (
                    <p>
                      High-performance fabric, breathable and durable. Machine
                      wash cold, tumble low.
                    </p>
                  ),
                },
                {
                  title: "Shipping & Returns",
                  key: "shipping",
                  content: (
                    <p>
                      Free shipping over $99. Returns accepted within 30 days in
                      original condition.
                    </p>
                  ),
                },
              ].map((s) => (
                <Collapsible
                  key={s.key}
                  title={s.title}
                  isOpen={openSection === s.key}
                  onToggle={() =>
                    setOpenSection(openSection === s.key ? "" : s.key)
                  }
                >
                  <div
                    className={
                      s.key === "fabric" || s.key === "shipping"
                        ? "text-gray-700"
                        : ""
                    }
                  >
                    {s.content}
                  </div>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-4 left-0 right-0 md:hidden z-50 flex justify-center px-4">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-medium">{product.title}</div>
            <div className="text-sm text-gray-700">
              {price} {currency}
            </div>
          </div>
          <button
            onClick={() => addToCart(true)}
            disabled={adding || !selectedVariant?.availableForSale}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg"
          >
            Buy Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* Small components */
const Collapsible = ({ title, children, isOpen, onToggle }) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center px-4 py-3 bg-white"
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-gray-500">{isOpen ? "▾" : "▸"}</div>
    </button>
    {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
  </div>
);

const SizeGuide = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
    <div>
      <h4 className="font-medium mb-2">Men's Sizing (inches)</h4>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Size</th>
            <th>Chest</th>
            <th>Waist</th>
          </tr>
        </thead>
        <tbody>
          {[
            "XS|34–36|28–30",
            "S|36–38|30–32",
            "M|38–40|32–34",
            "L|40–42|34–36",
            "XL|42–44|36–38",
          ].map((r) => {
            const [size, ch, wa] = r.split("|");
            return (
              <tr key={size}>
                <td>{size}</td>
                <td>{ch}</td>
                <td>{wa}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <div>
      <h4 className="font-medium mb-2">Fit Advice</h4>
      <p className="text-sm">
        If you prefer a relaxed fit, size up one. If in-between sizes, choose
        based on chest measurement.
      </p>
      <div className="mt-3">
        <a href="#size-help" className="text-sm text-gray-900 underline">
          More sizing tips
        </a>
      </div>
    </div>
  </div>
);
