// lib/shopify/storefront-client.js
//
// Shopify Storefront API — GraphQL-client voor productdata, collecties en checkout.
// Het Storefront-token is BEWUST client-veilig (Shopify's eigen ontwerp: dit token mag
// in browser-JS staan, in tegenstelling tot het Admin API-token dat NOOIT naar de
// browser mag — dat blijft uitsluitend server-side, zie admin-client.js).
//
// Vereist env vars:
//   SHOPIFY_STORE_DOMAIN      (bv. velora-secrets.myshopify.com)
//   SHOPIFY_STOREFRONT_TOKEN  (Storefront API access token)

const STOREFRONT_API_VERSION = '2024-10';
const { isTestMode, MOCK_PRODUCTS } = require('../test-mode');
const { withRetry } = require('../retry');

function getConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) {
    throw new Error('Shopify Storefront API nog niet geconfigureerd (SHOPIFY_STORE_DOMAIN / SHOPIFY_STOREFRONT_TOKEN ontbreken).');
  }
  return { domain, token };
}

async function storefrontRequest(query, variables) {
  return withRetry(async () => {
    const { domain, token } = getConfig();
    const res = await fetch(`https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token
      },
      body: JSON.stringify({ query, variables })
    });

    const json = await res.json();
    if (json.errors) {
      throw new Error('Shopify Storefront API-fout: ' + JSON.stringify(json.errors));
    }
    return json.data;
  }, { attempts: 3, label: 'Shopify Storefront API' });
}

// ---------- Query's ----------
// Let op: veldnamen zijn Shopify's eigen, publiek gedocumenteerde Storefront API-schema
// (https://shopify.dev/docs/api/storefront) — dit deel is GEEN aanname, dit is Shopify's
// eigen contract en werkt zodra de env vars hierboven correct zijn ingevuld.

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node {
          id
          handle
          title
          descriptionHtml
          vendor
          tags
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          variants(first: 10) {
            edges { node { id title availableForSale quantityAvailable price { amount } } }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      vendor
      tags
      images(first: 8) { edges { node { url altText } } }
      priceRange { minVariantPrice { amount currencyCode } }
      variants(first: 25) {
        edges { node { id title availableForSale quantityAvailable price { amount }
          selectedOptions { name value } } }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost { totalAmount { amount currencyCode } subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount }
            image { url altText }
            product { title handle }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }
`;

// ---------- Realistische testmodus-cartstore ----------
// In-memory (per proces/testrun) zodat create->add->get->update->remove
// écht als een samenhangende cart getest kan worden, i.p.v. losse mock-
// antwoorden die niets van elkaar "weten".
const mockCarts = new Map();
let mockLineCounter = 1;

function mockFindProductByVariantId(variantId) {
  return MOCK_PRODUCTS.find(p =>
    (p.variants.edges || []).some(e => e.node.id === variantId)
  );
}

function mockBuildLine(merchandiseId, quantity, existingId) {
  const product = mockFindProductByVariantId(merchandiseId);
  const variant = product && product.variants.edges.find(e => e.node.id === merchandiseId).node;
  return {
    id: existingId || ('gid://shopify/CartLine/test-' + (mockLineCounter++)),
    quantity,
    merchandise: {
      id: merchandiseId,
      title: variant ? variant.title : 'Onbekende variant',
      price: { amount: variant ? variant.price.amount : '0.00' },
      image: null,
      product: { title: product ? product.title : 'Onbekend testproduct', handle: product ? product.handle : 'onbekend' }
    }
  };
}

function mockCartToCartObject(cartId) {
  const lines = mockCarts.get(cartId) || [];
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalAmount = lines.reduce((sum, l) => sum + parseFloat(l.merchandise.price.amount) * l.quantity, 0);
  return {
    id: cartId,
    checkoutUrl: `https://example-teststore.myshopify.com/cart/c/${cartId.split('/').pop()}?TESTMODUS=true`,
    totalQuantity,
    cost: {
      totalAmount: { amount: totalAmount.toFixed(2), currencyCode: 'EUR' },
      subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode: 'EUR' }
    },
    lines: { edges: lines.map(l => ({ node: l })) }
  };
}

// ---------- Publieke functies ----------

async function fetchProducts({ first = 24, after = null, query = null } = {}) {
  if (isTestMode()) {
    return { edges: MOCK_PRODUCTS.map(p => ({ cursor: p.id, node: p })), pageInfo: { hasNextPage: false, endCursor: null } };
  }
  const data = await storefrontRequest(PRODUCTS_QUERY, { first, after, query });
  return data.products;
}

async function fetchProductByHandle(handle) {
  if (isTestMode()) {
    return MOCK_PRODUCTS.find(p => p.handle === handle) || MOCK_PRODUCTS[0];
  }
  const data = await storefrontRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data.product;
}

// Belangrijke architectuurkeuze: checkout blijft Shopify's eigen, beveiligde
// checkoutUrl (cart.checkoutUrl). Zelf een checkout nabouwen zou PCI-DSS-scope,
// betaalveiligheid en fraudecontrole van Shopify wegnemen — daarom NIET zelf
// nabouwen. De checkoutUrl kan wel op een eigen (sub)domein via Shopify's
// domein-instellingen, zodat het merk zichtbaar Velora Secrets blijft.
async function createCart(lines) {
  if (isTestMode()) {
    const cartId = 'gid://shopify/Cart/test-' + Date.now();
    const cartLines = lines.map(l => mockBuildLine(l.merchandiseId, l.quantity));
    mockCarts.set(cartId, cartLines);
    return mockCartToCartObject(cartId);
  }
  const data = await storefrontRequest(CART_CREATE_MUTATION, { lines });
  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map(e => e.message).join(', '));
  }
  return data.cartCreate.cart;
}

async function addCartLines(cartId, lines) {
  if (isTestMode()) {
    if (!mockCarts.has(cartId)) throw new Error(`Testcart ${cartId} bestaat niet (mogelijk verlopen testrun).`);
    const existing = mockCarts.get(cartId);
    lines.forEach(l => {
      const already = existing.find(e => e.merchandise.id === l.merchandiseId);
      if (already) {
        already.quantity += l.quantity;
      } else {
        existing.push(mockBuildLine(l.merchandiseId, l.quantity));
      }
    });
    return mockCartToCartObject(cartId);
  }
  const data = await storefrontRequest(CART_LINES_ADD_MUTATION, { cartId, lines });
  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map(e => e.message).join(', '));
  }
  return data.cartLinesAdd.cart;
}

