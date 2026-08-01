/* ============================================================
   api/_kv.js — gedeelde Vercel KV-wrapper
   ------------------------------------------------------------
   Kleine wrapper rond Vercel KV's REST-API, gebruikt door meerdere
   losse features (nieuwsbrief-kortingscodes, Velora Rewards) — geen
   npm-package nodig, gebruikt de KV_REST_API_URL/TOKEN die Vercel
   automatisch instelt zodra je een KV-store aan dit project koppelt.
   ============================================================ */

async function kvRequest(path, options = {}) {
  const baseUrl = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!baseUrl || !token) {
    throw new Error('KV_REST_API_URL/KV_REST_API_TOKEN ontbreken. Koppel een Vercel KV-store aan dit project (Vercel-dashboard → Storage → KV).');
  }
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
  });
  if (!res.ok) throw new Error(`KV-aanroep mislukt (${res.status}): ${path}`);
  return res.json();
}

async function kvSet(key, value) {
  return kvRequest(`/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
}

async function kvGet(key) {
  const result = await kvRequest(`/get/${encodeURIComponent(key)}`);
  return result?.result ? JSON.parse(result.result) : null;
}

module.exports = { kvGet, kvSet };
