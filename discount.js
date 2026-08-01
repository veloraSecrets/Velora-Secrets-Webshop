# Velora Secrets — deployen naar Vercel

Dit document beschrijft hoe je deze webshop met een echte Mollie-betaalflow
en Resend-orderbevestigingen live zet op Vercel.

**Het contactformulier (`contact.html`) verstuurt nu echte e-mails via
Resend** naar `support@velorasecrets.nl` (of het adres dat je instelt via
`CONTACT_RECIPIENT_EMAIL`, zie stap 3). Vereist dezelfde `RESEND_API_KEY`
als de orderbevestigingen — geen extra account nodig.

Spambeveiliging bestaat uit een honeypot-veld, een timing-check (te snel
= bot) en best-effort rate limiting (max. 5 berichten per IP per 10
minuten). Die rate limiting werkt in-memory, zonder externe database —
dat is bewust, want dat is nieuwe infrastructuur die niet gevraagd was.
Praktisch betekent dit: de teller reset bij elke "koude start" van de
serverless function (normaal bij weinig verkeer), en werkt dus als
prima eerste verdedigingslinie tegen spam-bots, maar biedt geen harde
garantie bij grootschalig misbruik. Mocht dat ooit nodig blijken, dan is
de volgende stap een externe store zoals Vercel KV of Upstash Redis.

## 0. Overstappen van de oude Lovable-website naar dit project

Als `velorasecrets.nl` op dit moment nog naar een ander, via Lovable
gebouwd project wijst (herkenbaar aan de "Edit with Lovable"-badge
onderaan de pagina), volg dan eerst deze stappen vóór je verdergaat met
stap 1 hieronder:

1. **Zorg dat dit project eerst succesvol op Vercel draait op de
   gratis `.vercel.app`-URL** die je van Vercel krijgt (stappen 1-3
   hieronder) — pas dáárna het echte domein overzetten. Zo test je
   alles zonder dat `velorasecrets.nl` ook maar één moment offline is.
2. **Koppel het domein pas los van Lovable nádat** dit project
   volledig werkt op de tijdelijke Vercel-URL. Ga in Lovable naar de
   projectinstellingen van het oude project → Domains/Custom domain
   → verwijder `velorasecrets.nl` daar.
3. **Pas de DNS-records bij je domeinregistrar aan** (waar je
   `velorasecrets.nl` ooit hebt gekocht/geregistreerd) naar de
   waarden die Vercel je geeft in stap 2b hieronder — dit vervangt de
   bestaande record(s) die nu naar Lovable wijzen.
4. Reken op enkele minuten tot maximaal 48 uur voordat de DNS-wijziging
   overal ter wereld is doorgevoerd.

## 1. Vereisten

