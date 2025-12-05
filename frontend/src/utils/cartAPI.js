import { shopifyGraphQL } from "../shopify";

// Helpers to manage cart ID in localStorage
export function getStoredCartId() {
  return localStorage.getItem("cartId");
}
export function setStoredCartId(id) {
  localStorage.setItem("cartId", id);
}
export function removeStoredCartId() {
  localStorage.removeItem("cartId");
}

// Fetch current cart
export async function fetchCart() {
  const cartId = getStoredCartId();
  if (!cartId) return { items: [], subtotal: 0, checkoutUrl: "" };

  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        estimatedCost { subtotalAmount { amount currencyCode } }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 { amount currencyCode }
                  image { url altText }
                  product { title handle }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyGraphQL(query, { cartId });
  const cart = data.cart;
  if (!cart) return { items: [], subtotal: 0, checkoutUrl: "" };

  return {
    items: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      name: node.merchandise.product.title,
      variant: node.merchandise.title,
      price: node.merchandise.priceV2.amount,
      currency: node.merchandise.priceV2.currencyCode,
      quantity: node.quantity,
      image: node.merchandise.image?.url || "",
    })),
    subtotal: cart.estimatedCost.subtotalAmount.amount,
    checkoutUrl: cart.checkoutUrl,
  };
}

// Add to cart
export async function addToCart(merchandiseId, quantity = 1) {
  const cartId = getStoredCartId();

  if (cartId) {
    // Add line to existing cart
    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost { subtotalAmount { amount currencyCode } }
            lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title priceV2 { amount currencyCode } product { title handle } image { url altText } } } } } }
          }
        }
      }
    `;
    const res = await shopifyGraphQL(mutation, {
      cartId,
      lines: [{ merchandiseId, quantity }],
    });
    const updatedCart = res.cartLinesAdd.cart;
    return parseCartResponse(updatedCart);
  } else {
    // Create a new cart
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            estimatedCost { subtotalAmount { amount currencyCode } }
            lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title priceV2 { amount currencyCode } product { title handle } image { url altText } } } } } }
          }
        }
      }
    `;
    const res = await shopifyGraphQL(mutation, {
      input: { lines: [{ merchandiseId, quantity }] },
    });
    const newCart = res.cartCreate.cart;
    setStoredCartId(newCart.id);
    return parseCartResponse(newCart);
  }
}

// Remove a single line
export async function removeLine(lineId) {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          estimatedCost { subtotalAmount { amount currencyCode } }
          lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title priceV2 { amount currencyCode } product { title handle } image { url altText } } } } } }
        }
      }
    }
  `;
  const res = await shopifyGraphQL(mutation, { cartId, lineIds: [lineId] });
  return parseCartResponse(res.cartLinesRemove.cart);
}

// Update line quantity
export async function updateLine(lineId, quantity) {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  const mutation = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          estimatedCost { subtotalAmount { amount currencyCode } }
          lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title priceV2 { amount currencyCode } product { title handle } image { url altText } } } } } }
        }
      }
    }
  `;
  const res = await shopifyGraphQL(mutation, { cartId, lines: [{ id: lineId, quantity }] });
  return parseCartResponse(res.cartLinesUpdate.cart);
}

// Clear entire cart
export async function clearCart() {
  const cartId = getStoredCartId();
  if (!cartId) return null;

  // Fetch cart first to get all line IDs
  const currentCart = await fetchCart();
  if (!currentCart.items.length) return null;

  const lineIds = currentCart.items.map((item) => item.id);

  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          estimatedCost { subtotalAmount { amount currencyCode } }
          lines(first: 50) { edges { node { id quantity merchandise { ... on ProductVariant { id title priceV2 { amount currencyCode } product { title handle } image { url altText } } } } } }
        }
      }
    }
  `;
  const res = await shopifyGraphQL(mutation, { cartId, lineIds });
  removeStoredCartId();
  return parseCartResponse(res.cartLinesRemove.cart);
}

// Helper to parse cart GraphQL response
function parseCartResponse(cart) {
  if (!cart) return { items: [], subtotal: 0, checkoutUrl: "" };
  return {
    items: cart.lines.edges.map(({ node }) => ({
      id: node.id,
      name: node.merchandise.product.title,
      variant: node.merchandise.title,
      price: node.merchandise.priceV2.amount,
      currency: node.merchandise.priceV2.currencyCode,
      quantity: node.quantity,
      image: node.merchandise.image?.url || "",
    })),
    subtotal: cart.estimatedCost.subtotalAmount.amount,
    checkoutUrl: cart.checkoutUrl,
  };
}
