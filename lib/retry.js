// lib/retry.js
//
// Gedeelde retry-helper voor alle Shopify/leverancier-aanroepen. Externe
// API's falen af en toe tijdelijk (netwerkhikje, rate-limit, korte storing) —
// zonder retry zou zo'n eenmalige hik een hele sync of order-doorsturing
// onnodig laten mislukken. Retryt met exponentiële backoff (200ms, 400ms,
// 800ms) en geeft de laatste fout door als alle pogingen mislukken.

async function withRetry(fn, { attempts = 3, baseDelayMs = 200, label = 'aanroep' } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error(`${label} mislukt na ${attempts} pogingen: ${lastError.message}`);
}

module.exports = { withRetry };
