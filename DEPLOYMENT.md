# Velora Secrets — Deployment naar Vercel

Deze site is een statische HTML/CSS/JS-site met een paar Vercel serverless
API-routes (`api/`). Dit document beschrijft hoe je 'm live zet.

## 1. Repository voorbereiden
1. Maak een nieuwe, lege GitHub-repository aan (of gebruik een bestaande).
2. Upload alle bestanden uit deze map, met de mapstructuur intact:
   - alle `.html`-bestanden in de root
   - `css/`, `js/`, `api/`
   - `package.json`, `.env.example`
3. **Let op vertaling**: als je bestanden via de GitHub-website upload/bewerkt,
   zet Chrome's "Deze pagina vertalen" UIT voordat je dat doet. Eerder in dit
   project zorgde die functie ervoor dat bestandsnamen en code-inhoud werden
   vertaald (bijv. `package.json` → `pakket.json`), wat de deployment brak.

## 2. Vercel-project aanmaken
1. Ga naar [vercel.com](https://vercel.com) → **New Project** → koppel de
   GitHub-repository.
2. Framework preset: **Other** (het is geen Next.js/React-project).
3. Build command: leeg laten (geen build-stap nodig voor de statische bestanden).
4. Output directory: `.` (root).

## 3. Environment variables instellen
Ga naar **Project → Settings → Environment Variables** en zet:

| Variabele | Waar je 'm vandaan haalt |
|---|---|
| `MOLLIE_API_KEY` | [mollie.com/dashboard](https://my.mollie.com/dashboard/developers/api-keys) — gebruik eerst de **test**-sleutel, pas later de live-sleutel |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_AUDIENCE_ID` | Resend → Audiences → jouw lijst |
| `SITE_URL` | de uiteindelijke domeinnaam, bijv. `https://velorasecrets.nl` |

Zie `.env.example` voor de volledige lijst.

## 4. Dependencies
`package.json` bevat `@mollie/api-client` en `resend`. Vercel installeert deze
automatisch bij deployment — lokaal testen kan met `npm install`.

## 5. De TODO's in de API-routes afmaken
De volgende bestanden bevatten uitgecommentarieerde voorbeeldcode die je moet
activeren zodra de sleutels hierboven zijn ingesteld:
- `api/create-payment.js` — Mollie-betaling aanmaken
- `api/webhook.js` — Mollie-statusupdate verwerken
- `api/newsletter.js` — nieuwsbrief-aanmelding via Resend
- `api/contact.js` — contactformulier-e-mail via Resend

Elke TODO staat duidelijk gemarkeerd in de code, met een voorbeeldimplementatie
in commentaar erboven.

## 6. Domein koppelen
1. **Project → Settings → Domains** → voeg `velorasecrets.nl` toe.
2. Volg Vercel's instructies om de DNS-records bij je domeinregistrar aan te passen.
3. **Let op**: als het domein eerder naar een ander project wees (bijv. een
   oud Lovable-project), zorg dat de oude DNS-records volledig zijn verwijderd
   voordat je de nieuwe instelt, anders kan de site tijdelijk niet bereikbaar zijn.

## 7. Na livegang: testen
Loop de volledige klantreis één keer door op de live URL:
1. Product bekijken → toevoegen aan winkelwagen
2. Winkelwagen → aantal aanpassen, verwijderen
3. Afrekenen → test-betaling met Mollie's testkaartgegevens (niet je eigen kaart)
4. Bevestig dat de webhook de bestelling correct bijwerkt
5. Nieuwsbrief- en contactformulier daadwerkelijk versturen en de ontvangen
   e-mail controleren

## Belangrijke beperking
Dit document is door Claude opgesteld zonder toegang tot je daadwerkelijke
Vercel-account of GitHub-repository — ik kan dus niet zelf verifiëren dat de
deployment slaagt. Loop bovenstaande stappen zelf door en meld het als je
tegen een foutmelding aanloopt, dan help ik die gericht oplossen.
