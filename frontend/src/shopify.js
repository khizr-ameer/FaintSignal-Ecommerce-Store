// src/shopify.js
const STORE_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN; // e.g. your-store.myshopify.com
const STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN; // storefront token
const API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || "2024-10";

export async function shopifyGraphQL(query, variables = {}) {
  const url = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
    