- Een [Vercel](https://vercel.com)-account (gratis niveau is voldoende om te beginnen)
- Een [Mollie](https://mollie.com)-account — testmodus werkt direct, zonder
  bedrijfsverificatie
- Een [Resend](https://resend.com)-account, met het domein `velorasecrets.nl`
  geverifieerd (nodig om vanaf `noreply@velorasecrets.nl` te mogen versturen)

## 2. Project aanleveren bij Vercel

1. Zet deze bestanden in een git-repository (GitHub/GitLab/Bitbucket).
2. Importeer de repository in het Vercel-dashboard. Vercel herkent
   automatisch de statische bestanden (`*.html`, `assets/`) én de
   `/api`-map als serverless functions — geen extra configuratie nodig.
3. `vercel.json` staat al klaar in de root en wordt automatisch
   opgepikt — regelt veilige HTTP-headers (o.a. tegen clickjacking en
   MIME-sniffing) en een korte cache-tijd op `/assets/` (bewust kort:
   de bestandsnamen zijn niet content-hashed, dus een lange cache zou
   toekomstige updates aan CSS/JS tijdelijk laten "vastzitten" bij
   bezoekers). Je hoeft hier zelf niets voor in te stellen.

## 2b. Domein velorasecrets.nl koppelen

1. Ga in het Vercel-dashboard naar je project → **Settings → Domains**.
2. Klik **Add**, typ `velorasecrets.nl` (zonder `https://` en zonder `www`) en bevestig.
3. Vercel toont daarna **exact welke DNS-records** je moet instellen. In
   de praktijk zijn dat meestal:
   - **Apex-domein** (`velorasecrets.nl` zelf): een **A-record** op
     `@` met waarde `76.76.21.21`
   - **www-subdomein** (`www.velorasecrets.nl`): een **CNAME-record**
     op `www` met waarde `cname.vercel-dns.com`

   Gebruik altijd de exacte waarden die Vercel ZELF in jouw dashboard
   toont — dit kan per project een net iets andere waarde zijn dan
   hierboven.
4. Log in bij je **domeinregistrar** (waar je `velorasecrets.nl` ooit
   hebt geregistreerd — niet Vercel, maar bv. TransIP, Vimexx, GoDaddy
   e.d.) en open het DNS-beheer van het domein.
5. **Verwijder eerst de bestaande record(s)** die nu naar de oude
   Lovable-website wijzen (meestal een A-record of CNAME op `@`
   en/of `www`) — twee concurrerende records op hetzelfde hostname
   veroorzaakt anders onvoorspelbaar gedrag.
6. Voeg de nieuwe A- en CNAME-record toe zoals Vercel aangaf in stap 3.
7. **Gebruik je Cloudflare** (oranje-wolk-proxy) voor dit domein? Zet
   de proxy op "DNS only" (grijze wolk) voor beide records — met de
   proxy aan kan Vercel geen geldig SSL-certificaat uitgeven.
8. Terug in Vercel: wacht tot de domeinstatus op **Valid** springt
   (kan enkele minuten tot 48 uur duren) — Vercel geeft dan ook
   automatisch een SSL-certificaat uit.
9. Zodra dat groen is: open `https://velorasecrets.nl` in een
   incognitovenster en controleer dat je nu déze webshop ziet, zonder
   enige "Edit with Lovable"-tekst onderaan.

## 3. Omgevingsvariabelen instellen

Ga naar **Project Settings → Environment Variables** in Vercel en zet:

| Variabele | Waarde | Waar te vinden |
|---|---|---|
| `MOLLIE_API_KEY` | Je Mollie API-sleutel (begin met `test_...`) | [Mollie-dashboard → Developers → API keys](https://my.mollie.com/dashboard/developers/api-keys) |
| `RESEND_API_KEY` | Je Resend API-sleutel | [Resend-dashboard → API Keys](https://resend.com/api-keys) |
| `SITE_URL` | `https://velorasecrets.nl` (of je Vercel-preview-URL tijdens testen) | — |
| `CONTACT_RECIPIENT_EMAIL` | *(optioneel)* Waar contactformulier-berichten naartoe gaan — laat leeg voor `support@velorasecrets.nl` | — |

Zie ook `.env.example` in de root van dit project voor dezelfde
documentatie in bestandsvorm.

**Belangrijk**: gebruik eerst de `test_`-Mollie-sleutel om de hele flow te
controleren (Mollie's testmodus doet alsof er betaald wordt, zonder dat er
echt geld beweegt). Pas als alles werkt en je Mollie-account volledig
geverifieerd is, zet je de omgevingsvariabele om naar je `live_`-sleutel.

## 4. Mollie-webhook controleren

`api/create-payment.js` geeft Mollie automatisch `SITE_URL/api/webhook` door
als webhook-adres bij elke aangemaakte betaling — je hoeft dit nergens
apart in te stellen in het Mollie-dashboard.

## 5. Resend-domein verifiëren

Voordat e-mails vanaf `noreply@velorasecrets.nl` daadwerkelijk aankomen,
moet je in het Resend-dashboard onder **Domains** het domein
`velorasecrets.nl` toevoegen en de gevraagde DNS-records (SPF/DKIM) bij je
domeinregistrar instellen.

## 6. Analytics activeren (optioneel)

Open `assets/analytics-config.js` en zet de gewenste diensten op
`enabled: true` met de bijbehorende ID:

- **Plausible**: `domain` = je exacte domeinnaam (bv. `velorasecrets.nl`)
- **Google Search Console**: `verificationCode` = de code uit de
  meta-tag-verificatiemethode (niet de hele `<meta>`-tag, alleen de
  waarde van het `content`-attribuut)
- **Meta Pixel**: `pixelId` = je Pixel-ID uit Meta Events Manager

Dit bestand bevat geen geheimen (alleen publieke tracking-ID's) en kan dus
gewoon met de rest van de statische bestanden meegecommit worden.

## 7. Testen vóór livegang

1. Deploy met de Mollie **test**-sleutel.
2. Doorloop de volledige flow: vul de winkelwagen, ga naar checkout, rond
   af met een van [Mollie's testbetaalmethoden](https://docs.mollie.com/overview/testing).
3. Controleer of je op `checkout.html?order=...` de bevestigingstekst ziet.
4. Controleer of de orderbevestiging binnenkomt op het testadres dat je bij
   het afrekenen hebt ingevuld.
5. Pas alles werkt? Zet dan pas de `live_`-Mollie-sleutel klaar.

## 8. Controlelijst ná de domeinmigratie

Loop dit na zodra `https://velorasecrets.nl` naar Vercel wijst:

- [ ] **SSL**: het slotje verschijnt in de browser, geen "niet
      veilig"-melding. Vercel regelt dit automatisch zodra de
      domeinstatus op "Valid" staat — vereist geen actie van jou.
- [ ] **Alle interne links werken**: klik het hoofdmenu, mega-menu's,
      footer-links en de zoekfunctie door — alles blijft relatief
      gelinkt (`product.html`, niet een hardgecodeerd oud domein), dus
      dit werkt automatisch op elk domein.
- [ ] **Canonical-tags**: `view-source:https://velorasecrets.nl/` →
      zoek `rel="canonical"` → moet naar `https://velorasecrets.nl/`
      wijzen (niet naar een Vercel-preview-URL of het oude domein).
- [ ] **sitemap.xml**: open `https://velorasecrets.nl/sitemap.xml` —
      moet 16 URL's tonen, allemaal met `https://velorasecrets.nl/...`.
- [ ] **robots.txt**: open `https://velorasecrets.nl/robots.txt` — de
      `Sitemap:`-regel moet naar `https://velorasecrets.nl/sitemap.xml`
      wijzen.
- [ ] **Favicon en logo's**: laden correct (gebruiken relatieve paden,
      dus domein-onafhankelijk — geen actie nodig).
- [ ] **Betaalmethoden**: doorloop de checkout met minstens 2-3
      verschillende methoden in Mollie's testmodus (iDEAL, creditcard,
      PayPal) — de gekozen methode op onze checkoutpagina stuurt nu
      door naar Mollie's betaalscherm vóór die specifieke methode
      (geen dubbele keuze meer).
- [ ] **PayPal-specifiek**: als je Mollie-account (nog) niet volledig
      geverifieerd is voor PayPal, kan Mollie deze methode tijdelijk
      verbergen in testmodus — dit is een Mollie-accountinstelling,
      geen bug in de code.
- [ ] **Resend-e-mail**: bevestig dat de orderbevestiging na een
      geslaagde testbetaling echt aankomt (zie stap 5 van de
      [productievalidatie-checklist](PRODUCTION-VALIDATION-CHECKLIST.md)).
- [ ] **Analytics** (indien ingeschakeld): controleer in de
      Network-tab dat het juiste script laadt.
- [ ] **Contactformulier**: verstuur een test-bericht via `contact.html`
      en controleer dat het echt binnenkomt op `support@velorasecrets.nl`
      (of het adres in `CONTACT_RECIPIENT_EMAIL`), met het juiste
      onderwerp en met "Beantwoorden" automatisch naar het adres van de
      afzender.
