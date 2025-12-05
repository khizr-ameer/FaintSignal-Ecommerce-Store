// Updated ThermometerBrowse.jsx with improved color scheme, smoother UX, and animated product entrance
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { shopifyGraphQL } from "../shopify";
import { motion } from "framer-motion";

export default function ThermometerBrowse() {
  const [value, setValue] = useState(50);
  const [season, setSeason] = useState(null);
  const [filterMen, setFilterMen] = useState(true);
  const [filterWomen, setFilterWomen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cursorLabel = value < 50 ? "Winter" : value > 50 ? "Summer" : "Neutral";

  function buildQuery(seasonTag, includeMen, includeWomen) {
    const seasonPart = `tag:${seasonTag}`;
    const genderParts = [];
    if (includeMen && !includeWomen) genderParts.push("tag:men");
    if (!includeMen && includeWomen) genderParts.push("tag:women");
    return [seasonPart, ...genderParts].join(" AND ");
  }

  async function fetchProducts() {
    setError("");
    setProducts([]);
    if (!season) {
      setError(
        "Please move the slider fully to Winter or Summer, then Browse."
      );
      return;
    }

    setLoading(true);
    try {
      const q = buildQuery(season, filterMen, filterWomen);
      const gql = `
        query ProductsSearch($query: String!, $first: Int!) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                handle
                featuredImage { url altText }
                variants(first:1) {
                  edges { node { priceV2 { amount currencyCode } } }
                }
              }
            }
          }
        }
      `;

      const vars = { query: q, first: 48 };
      const data = await shopifyGraphQL(gql, vars);

      const edges = data?.products?.edges || [];
      setProducts(edges.map((e) => e.node));
      if (!edges.length) setError("No products found.");
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  const handleBrowse = () => {
    const snapSeason = value < 40 ? "winter" : value > 60 ? "summer" : null;
    if (!snapSeason) {
      setError("Move slider more to either side to lock your choice.");
      return;
    }
    setSeason(snapSeason);
    fetchProducts();
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-montreal font-bold text-gray-900 mb-4">
          Browse Products
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Slide to <b>Winter</b> or <b>Summer</b>, choose filters, then Browse.
        </p>

        <div className="bg-white rounded-2xl shadow p-6">
          {/* MERGED + MOBILE WIDE THERMOMETER */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8 w-full">
            {/* Winter Label */}
            <div className="text-blue-600 font-semibold w-full text-left md:w-20 md:text-center">
              Winter
            </div>

            {/* Slider now occupies full width on mobile */}
            <div className="w-full md:flex-1">
              <div className="relative select-none cursor-pointer w-full">
                <div className="h-8 md:h-5 rounded-full bg-gradient-to-r from-blue-200 to-orange-200 w-full" />

                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${value}%`,
                    background:
                      value < 50
                        ? "linear-gradient(90deg,#3b82f6,#93c5fd)"
                        : "linear-gradient(90deg,#fdba74,#fb923c)",
                    opacity: 0.4,
                  }}
                />

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => {
                    setValue(Number(e.target.value));
                    setError("");
                  }}
                  className="absolute inset-0 w-full h-5 opacity-0 cursor-pointer"
                />

                <div
                  className="absolute -top-7 transform -translate-x-1/2 pointer-events-none"
                  style={{ left: `${value}%` }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-full w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shadow-md"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background:
                          value < 45
                            ? "#3b82f6" // Winter
                            : value > 55
                            ? "#fb923c" // Summer
                            : "#111827", // Neutral (gray)
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              <div className="mt-3 flex justify-between text-xs md:text-sm font-medium text-gray-700">
                <span className="text-blue-600">Cool & Cozy</span>
                <span className="text-orange-600">Hot & Breezy</span>
              </div>
            </div>

            {/* Summer Label */}
            <div className="text-orange-600 font-semibold w-full text-right md:w-20 md:text-center">
              Summer
            </div>
          </div>

          {/* Filters Section */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Selected:</div>
              <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                {cursorLabel === "Neutral" ? "Unset" : cursorLabel}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterMen}
                  onChange={() => setFilterMen((s) => !s)}
                  className="rounded"
                />
                Men
              </label>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterWomen}
                  onChange={() => setFilterWomen((s) => !s)}
                  className="rounded"
                />
                Women
              </label>

              <button
                onClick={handleBrowse}
                className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
              >
                Browse products
              </button>
            </div>
          </div>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        </div>

        {/* Products List */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading...</div>
          ) : (
            products.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {season.toUpperCase()} Products
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((p, i) => {
                    const variant = p.variants?.edges?.[0]?.node;
                    const img = p.featuredImage?.url;
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link to={`/product/${p.handle}`}>
                          <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                            <div className="w-full aspect-square overflow-hidden">
                              <img
                                src={img || "/placeholder.jpg"}
                                alt={p.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="p-3 text-left">
                              <h4 className="font-semibold text-base text-gray-900">
                                {p.title}
                              </h4>
                              <div className="mt-1 text-sm text-gray-700">
                                {variant?.priceV2.amount}{" "}
                                {variant?.priceV2.currencyCode}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}
