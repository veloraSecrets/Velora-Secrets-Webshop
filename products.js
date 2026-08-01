# Productievalidatie — checklist na deployment op Vercel

Doorloop deze stappen in volgorde nadat de site live staat en de
omgevingsvariabelen zijn ingesteld. Noteer bij elke stap of het
verwachte resultaat klopt — meld mij alleen de stappen die **afwijken**
van wat hieronder staat, dan los ik gericht de echte bug op.

## 0. Vóór je begint

- [ ] `MOLLIE_API_KEY` staat in Vercel op je **test**-sleutel (begint met `test_`)
- [ ] `RESEND_API_KEY` is ingesteld
- [ ] `SITE_URL` staat op je exacte Vercel-URL (of eigen domein)
- [ ] Open de Vercel-functielogs in een apart tabblad (**Deployments → [laatste deploy] → Functions**) — daar zie je live wat `create-payment` en `webhook` doen

## 1. Betaling aanmaken

1. Vul een product toe aan je winkelwagen, ga naar `checkout.html`, vul het formulier geldig in.
2. Klik **Bestelling plaatsen**.

**Verwacht**: de knop toont kort "Bezig met verwerken…", daarna word je automatisch doorgestuurd naar een Mollie-betaalpagina (URL begint met `https://www.mollie.com/checkout/...`).

**Mogelijke echte bugs**:
- Blijft de knop hangen op "Bezig met verwerken…" zonder redirect? → Bekijk de Vercel-functielog van `create-payment` voor de exacte foutmelding.
- Zie je meteen een rode foutmelding bovenaan het formulier? De tekst zelf vertelt je vaak al wat er mist (bv. "MOLLIE_API_KEY ontbreekt").
- Browser-devtools → Network-tab → check de response van `/api/create-payment`: hoort status 200 met een `checkoutUrl` te zijn.

## 2. Op Mollie's testpagina

Gebruik een van [Mollie's testbetaalmethoden](https://docs.mollie.com/overview/testing) (in testmodus kun je een betaling laten slagen of expres laten mislukken/annuleren — test alle drie).

- [ ] **Geslaagde betaling** doorlopen
- [ ] **Mislukte betaling** doorlopen
- [ ] **Geannuleerde betaling** (terug-knop op Mollie's pagina) doorlopen

## 3. Terugkeer naar de webshop

Na elk van de drie scenario's hierboven stuurt Mollie je terug naar `checkout.html?order=VS-...`.

**Verwacht (in alle drie de gevallen, ook bij mislukt/geannuleerd)**: je ziet de tekst "Bedankt — we verwerken je betaling" met je ordernummer, en de winkelwagen is leeg.

**Let op, dit is een bewuste eigenschap, geen bug**: deze pagina toont dezelfde "we verwerken je betaling"-tekst ongeacht of de betaling écht is gelukt — de daadwerkelijke bevestiging gebeurt apart, via de webhook (stap 4). Verwacht hier dus geen onderscheid tussen geslaagd/mislukt; dat hoort pas in je inbox (stap 5) of eventueel later in een orderoverzicht (bestaat nu nog niet) zichtbaar te worden.

**Mogelijke echte bug**: krijg je hier een browserfout (bv. een kapotte pagina) in plaats van de bedankttekst? Dat wijst op een probleem in `checkout-page.js`, niet in Mollie of de webhook.

## 4. Webhook-verwerking

Ga naar de Vercel-functielogs voor `api/webhook`.

**Verwacht bij de geslaagde betaling uit stap 2**:
```
Status 200, response: { "received": true, "emailSent": true }
```

**Verwacht bij de mislukte/geannuleerde betaling**:
```
Status 200, response: { "received": true, "status": "failed" }  (of "canceled"/"expired")
```
— géén e-mail verstuurd, en dat is correct.

**Mogelijke echte bugs**:
- Log toont `emailSent: false` bij een wél geslaagde betaling → controleer of `RESEND_API_KEY` juist staat, en of het antwoord een `warning`-veld bevat met de reden.
- Geen enkele aanroep zichtbaar in de logs → Mollie heeft de webhook niet kunnen bereiken. Controleer of `SITE_URL` exact overeenkomt met de live URL (geen trailing slash-verschil, geen `http` i.p.v. `https`).

## 5. Orderbevestiging per e-mail

Controleer de inbox van het e-mailadres dat je bij "E-mailadres" in de checkout hebt ingevuld.

**Verwacht** (alleen bij de geslaagde betaling): een e-mail van `Velora Secrets <noreply@velorasecrets.nl>` met onderwerp "Je bestelling is bevestigd — Velora Secrets" en het juiste ordernummer.

**Mogelijke echte bugs**:
- E-mail komt niet aan, maar de log zegt `emailSent: true` → check de Resend-dashboard-logs (Resend laat per verstuurde mail de status zien: delivered/bounced/etc.) en of het domein `velorasecrets.nl` daadwerkelijk geverifieerd staat in Resend.
- E-mail komt in spam terecht → duidt meestal op ontbrekende/onjuiste SPF/DKIM-records bij je domeinregistrar, zie Resend's domeininstructies.

## 6. Foutafhandeling (bewust kapotte scenario's)

Test deze expliciet om te bevestigen dat fouten netjes worden opgevangen, niet dat de site crasht:

- [ ] Zet tijdelijk `MOLLIE_API_KEY` fout/leeg in Vercel, herdeploy, probeer af te rekenen → verwacht een duidelijke rode foutmelding op de checkoutpagina zelf, geen kapotte/witte pagina.
- [ ] Vul tijdens het afrekenen een ongeldige postcode in → verwacht een foutmelding onder dat specifieke veld, formulier wordt niet verzonden.
- [ ] Zet `MOLLIE_API_KEY` weer goed terug na deze test.

## 7. Analytics inschakelen

Zet in `assets/analytics-config.js` één dienst op `enabled: true` met een echte ID (begin met Plausible, dat is het eenvoudigst te verifiëren).

**Verwacht**: open de site, kijk in de browser-devtools → Network-tab → er hoort een verzoek naar `plausible.io/js/script.js` te verschijnen. Binnen enkele seconden verschijnt het bezoek in je Plausible-dashboard onder "Realtime".

**Mogelijke echte bugs**:
- Geen netwerkverzoek zichtbaar → controleer of `analytics-config.js` vóór `analytics.js` laadt (Bekijk paginabron, zoek beide scripttags) en of `domain` exact je site-domein is (Plausible is hier strikt in).
- Herhaal dezelfde check voor Google Search Console (meta-tag zichtbaar in paginabron) en Meta Pixel (netwerkverzoek naar `connect.facebook.net`) zodra je die inschakelt.

## 8. Console-errors (algemeen)

Open op elke pagina de browserconsole (F12) en ververs.

**Verwacht**: geen enkele rode foutmelding, op geen van de 11 pagina's.