async function updateCartLine(cartId, lineId, quantity) {
  if (isTestMode()) {
    if (!mockCarts.has(cartId)) throw new Error(`Testcart ${cartId} bestaat niet.`);
    const existing = mockCarts.get(cartId);
    const line = existing.find(e => e.id === lineId);
    if (line) line.quantity = quantity;
    return mockCartToCartObject(cartId);
  }
  const data = await storefrontRequest(CART_LINES_UPDATE_MUTATION, { cartId, lines: [{ id: lineId, quantity }] });
  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map(e => e.message).join(', '));
  }
  return data.cartLinesUpdate.cart;
}

async function removeCartLine(cartId, lineId) {
  if (isTestMode()) {
    if (!mockCarts.has(cartId)) throw new Error(`Testcart ${cartId} bestaat niet.`);
    mockCarts.set(cartId, mockCarts.get(cartId).filter(e => e.id !== lineId));
    return mockCartToCartObject(cartId);
  }
  const data = await storefrontRequest(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map(e => e.message).join(', '));
  }
  return data.cartLinesRemove.cart;
}

async function getCart(cartId) {
  if (isTestMode()) {
    if (!mockCarts.has(cartId)) return null;
    return mockCartToCartObject(cartId);
  }
  const data = await storefrontRequest(CART_QUERY, { cartId });
  return data.cart;
}

module.exports = { fetchProducts, fetchProductByHandle, createCart, addCartLines, updateCartLine, removeCartLine, getCart };
