import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { shopifyGraphQL } from "../shopify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CollectionProducts() {
  const { category } = useParams(); 
  const pathParts = window.location.pathname.split("/");
  const gender = pathParts[1]; 
  const collectionHandle = `${gender}-${category}`;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      setError(null);
      try {
        const query = `
          query CollectionByHandle($handle: String!, $first: Int!) {
            collectionByHandle(handle: $handle) {
              id
              title
              description
              products(first: $first) {
                edges {
                  node {
                    id
                    title
                    handle
                    description
                    featuredImage {
                      url
                      altText
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          title
                          priceV2 { amount currencyCode }
                          availableForSale
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `;
        const vars = { handle: collectionHandle, first: 48 };
        const data = await shopifyGraphQL(query, vars);
        const edges = data?.collectionByHandle?.products?.edges || [];
        setProducts(edges.map((e) => e.node));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCollection();
  }, [collectionHandle]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 px-6 bg-gray-50">
        <div className="container mx-auto">
          {/* Page Heading */}
          <h1 className="text-5xl sm:text-6xl font-montreal font-bold tracking-wide text-gray-900 mb-8 text-center capitalize">
            {gender} / {category}
          </h1>

          {/* Loading/Error/Empty states */}
          {loading && <p className="text-center text-gray-500 mt-12 font-montreal font-normal">Loading products...</p>}
          {error && <p className="text-center text-red-600 mt-12 font-montreal font-normal">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center text-gray-500 mt-12 font-montreal font-normal">
              No products found in {collectionHandle}.
            </p>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
            {products.map((p) => {
              const variant = p.variants?.edges?.[0]?.node;
              const img = p.featuredImage?.url;

              return (
                <Link to={`/product/${p.handle}`} key={p.id}>
                  <div className="relative group rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-500 hover:scale-105 bg-white">
                    <img
                      src={img || "/placeholder.jpg"}
                      alt={p.featuredImage?.altText || p.title}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-montreal font-bold text-gray-900">{p.title}</h3>
                      {variant && (
                        <p className="mt-1 text-gray-700 text-lg font-montreal font-normal">
                          {variant.priceV2.amount} {variant.priceV2.currencyCode}
                        </p>
                      )}
                    </div>
                    {/* Optional overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-500 rounded-3xl"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
