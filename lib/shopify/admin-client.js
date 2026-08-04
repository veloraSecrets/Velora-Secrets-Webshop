// lib/shopify/admin-client.js
//
// Shopify Admin API — uitsluitend server-side gebruikt (in api/-routes), NOOIT
// importeren in code die naar de browser gaat. Het Admin-token geeft volledige
// toegang tot de winkel (producten schrijven, bestellingen lezen, voorraad
// aanpassen) en moet dus strikt geheim blijven, in tegenstelling tot het
// Storefront-token.
//
// Vereist env vars:
//   SHOPIFY_STORE_DOMAIN    (bv. velora-secrets.myshopify.com)
//   SHOPIFY_ADMIN_TOKEN     (Admin API access token van de custom app)

const ADMIN_API_VERSION = '2024-10';
const { isTestMode } = require('../test-mode');
const { withRetry } = require('../retry');

function getConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  if (!domain || !token) {
    throw new Error('Shopify Admin API nog niet geconfigureerd (SHOPIFY_STORE_DOMAIN / SHOPIFY_ADMIN_TOKEN ontbreken).');
  }
  return { domain, token };
}

async function adminRequest(query, variables) {
  return withRetry(async () => {
    const { domain, token } = getConfig();
    const res = await fetch(`https://${domain}/admin/api/${ADMIN_API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) {
      throw new Error('Shopify Admin API-fout: ' + JSON.stringify(json.errors));
    }
    return json.data;
  }, { attempts: 3, label: 'Shopify Admin API' });
}

// ---------- Product-sync (leverancier -> Shopify) ----------
// productSet is Shopify's "upsert"-mutatie: maakt aan als 'ie nog niet bestaat
// (op basis van een extern ID dat je zelf meestuurt), werkt bij als 'ie al bestaat.
const PRODUCT_SET_MUTATION = `
  mutation ProductSet($input: ProductSetInput!) {
    productSet(input: $input) {
      product { id title }
      userErrors { field message }
    }
  }
`;

async function upsertProduct(productInput) {
  if (isTestMode()) {
    return { id: 'gid://shopify/Product/test-' + Date.now(), title: '[TESTMODUS] ' + (productInput.title || 'onbekend product') };
  }
  const data = await adminRequest(PRODUCT_SET_MUTATION, { input: productInput });
  if (data.productSet.userErrors.length) {
    throw new Error(data.productSet.userErrors.map(e => e.message).join(', '));
  }
  return data.productSet.product;
}

const INVENTORY_SET_MUTATION = `
  mutation InventorySet($input: InventorySetOnHandQuantitiesInput!) {
    inventorySetOnHandQuantities(input: $input) {
      inventoryAdjustmentGroup { createdAt }
      userErrors { field message }
    }
  }
`;

async function setInventory(locationId, inventoryItemId, quantity) {
  if (isTestMode()) return;
  const data = await adminRequest(INVENTORY_SET_MUTATION, {
    input: {
      reason: 'correction',
      setQuantities: [{ locationId, inventoryItemId, quantity }]
    }
  });
  if (data.inventorySetOnHandQuantities.userErrors.length) {
    throw new Error(data.inventorySetOnHandQuantities.userErrors.map(e => e.message).join(', '));
  }
}

// ---------- Fulfillment (dropship-order doorsturen -> Shopify op de hoogte houden) ----------
const FULFILLMENT_CREATE_MUTATION = `
  mutation FulfillmentCreate($fulfillment: FulfillmentInput!) {
    fulfillmentCreate(fulfillment: $fulfillment) {
      fulfillment { id status }
      userErrors { field message }
    }
  }
`;

async function createFulfillment({ orderId, trackingNumber, trackingUrl, trackingCompany }) {
  if (isTestMode()) {
    return { id: 'gid://shopify/Fulfillment/test-' + Date.now(), status: 'SUCCESS' };
  }
  const data = await adminRequest(FULFILLMENT_CREATE_MUTATION, {
    fulfillment: {
      lineItemsByFulfillmentOrder: [{ fulfillmentOrderId: orderId }],
      trackingInfo: { number: trackingNumber, url: trackingUrl, company: trackingCompany },
      notifyCustomer: true // Shopify verstuurt de verzendbevestiging automatisch uit naam van de winkel (Velora Secrets)
    }
  });
  if (data.fulfillmentCreate.userErrors.length) {
    throw new Error(data.fulfillmentCreate.userErrors.map(e => e.message).join(', '));
  }
  return data.fulfillmentCreate.fulfillment;
}

module.exports = { upsertProduct, setInventory, createFulfillment, adminRequest };
