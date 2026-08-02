/* ============================================================
   assets/config.js — centrale configuratie
   ------------------------------------------------------------
   Enige bron voor instelbare waarden. cart.js, wishlist.js en
   ai.js lezen hieruit — geen enkele module bevat zijn eigen
   hardcoded configuratiewaarden. Wil je bijv. de gratis-
   verzendgrens aanpassen, dan doe je dat op precies één plek.
   Moet als eerste laden, ná products.js, vóór alle andere modules.
   ============================================================ */
window.VELORA_CONFIG = {
  company: {
    name: 'Velora Secrets',
    kvk: '42121511',
    emails: {
      info: 'info@velorasecrets.nl',
      support: 'support@velorasecrets.nl',
      contact: 'contact@velorasecrets.nl',
      sales: 'sales@velorasecrets.nl',
      billing: 'billing@velorasecrets.nl',
      noreply: 'noreply@velorasecrets.nl',
    },
  },
  cart: {
    storageKey: 'velora_demo_cart',
    freeShippingThreshold: 50,
  },
  wishlist: {
    storageKey: 'velora_demo_wishlist',
  },
  recentlyViewed: {
    storageKey: 'velora_demo_recently_viewed',
    maxItems: 8,
  },
  auth: {
    defaultRedirect: 'account.html',
  },
  search: {
    recentSearchesStorageKey: 'velora_demo_recent_searches',
    maxRecentSearches: 5,
    popularSearches: ['Vibrator', 'Lingerie', 'Cadeau', 'Massage olie', 'Bondage', 'Koppels'],
  },
  discounts: {
    storageKey: 'velora_demo_discount',
    /* Validatie is nu een simpele lookup — later te vervangen door bv.
       een API-aanroep, zonder dat cart.html of discount.js hoeft te
       veranderen: alleen deze tabel (of de validatiefunctie in
       discount.js) hoeft dan aangepast te worden. */
    codes: {
      WELKOM10: { type: 'percent', value: 10, label: '10% korting toegepast' },
      VELORA5: { type: 'fixed', value: 5, label: '€5 korting toegepast' },
    },
  },
  checkout: {
    /* Verzend- en betaalopties zijn hier configuratie, geen logica —
       een nieuwe methode toevoegen is één regel, geen code-wijziging
       in checkout-page.js. */
    shippingMethods: [
      { id: 'standard', label: 'Standaard verzending', description: '2-3 werkdagen', price: 3.95 },
      { id: 'express', label: 'Expresslevering', description: 'Voor 22:00 besteld, morgen in huis', price: 6.95 },
    ],
    paymentMethods: [
      { id: 'ideal', label: 'iDEAL' },
      { id: 'creditcard', label: 'Creditcard / Debitcard', cardBrands: ['Visa', 'Mastercard', 'American Express', 'Maestro'] },
      { id: 'paypal', label: 'PayPal' },
      { id: 'applepay', label: 'Apple Pay' },
      { id: 'googlepay', label: 'Google Pay' },
      { id: 'bancontact', label: 'Bancontact' },
      { id: 'klarna', label: 'Klarna — achteraf betalen' },
    ],
  },
  ai: {
    answers: [
      { kw: ['verzend', 'verzond', 'bezorg', 'levertijd', 'discreet', 'logo'], a: 'Alles wordt verzonden in neutrale verpakking zonder logo. Op je bankafschrift zie je alleen "Velora Secrets". Bekijk het volledige <a href="shipping.html">verzendbeleid</a> voor levertijden en kosten.' },
      { kw: ['retour', 'terugsturen'], a: 'Je hebt 30 dagen bedenktijd. Ongeopende, verzegelde producten kun je gratis retourneren. Alle stappen staan in ons <a href="returns.html">retourbeleid</a>.' },
      { kw: ['betal', 'betaal', 'ideal'], a: 'Je kunt veilig en versleuteld betalen via iDEAL, creditcard, PayPal, Apple Pay, Google Pay, Bancontact en Klarna.' },
      { kw: ['cadeau'], a: 'Leuk! Zoek je iets voor haar, hem of een koppel? Vertel me iets meer, dan denk ik gericht mee.' },
      { kw: ['vergelijk'], a: 'Noem de twee producten die je wilt vergelijken, dan zet ik de belangrijkste verschillen op een rij.' },
      { kw: ['voor haar', 'vrouw'], a: 'Bekijk onze volledige collectie <a href="collection.html?category=Voor+Haar">Voor Haar</a>.' },
      { kw: ['voor hem', 'man'], a: 'Bekijk onze volledige collectie <a href="collection.html?category=Voor+Hem">Voor Hem</a>.' },
      { kw: ['koppel', 'samen'], a: 'Bekijk onze volledige collectie <a href="collection.html?category=Voor+Koppels">Voor Koppels</a>.' },
      { kw: ['lingerie'], a: 'Bekijk onze volledige <a href="collection.html?category=Lingerie">lingeriecollectie</a>.' },
      { kw: ['bdsm'], a: 'Bekijk onze volledige <a href="collection.html?category=BDSM">BDSM-collectie</a>.' },
      { kw: ['massage', 'wellness'], a: 'Bekijk onze volledige <a href="collection.html?category=Wellness+%26+Massage">Wellness & Massage-collectie</a>.' },
      { kw: ['leeftijd', '18+'], a: 'Onze producten zijn uitsluitend voor volwassenen. Meer informatie staat in ons <a href="age-policy.html">leeftijdsbeleid</a>.' },
    ],
    fallbackAnswer: 'Dat is een goede vraag — in de volledige webshop zoek ik dit soort antwoorden live op in je productcatalogus. Wil je dat ik je help zoeken in onze categorieën?',
    /* Stapsgewijze keuzehulp (Fase 4). Elke stap: key (waar het
       antwoord onder wordt opgeslagen), question, en options (label
       + waarde die naar veloraGetAdvisorRecommendations gaat). Een
       stap toevoegen/wijzigen raakt nooit ai.js zelf. */
    advisorSteps: [
      {
        key: 'purpose', question: 'Is dit voor jezelf, of als cadeau?',
        options: [
          { label: 'Voor mezelf', value: 'zelf' },
          { label: 'Als cadeau', value: 'cadeau' },
        ],
      },
      {
        key: 'experience', question: 'Wat is je ervaring?',
        options: [
          { label: 'Ik ben nieuw hierin', value: 'beginner' },
          { label: 'Ik heb al ervaring', value: 'gevorderd' },
          { label: 'Maakt niet uit', value: 'geen voorkeur' },
        ],
      },
      {
        key: 'budget', question: 'Wat is je budget?',
        options: [
          { label: 'Tot €25', value: [0, 25] },
          { label: '€25 – €50', value: [25, 50] },
          { label: 'Vanaf €50', value: [50, 999] },
          { label: 'Maakt niet uit', value: null },
        ],
      },
      {
        key: 'usage', question: 'Gebruik je het liever solo of samen?',
        options: [
          { label: 'Solo', value: 'solo' },
          { label: 'Samen', value: 'samen' },
          { label: 'Beide', value: 'beide' },
        ],
      },
      {
        key: 'wantsQuiet', question: 'Is een stil geluidsniveau belangrijk voor je?',
        options: [
          { label: 'Ja, erg belangrijk', value: true },
          { label: 'Maakt me niet uit', value: false },
        ],
      },
      {
        key: 'wantsWaterproof', question: 'Is waterdichtheid een must?',
        options: [
          { label: 'Ja', value: true },
          { label: 'Maakt me niet uit', value: false },
        ],
      },
    ],
  },
};
