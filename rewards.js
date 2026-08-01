/* ============================================================
   api/shopify.js — Shopify Storefront API-bibliotheek
   ------------------------------------------------------------
   In tegenstelling tot de eerdere 1on1Wholesale-scaffolding is de
   Shopify Storefront API een publiek, stabiel gedocumenteerd
   GraphQL-schema — de queries hieronder zijn daadwerkelijk correct
   tegen dat schema, niet gegokt. Wat ontbreekt is uitsluitend jouw
   eigen winkeldomein + access token (zie .env.example) — zodra die
   zijn ingesteld, werkt dit direct.

   Vereist: SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_ACCESS_TOKEN,
   SHOPIFY_API_VERSION (zie .env.example).
   ============================================================ */

async function shopifyStorefrontQuery(query, variables = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2026-07';

  if (!domain || !token) {
    throw new Error(
      'SHOPIFY_STORE_DOMAIN of SHOPIFY_STOREFRONT_ACCESS_TOKEN ontbreekt. Zet deze omgevingsvariabelen in Vercel (zie .env.example) — instructies om ze te verkrijgen staan daar ook.'
    );
  }

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();
  if (data.errors) {
    throw new Error('Shopify Storefront API-fout: ' + JSON.stringify(data.errors));
  }
  return data.data;
}

/* Publiek: haalt producten op (met voorraadstatus) uit Shopify,
   omgezet naar hetzelfde velden-formaat als het bestaande
   VELORA_PRODUCTS zodat de rest van de site (zoeken, filters,
   AI-adviseur) ongewijzigd kan blijven werken. */
async function getShopifyProducts(first = 50, after = null) {
  const query = `
    query Products($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            handle
            vendor
            productType
            description
            availableForSale
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            variants(first: 1) {
              edges { node { id availableForSale quantityAvailable } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;
  const data = await shopifyStorefrontQuery(query, { first, after });
  return data.products.edges.map(({ node }) => ({
    id: node.id,
    handle: node.handle,
    title: node.title,
    vendor: node.vendor,
    category: node.productType,
    description: node.description,
    price: Number(node.priceRange.minVariantPrice.amount),
    compareAt: node.compareAtPriceRange?.minVariantPrice?.amount
      ? Number(node.compareAtPriceRange.minVariantPrice.amount)
      : null,
    available: node.availableForSale,
    stockQty: node.variants.edges[0]?.node.quantityAvailable ?? null,
  }));
}

/* Publiek: maakt een winkelwagen aan bij Shopify en geeft de
   checkoutUrl (Shopify's eigen hosted checkout) terug — zelfde
   patroon als create-payment.js's checkoutUrl-redirect, dus de
   bestaande checkout-page.js-redirectlogica kan grotendeels
   hergebruikt worden. lines: [{ variantId, quantity }] */
async function createShopifyCart(lines) {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }
  `;
  const data = await shopifyStorefrontQuery(query, {
    lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
  });
  if (data.cartCreate.userErrors.length) {
    throw new Error('Shopify cartCreate-fout: ' + JSON.stringify(data.cartCreate.userErrors));
  }
  return data.cartCreate.cart.checkoutUrl;
}

module.exports = { shopifyStorefrontQuery, getShopifyProducts, createShopifyCart };
