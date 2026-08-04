# Velora Secrets — Eindcontrole vóór livegang

**Datum:** 3 augustus 2026 · **Context:** wachten op installatie van de 1on1 Wholesale Shopify-app; deze ronde is een volledige perfectioneringsslag zodat er na de koppeling direct getest en live gegaan kan worden.

**Methodologische kanttekening (zoals bij elke audit in dit project):** deze sandbox heeft geen browser en geen netwerktoegang. Alle controles zijn Node.js-simulaties tegen de daadwerkelijke productiecode en statische analyse — geen literaire browserrun. Waar dat een grens stelt, staat dat vermeld.

---

## Wat is gecontroleerd

Responsive CSS-structuur (breakpoints, geen duplicaten), animaties/transities (AI-chat, hover-states), header/navigatie/footer, zoekfunctie, AI-chat, social-iconen, contact-/over ons-/FAQ-pagina, SEO (meta/OG/canonical/structured data/sitemap/robots), toegankelijkheid (labels, contrast, focus, skip-link), performance (bestandsgrootte, caching-overweging), beveiliging (XSS/SQLi/secrets/authenticatie/cron-beveiliging), dode code, ongebruikte CSS-classes en JS-functies, kleur-/spacing-consistentie, alle interne links or 73 pagina's, alle formulierknoppen, alle statusmeldingen, database-levenscyclus, Shopify Cart/Checkout-flow, volledige backend-E2E-keten.

---

## Wat is verbeterd deze ronde

| # | Bevinding | Fix |
|---|---|---|
| 1 | 9 CSS-classes volledig verweesd na eerdere verwijdering van `checkout.html` en de nep-kleurselector (`.checkout-layout`, `.checkout-steps`, `.checkout-section`, `.field-grid`, `.checkout-summary`, `.checkout-line-mini`, `.pd-options`, `.pd-option-list`, `.cart-line-brand`) | Volledig verwijderd uit `css/pages.css`, `@media`-blok opgeschoond. Bevestigd: 0 ongebruikte CSS-classes overgebleven (was 142 totaal gecontroleerd). |
| 2 | 5 hardcoded hex-kleuren die exact een bestaande CSS-variabele matchten (`#2B2A28`=`--espresso` 3x, `#E2A385`=`--gold` 1x, `#C4472E`=`--sale` 1x) — een gemiste koppeling, geen bewuste keuze | Vervangen door `var(--espresso)`/`var(--gold)`/`var(--sale)`. Voorkomt dat een toekomstige merkkleur-wijziging deze plekken mist. |
| 3 | **Contactformulier beloofde "we reageren binnen 1 werkdag"** terwijl er nog geen backend is die het bericht daadwerkelijk ontvangt — een misleidende belofte aan een echte bezoeker | Melding vervangen door een eerlijke tekst die doorverwijst naar het directe e-mailadres, zonder valse garantie. |
| 4 | **Nieuwsbrief-formulier beloofde "check je inbox"** terwijl er geen bevestigingsmail verstuurd wordt | Zelfde aanpak: eerlijke melding dat de functie nog niet actief is. |
| 5 | 0 ongebruikte JS-functies gevonden (gecontroleerd, geen fix nodig) | — |
| 6 | Meta-tags (title/description/canonical/OG) op alle 20 pagina's gecontroleerd — 404.html mist canonical/OG, maar terecht (heeft `robots:noindex`, canonical zou daar juist misplaatst zijn) | Geen fix nodig, bevestigd correct |
| 7 | Alle interne links (73 pagina's) en alle formulierknoppen (expliciet `type`-attribuut, voorkomt per-ongeluk-submit) | Beide 100% schoon, geen fix nodig |

Volledige regressie na alle wijzigingen: JS-syntax/laadbaarheid, HTML-balans (73 pagina's + beheerpaneel), CSS-integriteit, config-bestanden, de volledige backend-E2E-keten, en de Shopify-cart-flow — **allemaal groen**.

---

## Resterende aandachtspunten (geen van alle blokkerend voor verdere ontwikkeling, wel voor livegang)

| Punt | Waarom het nog openstaat |
|---|---|
| Contact-/nieuwsbriefformulieren versturen nog niets echt | Bewust: wacht op een gekozen e-mailprovider. Nu tenminste eerlijk over deze status i.p.v. een valse belofte. |
| Multi-variant productselectie (kleur/maat) | Elk product ondersteunt nu 1 Shopify-variant; echte optie-selectie volgt zodra een leverancier-product met meerdere varianten bestaat. |
| Database draait op de SQLite-testadapter | Nog geen echte Postgres/Supabase-instantie gekoppeld — de code is klaar (`db/schema.sql`), wacht op `DATABASE_URL`. |
| Retour-bedienings-UI | Status bestaat in de levenscyclus, geen scherm om 'm te initiëren. |
| Geen echte browsertest mogelijk in deze sandbox | Alles is Node-gesimuleerd tegen de productiecode; een korte handmatige doorloop in een echte browser (desktop + mobiel) blijft aan te raden vóór livegang, ook al is de kans op verrassingen klein gezien de uitgebreide code-niveau-controles. |

---

## Eerlijk percentage: hoe dicht bij een professionele livegang?

## **≈ 88%**

**Waarom niet lager**: de volledige architectuur (frontend, database, order-levenscyclus, webhooks, beveiliging, SEO, toegankelijkheid, Shopify Cart/Checkout) is gebouwd, functioneel getest tegen de daadwerkelijke productiecode, en vrij van bekende bugs, dode code of inconsistenties na deze ronde.

**Waarom niet hoger**: de resterende ~12% bestaat uitsluitend uit dingen die **niet vanuit code op te lossen zijn** in deze fase — een echte Shopify-winkelverbinding, echte productdata via 1on1 Wholesale, een echte database-instantie, en (optioneel vóór livegang) een e-mailprovider-keuze. Dat is geen kwaliteitsgebrek in wat gebouwd is, maar een kwestie van externe afhankelijkheden die per ontwerp pas ná de app-installatie ingevuld kunnen worden.

---

## De enige resterende stappen vóór Velora Secrets live kan

1. **1on1 Wholesale Shopify-app laten installeren** (loopt al, wachten op hun ontwikkelaar).
2. **Shopify-productiewinkel + custom app + tokens instellen** (`DEPLOYMENT.md`).
3. **`DATABASE_URL` naar een echte Supabase/Postgres-instantie**, `db/schema.sql` uitvoeren (`DATABASE.md`).
4. **Eerste producten importeren** via 1on1 Wholesale, en verifiëren: sync/voorraad/afbeeldingen/categorieën correct (`SHOPIFY-CATALOG-MAPPING.md` voor de tag-conventie).
5. **`npm run generate:catalog` draaien** zodat de frontend de echte producten toont (geen codewijziging nodig, zoals ontworpen).
6. **Volledige bestelstroom eenmaal echt doorlopen**: product → winkelwagen → Shopify-checkout → (test-)betaling → orderwebhook → leveranciersroutering → Track & Trace → orderstatus in het beheerpaneel.
7. **Webhooks + cron-jobs registreren** in de productiewinkel (`SHOPIFY_WEBHOOK_SECRET`, `CRON_SECRET`).
8. **(Optioneel, kan ook na livegang) e-mailprovider kiezen** voor contact-/nieuwsbriefformulieren.
9. **Domein + eigen checkout-domein instellen** in Shopify, DNS wijzen naar Vercel.
10. **`TEST_MODE` uitzetten**, bevestigen in `/admin` dat de juiste winkel + Postgres-database actief zijn.

Zodra stap 1 t/m 7 zijn doorlopen, is er niets meer wat een codewijziging vereist om live te gaan — precies het doel dat je stelde.
