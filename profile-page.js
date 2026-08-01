/* ============================================================
   assets/products.js — gedeelde productcatalogus voor de demo
   Eén bron van waarheid: homepage, collectiepagina en
   productpagina lezen allemaal uit dezelfde lijst.

   AUDIT-FIX: veloraFmt (prijsopmaak) stond eerder in main.js, maar
   op index.html werd het inline productrail-script vóór main.js
   geladen — waardoor window.veloraFmt nog niet bestond op het
   moment dat het werd aangeroepen ("fmt is not a function").
   Nu hier gedefinieerd, in het bestand dat op elke pagina
   gegarandeerd als allereerste laadt, dus onafhankelijk van de
   volgorde van de overige scripts.
   ============================================================ */
window.veloraFmt = function (n) {
  return '€' + n.toFixed(2).replace('.', ',');
};

window.VELORA_PRODUCTS = [
  { id: 1, handle: 'luxe-satijnen-kimono', title: 'Luxe Satijnen Kimono', vendor: 'Velora Secrets', category: 'Lingerie', price: 49.95, compareAt: null, badge: 'Bestseller', rating: 4.8, reviews: 126 },
  { id: 2, handle: 'discrete-wellness-massageset', title: 'Discrete Wellness Massageset', vendor: 'Velora Secrets', category: 'Wellness & Massage', price: 34.5, compareAt: 44.5, badge: 'Sale', rating: 4.7, reviews: 98 },
  { id: 3, handle: 'premium-silicone-collectie', title: 'Premium Silicone Collectie', vendor: 'Velora Secrets', category: 'Voor Haar', price: 59.0, compareAt: null, badge: 'Nieuw', rating: 4.9, reviews: 54 },
  { id: 4, handle: 'verwarmende-massage-olie-duo', title: 'Verwarmende Massage-olie Duo', vendor: 'Velora Secrets', category: 'Wellness & Massage', price: 24.95, compareAt: null, badge: null, rating: 4.6, reviews: 73 },
  { id: 5, handle: 'kanten-lingerieset-rosa', title: 'Kanten Lingerieset "Rosa"', vendor: 'Velora Secrets', category: 'Lingerie', price: 39.95, compareAt: null, badge: 'Bestseller', rating: 4.8, reviews: 141 },
  { id: 6, handle: 'fluwelen-oogmasker-veertje', title: 'Fluwelen Oogmasker & Veertje', vendor: 'Velora Secrets', category: 'Voor Koppels', price: 19.95, compareAt: null, badge: null, rating: 4.5, reviews: 39 },
  { id: 7, handle: 'discrete-reisvriendelijke-massager', title: 'Discrete Reisvriendelijke Massager', vendor: 'Velora Secrets', category: 'Voor Haar', price: 44.95, compareAt: null, badge: 'Nieuw', rating: 4.7, reviews: 62 },
  { id: 8, handle: 'heren-boxerset-premium-katoen', title: 'Heren Boxerset Premium Katoen', vendor: 'Velora Secrets', category: 'Voor Hem', price: 29.95, compareAt: 34.95, badge: 'Sale', rating: 4.6, reviews: 47 },
  { id: 9, handle: 'verstelbare-bondage-set-zacht', title: 'Verstelbare Bondage Set met Zachte Boeien', vendor: 'Velora Secrets', category: 'BDSM', price: 39.95, compareAt: null, badge: 'Nieuw', rating: 4.7, reviews: 28 },
  { id: 10, handle: 'fluwelen-zweep-beginners', title: 'Fluwelen Zweep — Beginnersset', vendor: 'Velora Secrets', category: 'BDSM', price: 24.95, compareAt: null, badge: null, rating: 4.5, reviews: 19 },
  { id: 11, handle: 'afstandsbediende-koppelvibrator', title: 'Afstandsbediende Koppelvibrator', vendor: 'Velora Secrets', category: 'Voor Koppels', price: 54.95, compareAt: null, badge: 'Bestseller', rating: 4.8, reviews: 87 },
  { id: 12, handle: 'rollenspel-kaartenset-voor-twee', title: 'Rollenspel Kaartenset voor Twee', vendor: 'Velora Secrets', category: 'Voor Koppels', price: 19.95, compareAt: null, badge: null, rating: 4.4, reviews: 22 },
  { id: 13, handle: 'kanten-body-set-noir', title: 'Kanten Body Set "Noir"', vendor: 'Velora Secrets', category: 'Lingerie', price: 44.95, compareAt: null, badge: null, rating: 4.7, reviews: 51 },
  { id: 14, handle: 'discrete-clitorisstimulator', title: 'Discrete Clitorisstimulator', vendor: 'Velora Secrets', category: 'Voor Haar', price: 49.95, compareAt: null, badge: 'Nieuw', rating: 4.8, reviews: 33 },
  { id: 15, handle: 'prostaatstimulator-starter', title: 'Prostaatstimulator Starter', vendor: 'Velora Secrets', category: 'Voor Hem', price: 34.95, compareAt: null, badge: null, rating: 4.5, reviews: 24 },
  { id: 16, handle: 'aromatische-massagekaars', title: 'Aromatische Massagekaars', vendor: 'Velora Secrets', category: 'Wellness & Massage', price: 22.95, compareAt: null, badge: null, rating: 4.6, reviews: 41 },
  { id: 100, handle: "satisfyer-luchtdrukvibrator-pro", title: "Satisfyer Luchtdrukvibrator Pro", vendor: "Satisfyer", category: "Voor Haar", price: 47.2, compareAt: 55.6, badge: "Sale", rating: 4.4, reviews: 197 },
  { id: 101, handle: "womanizer-curve-vibrator-mini", title: "Womanizer Curve vibrator Mini", vendor: "Womanizer", category: "Voor Haar", price: 107.3, compareAt: null, badge: null, rating: 4.4, reviews: 203 },
  { id: 102, handle: "lelo-rabbit-vibrator-comfort", title: "LELO Rabbit vibrator Comfort", vendor: "LELO", category: "Voor Haar", price: 95.15, compareAt: null, badge: null, rating: 4.5, reviews: 149 },
  { id: 103, handle: "wevibe-realistische-dildo-classic", title: "We-Vibe Realistische dildo Classic", vendor: "We-Vibe", category: "Voor Haar", price: 88.95, compareAt: null, badge: null, rating: 4.4, reviews: 98 },
  { id: 104, handle: "lovense-kegelballenset-deluxe", title: "Lovense Kegelballenset Deluxe", vendor: "Lovense", category: "Voor Haar", price: 29.85, compareAt: null, badge: null, rating: 4.9, reviews: 171 },
  { id: 105, handle: "fun-factory-clitorisstimulator-20", title: "Fun Factory Clitorisstimulator 2.0", vendor: "Fun Factory", category: "Voor Haar", price: 33.0, compareAt: null, badge: "Bestseller", rating: 4.9, reviews: 191 },
  { id: 106, handle: "easyglide-gspot-vibrator", title: "EasyGlide G-spot vibrator", vendor: "EasyGlide", category: "Voor Haar", price: 13.9, compareAt: null, badge: null, rating: 4.8, reviews: 110 },
  { id: 107, handle: "calexotics-dualmotor-vibrator-comfort", title: "CalExotics Dual-motor vibrator Comfort", vendor: "CalExotics", category: "Voor Haar", price: 17.9, compareAt: null, badge: null, rating: 4.8, reviews: 10 },
  { id: 108, handle: "satisfyer-siliconen-dildo-classic", title: "Satisfyer Siliconen dildo Classic", vendor: "Satisfyer", category: "Voor Haar", price: 54.1, compareAt: null, badge: null, rating: 4.6, reviews: 35 },
  { id: 109, handle: "womanizer-appgestuurde-kegeltrainer", title: "Womanizer App-gestuurde kegeltrainer", vendor: "Womanizer", category: "Voor Haar", price: 123.85, compareAt: null, badge: null, rating: 4.6, reviews: 36 },
  { id: 110, handle: "lelo-minivibrator-20", title: "LELO Mini-vibrator 2.0", vendor: "LELO", category: "Voor Haar", price: 127.3, compareAt: null, badge: null, rating: 4.8, reviews: 184 },
  { id: 111, handle: "wevibe-comehither-vibrator-deluxe", title: "We-Vibe Come-hither vibrator Deluxe", vendor: "We-Vibe", category: "Voor Haar", price: 71.8, compareAt: null, badge: null, rating: 4.7, reviews: 66 },
  { id: 112, handle: "lovense-rabbit-vibrator-plus", title: "Lovense Rabbit vibrator Plus", vendor: "Lovense", category: "Voor Haar", price: 40.35, compareAt: 50.3, badge: "Sale", rating: 4.6, reviews: 193 },
  { id: 113, handle: "fun-factory-glazen-dildo-20", title: "Fun Factory Glazen dildo 2.0", vendor: "Fun Factory", category: "Voor Haar", price: 38.95, compareAt: null, badge: null, rating: 4.7, reviews: 173 },
  { id: 114, handle: "easyglide-kegelballenset-20", title: "EasyGlide Kegelballenset 2.0", vendor: "EasyGlide", category: "Voor Haar", price: 12.7, compareAt: null, badge: null, rating: 4.8, reviews: 27 },
  { id: 115, handle: "calexotics-bullet-vibrator-mini", title: "CalExotics Bullet vibrator Mini", vendor: "CalExotics", category: "Voor Haar", price: 16.05, compareAt: null, badge: null, rating: 4.8, reviews: 23 },
  { id: 116, handle: "satisfyer-curve-vibrator", title: "Satisfyer Curve vibrator", vendor: "Satisfyer", category: "Voor Haar", price: 44.8, compareAt: null, badge: null, rating: 4.4, reviews: 63 },
  { id: 117, handle: "womanizer-dualmotor-vibrator", title: "Womanizer Dual-motor vibrator", vendor: "Womanizer", category: "Voor Haar", price: 66.75, compareAt: null, badge: null, rating: 4.3, reviews: 55 },
  { id: 118, handle: "lelo-realistische-dildo-premium", title: "LELO Realistische dildo Premium", vendor: "LELO", category: "Voor Haar", price: 124.65, compareAt: null, badge: null, rating: 4.3, reviews: 167 },
  { id: 119, handle: "wevibe-appgestuurde-kegeltrainer-deluxe", title: "We-Vibe App-gestuurde kegeltrainer Deluxe", vendor: "We-Vibe", category: "Voor Haar", price: 82.65, compareAt: null, badge: "Bestseller", rating: 4.8, reviews: 188 },
  { id: 120, handle: "fun-factory-pocket-masturbator-deluxe", title: "Fun Factory Pocket masturbator Deluxe", vendor: "Fun Factory", category: "Voor Hem", price: 45.55, compareAt: null, badge: null, rating: 4.6, reviews: 72 },
  { id: 121, handle: "fifty-shades-of-grey-siliconen-cockringset-classic", title: "Fifty Shades of Grey Siliconen cockring-set Classic", vendor: "Fifty Shades of Grey", category: "Voor Hem", price: 29.8, compareAt: null, badge: null, rating: 4.7, reviews: 151 },
  { id: 122, handle: "durex-prostaatstimulator-mini", title: "Durex Prostaatstimulator Mini", vendor: "Durex", category: "Voor Hem", price: 16.4, compareAt: null, badge: "Nieuw", rating: 4.5, reviews: 18 },
  { id: 123, handle: "calexotics-reinigingsspray-20", title: "CalExotics Reinigingsspray 2.0", vendor: "CalExotics", category: "Voor Hem", price: 24.55, compareAt: null, badge: null, rating: 4.9, reviews: 68 },
  { id: 124, handle: "satisfyer-automatische-masturbator-classic", title: "Satisfyer Automatische masturbator Classic", vendor: "Satisfyer", category: "Voor Hem", price: 49.55, compareAt: null, badge: null, rating: 4.4, reviews: 176 },
  { id: 125, handle: "lelo-siliconen-cockringset", title: "LELO Siliconen cockring-set", vendor: "LELO", category: "Voor Hem", price: 79.8, compareAt: null, badge: "Nieuw", rating: 4.8, reviews: 74 },
  { id: 126, handle: "fun-factory-prostaatstimulator-premium", title: "Fun Factory Prostaatstimulator Premium", vendor: "Fun Factory", category: "Voor Hem", price: 44.85, compareAt: null, badge: "Bestseller", rating: 4.8, reviews: 137 },
  { id: 127, handle: "fifty-shades-of-grey-reinigingsspray-20", title: "Fifty Shades of Grey Reinigingsspray 2.0", vendor: "Fifty Shades of Grey", category: "Voor Hem", price: 45.25, compareAt: null, badge: null, rating: 4.7, reviews: 85 },
  { id: 128, handle: "durex-realistische-masturbator-premium", title: "Durex Realistische masturbator Premium", vendor: "Durex", category: "Voor Hem", price: 16.9, compareAt: null, badge: null, rating: 4.4, reviews: 129 },
  { id: 129, handle: "calexotics-siliconen-cockringset-classic", title: "CalExotics Siliconen cockring-set Classic", vendor: "CalExotics", category: "Voor Hem", price: 13.3, compareAt: null, badge: "Bestseller", rating: 4.3, reviews: 70 },
  { id: 130, handle: "satisfyer-prostaatstimulator-deluxe", title: "Satisfyer Prostaatstimulator Deluxe", vendor: "Satisfyer", category: "Voor Hem", price: 29.4, compareAt: null, badge: null, rating: 4.8, reviews: 205 },
  { id: 131, handle: "lelo-reinigingsspray-plus", title: "LELO Reinigingsspray Plus", vendor: "LELO", category: "Voor Hem", price: 89.2, compareAt: null, badge: null, rating: 4.7, reviews: 151 },
  { id: 132, handle: "fun-factory-pocket-masturbator-classic", title: "Fun Factory Pocket masturbator Classic", vendor: "Fun Factory", category: "Voor Hem", price: 32.0, compareAt: null, badge: null, rating: 4.8, reviews: 28 },
  { id: 133, handle: "fifty-shades-of-grey-siliconen-cockringset", title: "Fifty Shades of Grey Siliconen cockring-set", vendor: "Fifty Shades of Grey", category: "Voor Hem", price: 38.95, compareAt: null, badge: "Nieuw", rating: 4.8, reviews: 107 },
  { id: 134, handle: "durex-prostaatstimulator-20", title: "Durex Prostaatstimulator 2.0", vendor: "Durex", category: "Voor Hem", price: 18.0, compareAt: null, badge: null, rating: 4.8, reviews: 64 },
  { id: 135, handle: "calexotics-reinigingsspray-mini", title: "CalExotics Reinigingsspray Mini", vendor: "CalExotics", category: "Voor Hem", price: 22.55, compareAt: null, badge: null, rating: 4.9, reviews: 144 },
  { id: 136, handle: "satisfyer-automatische-masturbator-20", title: "Satisfyer Automatische masturbator 2.0", vendor: "Satisfyer", category: "Voor Hem", price: 32.5, compareAt: null, badge: "Nieuw", rating: 4.3, reviews: 146 },
  { id: 137, handle: "lelo-siliconen-cockringset-deluxe", title: "LELO Siliconen cockring-set Deluxe", vendor: "LELO", category: "Voor Hem", price: 89.85, compareAt: 109.95, badge: "Sale", rating: 4.7, reviews: 199 },
  { id: 138, handle: "fun-factory-prostaatstimulator-20", title: "Fun Factory Prostaatstimulator 2.0", vendor: "Fun Factory", category: "Voor Hem", price: 36.85, compareAt: null, badge: null, rating: 4.3, reviews: 184 },
  { id: 139, handle: "fifty-shades-of-grey-reinigingsspray-comfort", title: "Fifty Shades of Grey Reinigingsspray Comfort", vendor: "Fifty Shades of Grey", category: "Voor Hem", price: 46.15, compareAt: null, badge: null, rating: 4.7, reviews: 174 },
  { id: 140, handle: "durex-realistische-masturbator-premium-2", title: "Durex Realistische masturbator Premium 2", vendor: "Durex", category: "Voor Hem", price: 22.75, compareAt: null, badge: null, rating: 4.4, reviews: 123 },
  { id: 141, handle: "calexotics-siliconen-cockringset-classic-2", title: "CalExotics Siliconen cockring-set Classic 2", vendor: "CalExotics", category: "Voor Hem", price: 18.3, compareAt: null, badge: null, rating: 4.4, reviews: 69 },
  { id: 142, handle: "wevibe-koppelvibrator-plus", title: "We-Vibe Koppelvibrator Plus", vendor: "We-Vibe", category: "Voor Koppels", price: 77.0, compareAt: null, badge: null, rating: 4.4, reviews: 177 },
  { id: 143, handle: "lovense-fantasie-dobbelstenenset-comfort", title: "Lovense Fantasie dobbelstenenset Comfort", vendor: "Lovense", category: "Voor Koppels", price: 33.1, compareAt: 38.85, badge: "Sale", rating: 4.4, reviews: 38 },
  { id: 144, handle: "lelo-massageset-voor-twee-classic", title: "LELO Massageset voor twee Classic", vendor: "LELO", category: "Voor Koppels", price: 128.5, compareAt: null, badge: null, rating: 4.5, reviews: 100 },
  { id: 145, handle: "fun-factory-koppelvibrator-mini", title: "Fun Factory Koppelvibrator Mini", vendor: "Fun Factory", category: "Voor Koppels", price: 44.1, compareAt: null, badge: null, rating: 4.4, reviews: 11 },
  { id: 146, handle: "durex-rollenspel-kaartenset-mini", title: "Durex Rollenspel kaartenset Mini", vendor: "Durex", category: "Voor Koppels", price: 22.1, compareAt: null, badge: null, rating: 4.4, reviews: 71 },
  { id: 147, handle: "wevibe-warmende-glijmiddelduo-mini", title: "We-Vibe Warmende glijmiddel-duo Mini", vendor: "We-Vibe", category: "Voor Koppels", price: 55.15, compareAt: null, badge: null, rating: 4.7, reviews: 82 },
  { id: 148, handle: "lovense-koppelvibrator-deluxe", title: "Lovense Koppelvibrator Deluxe", vendor: "Lovense", category: "Voor Koppels", price: 37.7, compareAt: null, badge: null, rating: 4.7, reviews: 76 },
  { id: 149, handle: "lelo-fantasie-dobbelstenenset-classic", title: "LELO Fantasie dobbelstenenset Classic", vendor: "LELO", category: "Voor Koppels", price: 87.9, compareAt: null, badge: null, rating: 4.5, reviews: 111 },
  { id: 150, handle: "fun-factory-massageset-voor-twee-classic", title: "Fun Factory Massageset voor twee Classic", vendor: "Fun Factory", category: "Voor Koppels", price: 25.75, compareAt: 33.1, badge: "Sale", rating: 4.8, reviews: 158 },
  { id: 151, handle: "durex-koppelvibrator-classic", title: "Durex Koppelvibrator Classic", vendor: "Durex", category: "Voor Koppels", price: 12.65, compareAt: null, badge: null, rating: 4.7, reviews: 133 },
  { id: 152, handle: "wevibe-rollenspel-kaartenset", title: "We-Vibe Rollenspel kaartenset", vendor: "We-Vibe", category: "Voor Koppels", price: 89.6, compareAt: null, badge: "Nieuw", rating: 4.6, reviews: 167 },
  { id: 153, handle: "lovense-warmende-glijmiddelduo-comfort", title: "Lovense Warmende glijmiddel-duo Comfort", vendor: "Lovense", category: "Voor Koppels", price: 51.4, compareAt: null, badge: null, rating: 4.3, reviews: 169 },
  { id: 154, handle: "lelo-koppelvibrator-classic", title: "LELO Koppelvibrator Classic", vendor: "LELO", category: "Voor Koppels", price: 93.1, compareAt: 122.6, badge: "Sale", rating: 4.9, reviews: 70 },
  { id: 155, handle: "fun-factory-fantasie-dobbelstenenset-premium", title: "Fun Factory Fantasie dobbelstenenset Premium", vendor: "Fun Factory", category: "Voor Koppels", price: 51.05, compareAt: null, badge: null, rating: 4.4, reviews: 106 },
  { id: 156, handle: "durex-massageset-voor-twee-mini", title: "Durex Massageset voor twee Mini", vendor: "Durex", category: "Voor Koppels", price: 17.4, compareAt: null, badge: "Nieuw", rating: 4.6, reviews: 159 },
  { id: 157, handle: "wevibe-koppelvibrator-mini", title: "We-Vibe Koppelvibrator Mini", vendor: "We-Vibe", category: "Voor Koppels", price: 85.7, compareAt: null, badge: null, rating: 4.4, reviews: 128 },
  { id: 158, handle: "lovense-rollenspel-kaartenset-20", title: "Lovense Rollenspel kaartenset 2.0", vendor: "Lovense", category: "Voor Koppels", price: 53.55, compareAt: null, badge: null, rating: 4.8, reviews: 132 },
  { id: 159, handle: "lelo-warmende-glijmiddelduo-plus", title: "LELO Warmende glijmiddel-duo Plus", vendor: "LELO", category: "Voor Koppels", price: 112.0, compareAt: null, badge: null, rating: 4.4, reviews: 50 },
  { id: 160, handle: "fun-factory-koppelvibrator-comfort", title: "Fun Factory Koppelvibrator Comfort", vendor: "Fun Factory", category: "Voor Koppels", price: 44.1, compareAt: null, badge: null, rating: 4.7, reviews: 127 },
  { id: 161, handle: "durex-fantasie-dobbelstenenset-classic", title: "Durex Fantasie dobbelstenenset Classic", vendor: "Durex", category: "Voor Koppels", price: 24.85, compareAt: 33.45, badge: "Sale", rating: 4.7, reviews: 78 },
  { id: 162, handle: "obsessive-kanten-lingerieset-deluxe", title: "Obsessive Kanten lingerieset Deluxe", vendor: "Obsessive", category: "Lingerie", price: 43.15, compareAt: null, badge: null, rating: 4.7, reviews: 166 },
  { id: 163, handle: "leg-avenue-corset-met-kousenbanden-classic", title: "Leg Avenue Corset met kousenbanden Classic", vendor: "Leg Avenue", category: "Lingerie", price: 48.6, compareAt: null, badge: "Nieuw", rating: 4.5, reviews: 41 },
  { id: 164, handle: "velora-secrets-kanten-handschoenen-premium", title: "Velora Secrets Kanten handschoenen Premium", vendor: "Velora Secrets", category: "Lingerie", price: 40.9, compareAt: null, badge: null, rating: 4.8, reviews: 73 },
  { id: 165, handle: "obsessive-satijnen-kimono-classic", title: "Obsessive Satijnen kimono Classic", vendor: "Obsessive", category: "Lingerie", price: 41.05, compareAt: null, badge: null, rating: 4.7, reviews: 180 },
  { id: 166, handle: "leg-avenue-mesh-lingerieset", title: "Leg Avenue Mesh lingerieset", vendor: "Leg Avenue", category: "Lingerie", price: 34.8, compareAt: null, badge: null, rating: 4.7, reviews: 170 },
  { id: 167, handle: "velora-secrets-basque-set-mini", title: "Velora Secrets Basque set Mini", vendor: "Velora Secrets", category: "Lingerie", price: 51.5, compareAt: null, badge: null, rating: 4.8, reviews: 165 },
  { id: 168, handle: "obsessive-jarretelgordel-plus", title: "Obsessive Jarretelgordel Plus", vendor: "Obsessive", category: "Lingerie", price: 44.85, compareAt: null, badge: null, rating: 4.7, reviews: 13 },
  { id: 169, handle: "leg-avenue-slaapjurk-classic", title: "Leg Avenue Slaapjurk Classic", vendor: "Leg Avenue", category: "Lingerie", price: 50.7, compareAt: null, badge: "Bestseller", rating: 4.4, reviews: 72 },
  { id: 170, handle: "velora-secrets-satijnen-lingerieset-pro", title: "Velora Secrets Satijnen lingerieset Pro", vendor: "Velora Secrets", category: "Lingerie", price: 30.2, compareAt: null, badge: "Nieuw", rating: 4.7, reviews: 142 },
  { id: 171, handle: "obsessive-kanten-body-deluxe", title: "Obsessive Kanten body Deluxe", vendor: "Obsessive", category: "Lingerie", price: 53.3, compareAt: null, badge: "Nieuw", rating: 4.8, reviews: 176 },
  { id: 172, handle: "leg-avenue-kousen-met-naad-plus", title: "Leg Avenue Kousen met naad Plus", vendor: "Leg Avenue", category: "Lingerie", price: 39.65, compareAt: null, badge: null, rating: 4.3, reviews: 28 },
  { id: 173, handle: "velora-secrets-peignoir-set-premium", title: "Velora Secrets Peignoir set Premium", vendor: "Velora Secrets", category: "Lingerie", price: 36.4, compareAt: null, badge: null, rating: 4.5, reviews: 137 },
  { id: 174, handle: "obsessive-kanten-lingerieset-comfort", title: "Obsessive Kanten lingerieset Comfort", vendor: "Obsessive", category: "Lingerie", price: 26.95, compareAt: null, badge: null, rating: 4.4, reviews: 32 },
  { id: 175, handle: "leg-avenue-corset-met-kousenbanden-20", title: "Leg Avenue Corset met kousenbanden 2.0", vendor: "Leg Avenue", category: "Lingerie", price: 51.0, compareAt: null, badge: null, rating: 4.9, reviews: 161 },
  { id: 176, handle: "velora-secrets-kanten-handschoenen-deluxe", title: "Velora Secrets Kanten handschoenen Deluxe", vendor: "Velora Secrets", category: "Lingerie", price: 49.15, compareAt: null, badge: null, rating: 4.9, reviews: 167 },
  { id: 177, handle: "obsessive-satijnen-kimono-premium", title: "Obsessive Satijnen kimono Premium", vendor: "Obsessive", category: "Lingerie", price: 35.5, compareAt: null, badge: "Bestseller", rating: 4.4, reviews: 176 },
  { id: 178, handle: "leg-avenue-mesh-lingerieset-mini", title: "Leg Avenue Mesh lingerieset Mini", vendor: "Leg Avenue", category: "Lingerie", price: 47.6, compareAt: null, badge: "Nieuw", rating: 4.3, reviews: 121 },
  { id: 179, handle: "velora-secrets-basque-set-pro", title: "Velora Secrets Basque set Pro", vendor: "Velora Secrets", category: "Lingerie", price: 31.1, compareAt: null, badge: null, rating: 4.8, reviews: 203 },
  { id: 180, handle: "obsessive-jarretelgordel-20", title: "Obsessive Jarretelgordel 2.0", vendor: "Obsessive", category: "Lingerie", price: 33.65, compareAt: null, badge: null, rating: 4.9, reviews: 51 },
  { id: 181, handle: "leg-avenue-slaapjurk-mini", title: "Leg Avenue Slaapjurk Mini", vendor: "Leg Avenue", category: "Lingerie", price: 32.05, compareAt: null, badge: "Bestseller", rating: 4.4, reviews: 162 },
  { id: 182, handle: "velora-secrets-satijnen-lingerieset-comfort", title: "Velora Secrets Satijnen lingerieset Comfort", vendor: "Velora Secrets", category: "Lingerie", price: 45.4, compareAt: null, badge: null, rating: 4.7, reviews: 167 },
  { id: 183, handle: "obsessive-kanten-body-classic", title: "Obsessive Kanten body Classic", vendor: "Obsessive", category: "Lingerie", price: 42.7, compareAt: null, badge: null, rating: 4.3, reviews: 126 },
  { id: 184, handle: "fifty-shades-of-grey-bondagetouwset", title: "Fifty Shades of Grey Bondagetouwset", vendor: "Fifty Shades of Grey", category: "BDSM", price: 36.5, compareAt: null, badge: null, rating: 4.9, reviews: 197 },
  { id: 185, handle: "doc-johnson-leren-paddle-plus", title: "Doc Johnson Leren paddle Plus", vendor: "Doc Johnson", category: "BDSM", price: 40.1, compareAt: null, badge: "Bestseller", rating: 4.4, reviews: 120 },
  { id: 186, handle: "velora-secrets-fetish-handschoenen-premium", title: "Velora Secrets Fetish handschoenen Premium", vendor: "Velora Secrets", category: "BDSM", price: 20.15, compareAt: null, badge: "Nieuw", rating: 4.7, reviews: 93 },
  { id: 187, handle: "fifty-shades-of-grey-bondage-beginnersset-mini", title: "Fifty Shades of Grey Bondage beginnersset Mini", vendor: "Fifty Shades of Grey", category: "BDSM", price: 34.95, compareAt: null, badge: null, rating: 4.4, reviews: 97 },
  { id: 188, handle: "doc-johnson-verstelbare-boeienset-deluxe", title: "Doc Johnson Verstelbare boeienset Deluxe", vendor: "Doc Johnson", category: "BDSM", price: 54.95, compareAt: null, badge: "Bestseller", rating: 4.5, reviews: 209 },
  { id: 189, handle: "velora-secrets-ticklersset-classic", title: "Velora Secrets Ticklers-set Classic", vendor: "Velora Secrets", category: "BDSM", price: 21.25, compareAt: null, badge: null, rating: 4.4, reviews: 69 },
  { id: 190, handle: "fifty-shades-of-grey-latex-masker-comfort", title: "Fifty Shades of Grey Latex masker Comfort", vendor: "Fifty Shades of Grey", category: "BDSM", price: 38.8, compareAt: 47.6, badge: "Sale", rating: 4.6, reviews: 49 },
  { id: 191, handle: "doc-johnson-bondage-beginnersset", title: "Doc Johnson Bondage beginnersset", vendor: "Doc Johnson", category: "BDSM", price: 53.0, compareAt: null, badge: null, rating: 4.6, reviews: 39 },
  { id: 192, handle: "velora-secrets-spreidstok-premium", title: "Velora Secrets Spreidstok Premium", vendor: "Velora Secrets", category: "BDSM", price: 23.9, compareAt: null, badge: null, rating: 4.5, reviews: 103 },
  { id: 193, handle: "fifty-shades-of-grey-fluwelen-zweep-premium", title: "Fifty Shades of Grey Fluwelen zweep Premium", vendor: "Fifty Shades of Grey", category: "BDSM", price: 48.7, compareAt: null, badge: "Bestseller", rating: 4.5, reviews: 128 },
  { id: 194, handle: "doc-johnson-leren-harnas", title: "Doc Johnson Leren harnas", vendor: "Doc Johnson", category: "BDSM", price: 53.15, compareAt: null, badge: null, rating: 4.6, reviews: 206 },
  { id: 195, handle: "velora-secrets-bondage-beginnersset-plus", title: "Velora Secrets Bondage beginnersset Plus", vendor: "Velora Secrets", category: "BDSM", price: 11.6, compareAt: null, badge: null, rating: 4.7, reviews: 12 },
  { id: 196, handle: "fifty-shades-of-grey-bondagetouwset-plus", title: "Fifty Shades of Grey Bondagetouwset Plus", vendor: "Fifty Shades of Grey", category: "BDSM", price: 40.65, compareAt: null, badge: null, rating: 4.9, reviews: 147 },
  { id: 197, handle: "doc-johnson-leren-paddle-plus-2", title: "Doc Johnson Leren paddle Plus 2", vendor: "Doc Johnson", category: "BDSM", price: 35.3, compareAt: null, badge: null, rating: 4.7, reviews: 205 },
  { id: 198, handle: "velora-secrets-fetish-handschoenen-comfort", title: "Velora Secrets Fetish handschoenen Comfort", vendor: "Velora Secrets", category: "BDSM", price: 19.45, compareAt: null, badge: null, rating: 4.3, reviews: 206 },
  { id: 199, handle: "fifty-shades-of-grey-bondage-beginnersset", title: "Fifty Shades of Grey Bondage beginnersset", vendor: "Fifty Shades of Grey", category: "BDSM", price: 39.15, compareAt: null, badge: "Nieuw", rating: 4.7, reviews: 81 },
  { id: 200, handle: "doc-johnson-verstelbare-boeienset-20", title: "Doc Johnson Verstelbare boeienset 2.0", vendor: "Doc Johnson", category: "BDSM", price: 47.25, compareAt: null, badge: null, rating: 4.5, reviews: 55 },
  { id: 201, handle: "velora-secrets-ticklersset-pro", title: "Velora Secrets Ticklers-set Pro", vendor: "Velora Secrets", category: "BDSM", price: 20.85, compareAt: null, badge: null, rating: 4.7, reviews: 119 },
  { id: 202, handle: "fifty-shades-of-grey-latex-masker-mini", title: "Fifty Shades of Grey Latex masker Mini", vendor: "Fifty Shades of Grey", category: "BDSM", price: 53.55, compareAt: null, badge: "Bestseller", rating: 4.7, reviews: 208 },
  { id: 203, handle: "doc-johnson-bondage-beginnersset-mini", title: "Doc Johnson Bondage beginnersset Mini", vendor: "Doc Johnson", category: "BDSM", price: 40.85, compareAt: null, badge: null, rating: 4.7, reviews: 71 },
  { id: 204, handle: "pjur-verwarmende-massageolie-classic", title: "Pjur Verwarmende massageolie Classic", vendor: "Pjur", category: "Wellness & Massage", price: 45.75, compareAt: null, badge: null, rating: 4.4, reviews: 42 },
  { id: 205, handle: "easyglide-siliconenbasis-glijmiddel-premium", title: "EasyGlide Siliconenbasis glijmiddel Premium", vendor: "EasyGlide", category: "Wellness & Massage", price: 19.95, compareAt: null, badge: null, rating: 4.6, reviews: 82 },
  { id: 206, handle: "bijoux-indiscrets-handmassageroller", title: "Bijoux Indiscrets Handmassageroller", vendor: "Bijoux Indiscrets", category: "Wellness & Massage", price: 42.1, compareAt: null, badge: null, rating: 4.9, reviews: 41 },
  { id: 207, handle: "velora-secrets-etherische-olieset-plus", title: "Velora Secrets Etherische olieset Plus", vendor: "Velora Secrets", category: "Wellness & Massage", price: 11.85, compareAt: null, badge: null, rating: 4.3, reviews: 127 },
  { id: 208, handle: "pjur-aromatische-massageolie-pro", title: "Pjur Aromatische massageolie Pro", vendor: "Pjur", category: "Wellness & Massage", price: 49.9, compareAt: null, badge: null, rating: 4.5, reviews: 49 },
  { id: 209, handle: "easyglide-warming-glijmiddel-classic", title: "EasyGlide Warming glijmiddel Classic", vendor: "EasyGlide", category: "Wellness & Massage", price: 11.85, compareAt: null, badge: null, rating: 4.6, reviews: 136 },
  { id: 210, handle: "bijoux-indiscrets-handmassageroller-comfort", title: "Bijoux Indiscrets Handmassageroller Comfort", vendor: "Bijoux Indiscrets", category: "Wellness & Massage", price: 27.15, compareAt: null, badge: "Nieuw", rating: 4.6, reviews: 131 },
  { id: 211, handle: "velora-secrets-etherische-olieset-mini", title: "Velora Secrets Etherische olieset Mini", vendor: "Velora Secrets", category: "Wellness & Massage", price: 21.35, compareAt: null, badge: null, rating: 4.4, reviews: 69 },
  { id: 212, handle: "pjur-eetbare-massageolie-20", title: "Pjur Eetbare massageolie 2.0", vendor: "Pjur", category: "Wellness & Massage", price: 32.4, compareAt: null, badge: null, rating: 4.4, reviews: 91 },
  { id: 213, handle: "easyglide-waterbasis-glijmiddel-plus", title: "EasyGlide Waterbasis glijmiddel Plus", vendor: "EasyGlide", category: "Wellness & Massage", price: 24.15, compareAt: null, badge: null, rating: 4.9, reviews: 63 },
  { id: 214, handle: "bijoux-indiscrets-handmassageroller-20", title: "Bijoux Indiscrets Handmassageroller 2.0", vendor: "Bijoux Indiscrets", category: "Wellness & Massage", price: 28.95, compareAt: 35.4, badge: "Sale", rating: 4.5, reviews: 19 },
  { id: 215, handle: "velora-secrets-etherische-olieset", title: "Velora Secrets Etherische olieset", vendor: "Velora Secrets", category: "Wellness & Massage", price: 14.15, compareAt: null, badge: null, rating: 4.7, reviews: 38 },
  { id: 216, handle: "pjur-verwarmende-massageolie-deluxe", title: "Pjur Verwarmende massageolie Deluxe", vendor: "Pjur", category: "Wellness & Massage", price: 43.0, compareAt: null, badge: null, rating: 4.3, reviews: 17 },
  { id: 217, handle: "easyglide-siliconenbasis-glijmiddel-premium-2", title: "EasyGlide Siliconenbasis glijmiddel Premium 2", vendor: "EasyGlide", category: "Wellness & Massage", price: 23.9, compareAt: null, badge: null, rating: 4.5, reviews: 165 },
  { id: 218, handle: "bijoux-indiscrets-handmassageroller-pro", title: "Bijoux Indiscrets Handmassageroller Pro", vendor: "Bijoux Indiscrets", category: "Wellness & Massage", price: 36.0, compareAt: null, badge: null, rating: 4.9, reviews: 157 },
  { id: 219, handle: "velora-secrets-etherische-olieset-deluxe", title: "Velora Secrets Etherische olieset Deluxe", vendor: "Velora Secrets", category: "Wellness & Massage", price: 20.75, compareAt: null, badge: null, rating: 4.4, reviews: 169 },
  { id: 220, handle: "pjur-aromatische-massageolie-20", title: "Pjur Aromatische massageolie 2.0", vendor: "Pjur", category: "Wellness & Massage", price: 45.65, compareAt: null, badge: null, rating: 4.8, reviews: 128 },
  { id: 221, handle: "easyglide-warming-glijmiddel-mini", title: "EasyGlide Warming glijmiddel Mini", vendor: "EasyGlide", category: "Wellness & Massage", price: 16.85, compareAt: null, badge: null, rating: 4.6, reviews: 181 },
  { id: 222, handle: "bijoux-indiscrets-handmassageroller-plus", title: "Bijoux Indiscrets Handmassageroller Plus", vendor: "Bijoux Indiscrets", category: "Wellness & Massage", price: 42.15, compareAt: null, badge: null, rating: 4.8, reviews: 109 },
  { id: 223, handle: "velora-secrets-etherische-olieset-comfort", title: "Velora Secrets Etherische olieset Comfort", vendor: "Velora Secrets", category: "Wellness & Massage", price: 13.15, compareAt: null, badge: null, rating: 4.5, reviews: 151 },
  { id: 224, handle: "pjur-eetbare-massageolie-mini", title: "Pjur Eetbare massageolie Mini", vendor: "Pjur", category: "Wellness & Massage", price: 25.1, compareAt: null, badge: null, rating: 4.9, reviews: 112 },
];

window.VELORA_PRODUCT_DETAIL = {
  description:
    'Ontworpen met aandacht voor detail en gemaakt van hoogwaardige, huidvriendelijke materialen. Dit product combineert comfort met verfijnde afwerking, zodat het net zo prettig aanvoelt als het eruitziet.',
  specs: [
    ['Materiaal', 'Premium siliconen, huidvriendelijk en hypoallergeen'],
    ['Waterbestendig', 'Ja, volledig afneembaar te reinigen'],
    ['Geluidsniveau', 'Fluisterstil'],
    ['Levering', 'Discreet verpakt, geen productomschrijving zichtbaar'],
  ],
};

/* Unieke, per-product beschrijving — gegenereerd uit echte productdata
   (merk, subcategorie, materiaal- en eigenschap-tags), dus nooit
   verzonnen claims. Ontbreekt een product hier (zou niet moeten
   gebeuren), dan valt product-page.js terug op de generieke tekst
   hierboven. */
window.VELORA_DESCRIPTIONS = {
  1: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze kimono's-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  2: "Met oog voor comfort ontworpen door Velora Secrets — dit product uit onze massagesets-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Discreet verpakt en snel bij je thuisbezorgd.",
  3: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Gemaakt om keer op keer met plezier te gebruiken.",
  4: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  5: "Doordacht vormgegeven door Velora Secrets — dit product uit onze lingeriesets-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Discreet verpakt en snel bij je thuisbezorgd.",
  6: "Doordacht vormgegeven door Velora Secrets — dit product uit onze accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  7: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  8: "Met oog voor comfort ontworpen door Velora Secrets — dit product uit onze ondergoed-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  9: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  10: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Gemaakt om keer op keer met plezier te gebruiken.",
  11: "Met oog voor comfort ontworpen door Velora Secrets — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Discreet verpakt en snel bij je thuisbezorgd.",
  12: "Doordacht vormgegeven door Velora Secrets — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Discreet verpakt en snel bij je thuisbezorgd.",
  13: "Zorgvuldig samengesteld door Velora Secrets — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Gemaakt om keer op keer met plezier te gebruiken.",
  14: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Gemaakt om keer op keer met plezier te gebruiken.",
  15: "Doordacht vormgegeven door Velora Secrets — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  16: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze ontspanningsrituelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardige materialen die lang meegaan. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  100: "Ontworpen met aandacht voor detail door Satisfyer — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  101: "Zorgvuldig samengesteld door Womanizer — dit product uit onze g-spot vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  102: "Met oog voor comfort ontworpen door LELO — dit product uit onze rabbit vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig vegan, zonder dierlijke materialen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  103: "Doordacht vormgegeven door We-Vibe — dit product uit onze dildo's-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Discreet verpakt en snel bij je thuisbezorgd.",
  104: "Doordacht vormgegeven door Lovense — dit product uit onze kegelballen-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  105: "Doordacht vormgegeven door Fun Factory — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  106: "Ontworpen met aandacht voor detail door EasyGlide — dit product uit onze g-spot vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Gemaakt om keer op keer met plezier te gebruiken.",
  107: "Doordacht vormgegeven door CalExotics — dit product uit onze rabbit vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  108: "Vakkundig ontwikkeld door Satisfyer — dit product uit onze dildo's-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig vegan, zonder dierlijke materialen. Discreet verpakt en snel bij je thuisbezorgd.",
  109: "Doordacht vormgegeven door Womanizer — dit product uit onze kegelballen-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Discreet verpakt en snel bij je thuisbezorgd.",
  110: "Doordacht vormgegeven door LELO — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Discreet verpakt en snel bij je thuisbezorgd.",
  111: "Doordacht vormgegeven door We-Vibe — dit product uit onze g-spot vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  112: "Met oog voor comfort ontworpen door Lovense — dit product uit onze rabbit vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Gemaakt om keer op keer met plezier te gebruiken.",
  113: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze dildo's-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  114: "Met oog voor comfort ontworpen door EasyGlide — dit product uit onze kegelballen-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  115: "Met oog voor comfort ontworpen door CalExotics — dit product uit onze vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  116: "Vakkundig ontwikkeld door Satisfyer — dit product uit onze g-spot vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  117: "Zorgvuldig samengesteld door Womanizer — dit product uit onze rabbit vibrators-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  118: "Ontworpen met aandacht voor detail door LELO — dit product uit onze dildo's-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Gemaakt om keer op keer met plezier te gebruiken.",
  119: "Vakkundig ontwikkeld door We-Vibe — dit product uit onze kegelballen-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  120: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  121: "Met oog voor comfort ontworpen door Fifty Shades of Grey — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  122: "Doordacht vormgegeven door Durex — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  123: "Ontworpen met aandacht voor detail door CalExotics — dit product uit onze verzorging-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  124: "Met oog voor comfort ontworpen door Satisfyer — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  125: "Vakkundig ontwikkeld door LELO — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  126: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  127: "Ontworpen met aandacht voor detail door Fifty Shades of Grey — dit product uit onze verzorging-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Discreet verpakt en snel bij je thuisbezorgd.",
  128: "Doordacht vormgegeven door Durex — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Gemaakt om keer op keer met plezier te gebruiken.",
  129: "Vakkundig ontwikkeld door CalExotics — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien compact genoeg om overal mee naartoe te nemen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  130: "Vakkundig ontwikkeld door Satisfyer — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  131: "Met oog voor comfort ontworpen door LELO — dit product uit onze verzorging-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  132: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  133: "Ontworpen met aandacht voor detail door Fifty Shades of Grey — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  134: "Met oog voor comfort ontworpen door Durex — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  135: "Ontworpen met aandacht voor detail door CalExotics — dit product uit onze verzorging-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  136: "Doordacht vormgegeven door Satisfyer — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  137: "Vakkundig ontwikkeld door LELO — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  138: "Vakkundig ontwikkeld door Fun Factory — dit product uit onze prostaat & anaal-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Discreet verpakt en snel bij je thuisbezorgd.",
  139: "Met oog voor comfort ontworpen door Fifty Shades of Grey — dit product uit onze verzorging-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  140: "Zorgvuldig samengesteld door Durex — dit product uit onze masturbators-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  141: "Ontworpen met aandacht voor detail door CalExotics — dit product uit onze cockringen-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  142: "Ontworpen met aandacht voor detail door We-Vibe — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  143: "Vakkundig ontwikkeld door Lovense — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  144: "Zorgvuldig samengesteld door LELO — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  145: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  146: "Ontworpen met aandacht voor detail door Durex — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  147: "Met oog voor comfort ontworpen door We-Vibe — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  148: "Doordacht vormgegeven door Lovense — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  149: "Zorgvuldig samengesteld door LELO — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  150: "Doordacht vormgegeven door Fun Factory — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  151: "Met oog voor comfort ontworpen door Durex — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  152: "Met oog voor comfort ontworpen door We-Vibe — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  153: "Zorgvuldig samengesteld door Lovense — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Discreet verpakt en snel bij je thuisbezorgd.",
  154: "Zorgvuldig samengesteld door LELO — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  155: "Zorgvuldig samengesteld door Fun Factory — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien volledig vegan, zonder dierlijke materialen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  156: "Ontworpen met aandacht voor detail door Durex — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  157: "Doordacht vormgegeven door We-Vibe — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  158: "Vakkundig ontwikkeld door Lovense — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien compact genoeg om overal mee naartoe te nemen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  159: "Ontworpen met aandacht voor detail door LELO — dit product uit onze ontspanning samen-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  160: "Met oog voor comfort ontworpen door Fun Factory — dit product uit onze samen spelen-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Gemaakt om keer op keer met plezier te gebruiken.",
  161: "Vakkundig ontwikkeld door Durex — dit product uit onze rollenspel-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  162: "Doordacht vormgegeven door Obsessive — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  163: "Zorgvuldig samengesteld door Leg Avenue — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Gemaakt om keer op keer met plezier te gebruiken.",
  164: "Doordacht vormgegeven door Velora Secrets — dit product uit onze kousen & accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig vegan, zonder dierlijke materialen. Discreet verpakt en snel bij je thuisbezorgd.",
  165: "Met oog voor comfort ontworpen door Obsessive — dit product uit onze nachtkleding-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  166: "Met oog voor comfort ontworpen door Leg Avenue — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  167: "Met oog voor comfort ontworpen door Velora Secrets — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  168: "Ontworpen met aandacht voor detail door Obsessive — dit product uit onze kousen & accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien volledig vegan, zonder dierlijke materialen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  169: "Met oog voor comfort ontworpen door Leg Avenue — dit product uit onze nachtkleding-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Discreet verpakt en snel bij je thuisbezorgd.",
  170: "Zorgvuldig samengesteld door Velora Secrets — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Discreet verpakt en snel bij je thuisbezorgd.",
  171: "Zorgvuldig samengesteld door Obsessive — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  172: "Zorgvuldig samengesteld door Leg Avenue — dit product uit onze kousen & accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien compact genoeg om overal mee naartoe te nemen. Discreet verpakt en snel bij je thuisbezorgd.",
  173: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze nachtkleding-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Gemaakt om keer op keer met plezier te gebruiken.",
  174: "Ontworpen met aandacht voor detail door Obsessive — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Discreet verpakt en snel bij je thuisbezorgd.",
  175: "Ontworpen met aandacht voor detail door Leg Avenue — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Gemaakt om keer op keer met plezier te gebruiken.",
  176: "Zorgvuldig samengesteld door Velora Secrets — dit product uit onze kousen & accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  177: "Ontworpen met aandacht voor detail door Obsessive — dit product uit onze nachtkleding-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  178: "Doordacht vormgegeven door Leg Avenue — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Discreet verpakt en snel bij je thuisbezorgd.",
  179: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  180: "Doordacht vormgegeven door Obsessive — dit product uit onze kousen & accessoires-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig vegan, zonder dierlijke materialen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  181: "Zorgvuldig samengesteld door Leg Avenue — dit product uit onze nachtkleding-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  182: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze sets-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  183: "Vakkundig ontwikkeld door Obsessive — dit product uit onze body's & corsets-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  184: "Ontworpen met aandacht voor detail door Fifty Shades of Grey — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Discreet verpakt en snel bij je thuisbezorgd.",
  185: "Met oog voor comfort ontworpen door Doc Johnson — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien compact genoeg om overal mee naartoe te nemen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  186: "Met oog voor comfort ontworpen door Velora Secrets — dit product uit onze fetish wear-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien oplaadbaar via USB, dus geen wegwerpbatterijen nodig. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  187: "Vakkundig ontwikkeld door Fifty Shades of Grey — dit product uit onze beginnerssets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Discreet verpakt en snel bij je thuisbezorgd.",
  188: "Zorgvuldig samengesteld door Doc Johnson — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien compact genoeg om overal mee naartoe te nemen. Discreet verpakt en snel bij je thuisbezorgd.",
  189: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  190: "Met oog voor comfort ontworpen door Fifty Shades of Grey — dit product uit onze fetish wear-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien volledig vegan, zonder dierlijke materialen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  191: "Doordacht vormgegeven door Doc Johnson — dit product uit onze beginnerssets-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Discreet verpakt en snel bij je thuisbezorgd.",
  192: "Zorgvuldig samengesteld door Velora Secrets — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Gemaakt om keer op keer met plezier te gebruiken.",
  193: "Vakkundig ontwikkeld door Fifty Shades of Grey — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig vegan, zonder dierlijke materialen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  194: "Doordacht vormgegeven door Doc Johnson — dit product uit onze fetish wear-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  195: "Doordacht vormgegeven door Velora Secrets — dit product uit onze beginnerssets-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht satijn met een subtiele glans. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  196: "Ontworpen met aandacht voor detail door Fifty Shades of Grey — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  197: "Doordacht vormgegeven door Doc Johnson — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  198: "Zorgvuldig samengesteld door Velora Secrets — dit product uit onze fetish wear-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  199: "Zorgvuldig samengesteld door Fifty Shades of Grey — dit product uit onze beginnerssets-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Gemaakt om keer op keer met plezier te gebruiken.",
  200: "Doordacht vormgegeven door Doc Johnson — dit product uit onze bondage-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Gemaakt om keer op keer met plezier te gebruiken.",
  201: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze impact play-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  202: "Doordacht vormgegeven door Fifty Shades of Grey — dit product uit onze fetish wear-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  203: "Zorgvuldig samengesteld door Doc Johnson — dit product uit onze beginnerssets-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  204: "Zorgvuldig samengesteld door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  205: "Doordacht vormgegeven door EasyGlide — dit product uit onze glijmiddel-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig vegan, zonder dierlijke materialen. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  206: "Vakkundig ontwikkeld door Bijoux Indiscrets — dit product uit onze massagetools-selectie valt op door de zorgvuldige afwerking. Gemaakt van gepolijst glas met een gladde, luxueuze afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Discreet verpakt en snel bij je thuisbezorgd.",
  207: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze geur & sfeer-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  208: "Met oog voor comfort ontworpen door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  209: "Zorgvuldig samengesteld door EasyGlide — dit product uit onze glijmiddel-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien compact genoeg om overal mee naartoe te nemen. Gemaakt om keer op keer met plezier te gebruiken.",
  210: "Vakkundig ontwikkeld door Bijoux Indiscrets — dit product uit onze massagetools-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  211: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze geur & sfeer-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  212: "Ontworpen met aandacht voor detail door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  213: "Ontworpen met aandacht voor detail door EasyGlide — dit product uit onze glijmiddel-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  214: "Met oog voor comfort ontworpen door Bijoux Indiscrets — dit product uit onze massagetools-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  215: "Vakkundig ontwikkeld door Velora Secrets — dit product uit onze geur & sfeer-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien volledig waterbestendig, ideaal voor gebruik onder de douche of in bad. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  216: "Met oog voor comfort ontworpen door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van verfijnd kant dat comfort en stijl combineert. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Gemaakt om keer op keer met plezier te gebruiken.",
  217: "Doordacht vormgegeven door EasyGlide — dit product uit onze glijmiddel-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Discreet verpakt en snel bij je thuisbezorgd.",
  218: "Met oog voor comfort ontworpen door Bijoux Indiscrets — dit product uit onze massagetools-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  219: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze geur & sfeer-selectie valt op door de zorgvuldige afwerking. Gemaakt van flexibel latex met een strakke, tweede-huid-pasvorm. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Discreet verpakt en snel bij je thuisbezorgd.",
  220: "Met oog voor comfort ontworpen door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van huidvriendelijke siliconen die zacht aanvoelen en eenvoudig te reinigen zijn. Bovendien hypoallergeen materiaal, geschikt voor een gevoelige huid. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  221: "Met oog voor comfort ontworpen door EasyGlide — dit product uit onze glijmiddel-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien compact genoeg om overal mee naartoe te nemen. Zoals bij alles van Velora Secrets: kwaliteit die je voelt vanaf het eerste gebruik.",
  222: "Met oog voor comfort ontworpen door Bijoux Indiscrets — dit product uit onze massagetools-selectie valt op door de zorgvuldige afwerking. Gemaakt van hoogwaardig leer met een stevige, duurzame afwerking. Bovendien volledig vegan, zonder dierlijke materialen. Een aanwinst die het verschil maakt in kwaliteit en comfort.",
  223: "Ontworpen met aandacht voor detail door Velora Secrets — dit product uit onze geur & sfeer-selectie valt op door de zorgvuldige afwerking. Gemaakt van ademende mesh-stof voor een speelse, comfortabele pasvorm. Bovendien opvallend stil in gebruik, zodat je privacy gewaarborgd blijft. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
  224: "Met oog voor comfort ontworpen door Pjur — dit product uit onze massageolie-selectie valt op door de zorgvuldige afwerking. Gemaakt van zacht fluweel dat warm en luxueus aanvoelt. Bovendien te bedienen via een app, ook handig voor gebruik op afstand. Verpakt in neutrale verpakking, zoals je van ons gewend bent.",
};

/* ============================================================
   Fase 2 — additieve uitbreiding (variants, reviews, related)
   ------------------------------------------------------------
   Bewust als LOSSE, met product-ID geïndexeerde objecten toegevoegd
   i.p.v. de vorm van VELORA_PRODUCTS zelf te wijzigen — zo blijft
   alle bestaande code die over VELORA_PRODUCTS itereert exact
   werken zoals voorheen.
   ============================================================ */

/* Varianten per product-ID. type bepaalt het label ("Maat"/"Kleur"/
   "Inhoud"); ontbreekt een product hier, dan heeft het geen varianten. */
window.VELORA_VARIANTS = {
  1: { type: 'size', label: 'Maat', options: ['S', 'M', 'L', 'XL'] },
  5: { type: 'size', label: 'Maat', options: ['S', 'M', 'L', 'XL'] },
  8: { type: 'size', label: 'Maat', options: ['S', 'M', 'L', 'XL'] },
  2: { type: 'volume', label: 'Inhoud', options: ['100 ml', '250 ml'] },
  4: { type: 'volume', label: 'Inhoud', options: ['50 ml', '100 ml'] },
  3: { type: 'color', label: 'Kleur', options: ['Roze', 'Paars', 'Zwart'] },
  7: { type: 'color', label: 'Kleur', options: ['Roze', 'Zwart'] },
};

/* Reviews per product-ID. photo:true toont een stijlvolle placeholder
   i.p.v. een echte (niet-beschikbare) klantfoto — consistent met hoe
   ontbrekende productafbeeldingen elders in de site al worden opgelost. */
window.VELORA_REVIEWS = {
  1: [
    { author: 'Merel V.', rating: 5, photo: true, date: '3 weken geleden', text: 'Voelt echt luxe aan en de pasvorm is perfect. Discreet geleverd, precies zoals beloofd.' },
    { author: 'Anoniem', rating: 5, photo: false, date: '1 maand geleden', text: 'Kwaliteit overtreft de prijs. Zou zo weer bestellen.' },
    { author: 'Sanne K.', rating: 4, photo: true, date: '2 maanden geleden', text: 'Mooi materiaal, maat valt iets ruim uit — houd daar rekening mee.' },
  ],
  2: [
    { author: 'Thomas B.', rating: 5, photo: false, date: '2 weken geleden', text: 'Heerlijk voor een ontspannen avond samen. Ruikt subtiel, niet overweldigend.' },
    { author: 'Anoniem', rating: 4, photo: true, date: '1 maand geleden', text: 'Goede set, had graag een grotere fles gehad maar verder top.' },
  ],
  3: [
    { author: 'Anoniem', rating: 5, photo: true, date: '1 week geleden', text: 'Precies de kwaliteit die ik zocht. Stil en fijn materiaal.' },
    { author: 'Iris D.', rating: 5, photo: false, date: '3 weken geleden', text: 'Verrast door hoe zacht en toch stevig het aanvoelt.' },
  ],
  5: [
    { author: 'Anoniem', rating: 5, photo: true, date: '4 dagen geleden', text: 'Prachtige set, voelt duur aan. Geeft echt zelfvertrouwen.' },
    { author: 'Femke R.', rating: 5, photo: false, date: '1 maand geleden', text: 'Kant is niet kriebelig zoals bij andere merken. Aanrader.' },
  ],
  8: [
    { author: 'Daan P.', rating: 4, photo: false, date: '2 weken geleden', text: 'Prettige stof, goede pasvorm. Wasvoorschrift duidelijk vermeld.' },
  ],
  9: [
    { author: 'Anoniem', rating: 5, photo: true, date: '1 week geleden', text: 'Perfect voor beginners, de zachte boeien voelen echt comfortabel aan.' },
    { author: 'Kim R.', rating: 4, photo: false, date: '3 weken geleden', text: 'Fijne kwaliteit, duidelijke instructies erbij.' },
  ],
  11: [
    { author: 'Anoniem', rating: 5, photo: true, date: '4 dagen geleden', text: 'De app werkt verrassend soepel en het is echt stil. Aanrader voor koppels op afstand.' },
    { author: 'Lotte &amp; Bram', rating: 5, photo: false, date: '2 weken geleden', text: 'Heeft onze avonden een leuke twist gegeven. Snel opgeladen ook.' },
  ],

  100: [
    { author: "Roos", rating: 4, photo: false, date: "2 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
  102: [
    { author: "Nina", rating: 4, photo: true, date: "3 dagen geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  106: [
    { author: "Roos", rating: 5, photo: false, date: "1 maand geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  109: [
    { author: "Thomas B.", rating: 5, photo: true, date: "1 week geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Tess", rating: 5, photo: false, date: "3 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  117: [
    { author: "Merel V.", rating: 5, photo: false, date: "3 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Bram", rating: 5, photo: false, date: "2 weken geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." },
    { author: "Lotte", rating: 5, photo: false, date: "2 weken geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  119: [
    { author: "Iris D.", rating: 5, photo: false, date: "1 week geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  123: [
    { author: "Kim R.", rating: 5, photo: false, date: "3 dagen geleden", text: "Werkt beter dan verwacht, echt een aanrader." },
    { author: "Merel V.", rating: 5, photo: false, date: "1 maand geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  125: [
    { author: "Sanne K.", rating: 5, photo: true, date: "1 week geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Merel V.", rating: 5, photo: false, date: "3 weken geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Daan P.", rating: 5, photo: false, date: "2 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  131: [
    { author: "Milan", rating: 5, photo: true, date: "2 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Tess", rating: 4, photo: false, date: "3 dagen geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  135: [
    { author: "Femke R.", rating: 4, photo: false, date: "2 weken geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." },
    { author: "Milan", rating: 5, photo: false, date: "1 maand geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  136: [
    { author: "Iris D.", rating: 4, photo: false, date: "3 dagen geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  138: [
    { author: "Sven", rating: 4, photo: false, date: "2 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Roos", rating: 5, photo: false, date: "2 weken geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  140: [
    { author: "Sven", rating: 5, photo: false, date: "3 weken geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  145: [
    { author: "Julia", rating: 5, photo: false, date: "3 dagen geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." }
  ],
  146: [
    { author: "Roos", rating: 5, photo: false, date: "3 dagen geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Sanne K.", rating: 4, photo: true, date: "2 weken geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Thomas B.", rating: 4, photo: false, date: "3 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
  151: [
    { author: "Tess", rating: 5, photo: true, date: "1 maand geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Merel V.", rating: 5, photo: false, date: "2 weken geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Sanne K.", rating: 5, photo: true, date: "3 dagen geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  153: [
    { author: "Milan", rating: 4, photo: true, date: "1 week geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  154: [
    { author: "Lotte", rating: 4, photo: false, date: "2 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Tess", rating: 4, photo: false, date: "1 maand geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Bram", rating: 5, photo: true, date: "1 maand geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  159: [
    { author: "Roos", rating: 5, photo: true, date: "1 week geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." },
    { author: "Femke R.", rating: 4, photo: true, date: "1 maand geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Kim R.", rating: 5, photo: true, date: "1 week geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." }
  ],
  160: [
    { author: "Lotte", rating: 5, photo: true, date: "1 week geleden", text: "Werkt beter dan verwacht, echt een aanrader." },
    { author: "Tess", rating: 4, photo: false, date: "3 weken geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  164: [
    { author: "Julia", rating: 5, photo: false, date: "1 maand geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
  166: [
    { author: "Sanne K.", rating: 4, photo: false, date: "3 weken geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." },
    { author: "Julia", rating: 5, photo: false, date: "3 weken geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  167: [
    { author: "Sanne K.", rating: 5, photo: false, date: "2 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Julia", rating: 5, photo: false, date: "3 dagen geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  168: [
    { author: "Kim R.", rating: 5, photo: true, date: "3 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
  173: [
    { author: "Milan", rating: 5, photo: false, date: "3 dagen geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Roos", rating: 5, photo: true, date: "2 weken geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." }
  ],
  175: [
    { author: "Sven", rating: 5, photo: false, date: "2 weken geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  177: [
    { author: "Milan", rating: 5, photo: false, date: "2 weken geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Bram", rating: 5, photo: false, date: "3 dagen geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." }
  ],
  178: [
    { author: "Sanne K.", rating: 5, photo: true, date: "3 weken geleden", text: "Werkt beter dan verwacht, echt een aanrader." },
    { author: "Nina", rating: 4, photo: false, date: "3 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
  179: [
    { author: "Kim R.", rating: 5, photo: false, date: "2 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Julia", rating: 4, photo: false, date: "1 maand geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Bram", rating: 5, photo: false, date: "1 maand geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  180: [
    { author: "Julia", rating: 5, photo: false, date: "2 weken geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Bram", rating: 4, photo: false, date: "1 week geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Sanne K.", rating: 5, photo: false, date: "2 weken geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  184: [
    { author: "Milan", rating: 4, photo: true, date: "2 weken geleden", text: "Goede pasvorm en prettig in gebruik." }
  ],
  187: [
    { author: "Julia", rating: 5, photo: true, date: "3 weken geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Roos", rating: 5, photo: false, date: "2 weken geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Femke R.", rating: 4, photo: false, date: "1 maand geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." }
  ],
  188: [
    { author: "Iris D.", rating: 4, photo: false, date: "3 weken geleden", text: "Kwaliteit overtreft de prijs, zou zo weer bestellen." },
    { author: "Milan", rating: 4, photo: false, date: "1 week geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  200: [
    { author: "Femke R.", rating: 5, photo: false, date: "3 dagen geleden", text: "Precies zoals beschreven, snel en discreet geleverd." },
    { author: "Bram", rating: 5, photo: false, date: "3 weken geleden", text: "Goede pasvorm en prettig in gebruik." },
    { author: "Roos", rating: 4, photo: true, date: "2 weken geleden", text: "Werkt beter dan verwacht, echt een aanrader." }
  ],
  202: [
    { author: "Milan", rating: 5, photo: false, date: "3 dagen geleden", text: "Verpakking was zoals beloofd volledig neutraal." }
  ],
  205: [
    { author: "Iris D.", rating: 4, photo: true, date: "3 dagen geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  209: [
    { author: "Lotte", rating: 4, photo: true, date: "1 maand geleden", text: "Verpakking was zoals beloofd volledig neutraal." },
    { author: "Anoniem", rating: 5, photo: true, date: "3 weken geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Nina", rating: 5, photo: false, date: "1 maand geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  221: [
    { author: "Nina", rating: 4, photo: true, date: "1 maand geleden", text: "Fijn materiaal en goede afwerking." },
    { author: "Tess", rating: 5, photo: false, date: "2 weken geleden", text: "Fijn materiaal en goede afwerking." }
  ],
  223: [
    { author: "Merel V.", rating: 4, photo: false, date: "1 maand geleden", text: "Precies zoals beschreven, snel en discreet geleverd." }
  ],
};

/* Subcategorie + tags + voorraadstatus per product-ID — voor Fase 3
   (zoeken/filteren). Zelfde patroon als VELORA_VARIANTS/VELORA_REVIEWS:
   losse lookup i.p.v. de vorm van VELORA_PRODUCTS zelf te wijzigen. */
window.VELORA_SUBCATEGORY = {
  1: "Kimono's",
  2: 'Massagesets',
  3: 'Vibrators',
  4: 'Massageolie',
  5: 'Lingeriesets',
  6: 'Accessoires',
  7: 'Vibrators',
  8: 'Ondergoed',
  9: 'Bondage',
  10: 'Impact play',
  11: 'Samen spelen',
  12: 'Rollenspel',
  13: "Body's & corsets",
  14: 'Vibrators',
  15: 'Prostaat & anaal',
  16: 'Ontspanningsrituelen',

  100: "Vibrators",
  101: "G-spot vibrators",
  102: "Rabbit vibrators",
  103: "Dildo's",
  104: "Kegelballen",
  105: "Vibrators",
  106: "G-spot vibrators",
  107: "Rabbit vibrators",
  108: "Dildo's",
  109: "Kegelballen",
  110: "Vibrators",
  111: "G-spot vibrators",
  112: "Rabbit vibrators",
  113: "Dildo's",
  114: "Kegelballen",
  115: "Vibrators",
  116: "G-spot vibrators",
  117: "Rabbit vibrators",
  118: "Dildo's",
  119: "Kegelballen",
  120: "Masturbators",
  121: "Cockringen",
  122: "Prostaat & anaal",
  123: "Verzorging",
  124: "Masturbators",
  125: "Cockringen",
  126: "Prostaat & anaal",
  127: "Verzorging",
  128: "Masturbators",
  129: "Cockringen",
  130: "Prostaat & anaal",
  131: "Verzorging",
  132: "Masturbators",
  133: "Cockringen",
  134: "Prostaat & anaal",
  135: "Verzorging",
  136: "Masturbators",
  137: "Cockringen",
  138: "Prostaat & anaal",
  139: "Verzorging",
  140: "Masturbators",
  141: "Cockringen",
  142: "Samen spelen",
  143: "Rollenspel",
  144: "Ontspanning samen",
  145: "Samen spelen",
  146: "Rollenspel",
  147: "Ontspanning samen",
  148: "Samen spelen",
  149: "Rollenspel",
  150: "Ontspanning samen",
  151: "Samen spelen",
  152: "Rollenspel",
  153: "Ontspanning samen",
  154: "Samen spelen",
  155: "Rollenspel",
  156: "Ontspanning samen",
  157: "Samen spelen",
  158: "Rollenspel",
  159: "Ontspanning samen",
  160: "Samen spelen",
  161: "Rollenspel",
  162: "Sets",
  163: "Body's & corsets",
  164: "Kousen & accessoires",
  165: "Nachtkleding",
  166: "Sets",
  167: "Body's & corsets",
  168: "Kousen & accessoires",
  169: "Nachtkleding",
  170: "Sets",
  171: "Body's & corsets",
  172: "Kousen & accessoires",
  173: "Nachtkleding",
  174: "Sets",
  175: "Body's & corsets",
  176: "Kousen & accessoires",
  177: "Nachtkleding",
  178: "Sets",
  179: "Body's & corsets",
  180: "Kousen & accessoires",
  181: "Nachtkleding",
  182: "Sets",
  183: "Body's & corsets",
  184: "Bondage",
  185: "Impact play",
  186: "Fetish wear",
  187: "Beginnerssets",
  188: "Bondage",
  189: "Impact play",
  190: "Fetish wear",
  191: "Beginnerssets",
  192: "Bondage",
  193: "Impact play",
  194: "Fetish wear",
  195: "Beginnerssets",
  196: "Bondage",
  197: "Impact play",
  198: "Fetish wear",
  199: "Beginnerssets",
  200: "Bondage",
  201: "Impact play",
  202: "Fetish wear",
  203: "Beginnerssets",
  204: "Massageolie",
  205: "Glijmiddel",
  206: "Massagetools",
  207: "Geur & sfeer",
  208: "Massageolie",
  209: "Glijmiddel",
  210: "Massagetools",
  211: "Geur & sfeer",
  212: "Massageolie",
  213: "Glijmiddel",
  214: "Massagetools",
  215: "Geur & sfeer",
  216: "Massageolie",
  217: "Glijmiddel",
  218: "Massagetools",
  219: "Geur & sfeer",
  220: "Massageolie",
  221: "Glijmiddel",
  222: "Massagetools",
  223: "Geur & sfeer",
  224: "Massageolie",
};

window.VELORA_TAGS = {
  1: ['zijde', 'cadeau', 'luxe', 'ochtendjas'],
  2: ['olie', 'ontspanning', 'cadeau', 'koppels'],
  3: ['siliconen', 'waterproof', 'stil'],
  4: ['olie', 'verwarmend', 'koppels'],
  5: ['kant', 'cadeau', 'set'],
  6: ['koppels', 'speels', 'accessoire'],
  7: ['reizen', 'compact', 'stil'],
  8: ['katoen', 'comfort', 'set'],
  9: ['bondage', 'beginners', 'zacht', 'set'],
  10: ['impact play', 'beginners', 'zweep'],
  11: ['koppels', 'afstandsbediening', 'app'],
  12: ['koppels', 'rollenspel', 'kaartspel'],
  13: ['kant', 'body', 'set'],
  14: ['siliconen', 'stil', 'compact'],
  15: ['prostaat', 'beginners', 'anaal'],
  16: ['kaars', 'aromatisch', 'ontspanning'],

  100: ["glas", "reisformaat", "app-gestuurd", "voor"],
  101: ["leer", "waterproof", "vegan", "voor"],
  102: ["mesh", "vegan", "hypoallergeen", "voor"],
  103: ["satijn", "hypoallergeen", "oplaadbaar", "voor"],
  104: ["satijn", "hypoallergeen", "oplaadbaar", "voor"],
  105: ["leer", "stil", "hypoallergeen", "voor"],
  106: ["leer", "stil", "vegan", "voor"],
  107: ["glas", "hypoallergeen", "reisformaat", "voor"],
  108: ["mesh", "vegan", "hypoallergeen", "voor"],
  109: ["leer", "vegan", "oplaadbaar", "voor"],
  110: ["satijn", "hypoallergeen", "oplaadbaar", "voor"],
  111: ["satijn", "waterproof", "vegan", "voor"],
  112: ["fluweel", "stil", "app-gestuurd", "voor"],
  113: ["glas", "waterproof", "app-gestuurd", "voor"],
  114: ["fluweel", "vegan", "reisformaat", "voor"],
  115: ["kant", "app-gestuurd", "waterproof", "voor"],
  116: ["siliconen", "reisformaat", "hypoallergeen", "voor"],
  117: ["glas", "reisformaat", "waterproof", "voor"],
  118: ["glas", "waterproof", "reisformaat", "voor"],
  119: ["mesh", "reisformaat", "hypoallergeen", "voor"],
  120: ["siliconen", "waterproof", "hypoallergeen", "voor"],
  121: ["siliconen", "waterproof", "vegan", "voor"],
  122: ["leer", "stil", "hypoallergeen", "voor"],
  123: ["kant", "vegan", "stil", "voor"],
  124: ["satijn", "app-gestuurd", "oplaadbaar", "voor"],
  125: ["kant", "reisformaat", "oplaadbaar", "voor"],
  126: ["mesh", "hypoallergeen", "app-gestuurd", "voor"],
  127: ["latex", "reisformaat", "waterproof", "voor"],
  128: ["kant", "hypoallergeen", "waterproof", "voor"],
  129: ["fluweel", "reisformaat", "waterproof", "voor"],
  130: ["glas", "vegan", "app-gestuurd", "voor"],
  131: ["leer", "vegan", "app-gestuurd", "voor"],
  132: ["kant", "stil", "vegan", "voor"],
  133: ["siliconen", "vegan", "reisformaat", "voor"],
  134: ["fluweel", "stil", "oplaadbaar", "voor"],
  135: ["siliconen", "app-gestuurd", "reisformaat", "voor"],
  136: ["siliconen", "oplaadbaar", "stil", "voor"],
  137: ["glas", "vegan", "stil", "voor"],
  138: ["satijn", "waterproof", "hypoallergeen", "voor"],
  139: ["mesh", "reisformaat", "vegan", "voor"],
  140: ["satijn", "vegan", "app-gestuurd", "voor"],
  141: ["latex", "app-gestuurd", "reisformaat", "voor"],
  142: ["leer", "app-gestuurd", "reisformaat", "voor"],
  143: ["kant", "stil", "vegan", "voor"],
  144: ["kant", "oplaadbaar", "waterproof", "voor"],
  145: ["mesh", "app-gestuurd", "vegan", "voor"],
  146: ["glas", "reisformaat", "app-gestuurd", "voor"],
  147: ["siliconen", "stil", "oplaadbaar", "voor"],
  148: ["kant", "waterproof", "vegan", "voor"],
  149: ["mesh", "reisformaat", "vegan", "voor"],
  150: ["siliconen", "vegan", "hypoallergeen", "voor"],
  151: ["glas", "app-gestuurd", "oplaadbaar", "voor"],
  152: ["fluweel", "hypoallergeen", "app-gestuurd", "voor"],
  153: ["satijn", "hypoallergeen", "stil", "voor"],
  154: ["fluweel", "reisformaat", "stil", "voor"],
  155: ["satijn", "vegan", "app-gestuurd", "voor"],
  156: ["leer", "vegan", "waterproof", "voor"],
  157: ["mesh", "oplaadbaar", "reisformaat", "voor"],
  158: ["siliconen", "reisformaat", "waterproof", "voor"],
  159: ["mesh", "waterproof", "vegan", "voor"],
  160: ["mesh", "hypoallergeen", "reisformaat", "voor"],
  161: ["siliconen", "reisformaat", "hypoallergeen", "voor"],
  162: ["mesh", "hypoallergeen", "vegan", "lingerie"],
  163: ["glas", "oplaadbaar", "vegan", "lingerie"],
  164: ["fluweel", "vegan", "oplaadbaar", "lingerie"],
  165: ["mesh", "reisformaat", "app-gestuurd", "lingerie"],
  166: ["fluweel", "hypoallergeen", "oplaadbaar", "lingerie"],
  167: ["latex", "oplaadbaar", "waterproof", "lingerie"],
  168: ["siliconen", "vegan", "oplaadbaar", "lingerie"],
  169: ["kant", "waterproof", "hypoallergeen", "lingerie"],
  170: ["glas", "hypoallergeen", "waterproof", "lingerie"],
  171: ["mesh", "app-gestuurd", "hypoallergeen", "lingerie"],
  172: ["leer", "reisformaat", "stil", "lingerie"],
  173: ["latex", "waterproof", "hypoallergeen", "lingerie"],
  174: ["leer", "vegan", "stil", "lingerie"],
  175: ["mesh", "oplaadbaar", "waterproof", "lingerie"],
  176: ["siliconen", "reisformaat", "hypoallergeen", "lingerie"],
  177: ["latex", "waterproof", "stil", "lingerie"],
  178: ["latex", "app-gestuurd", "reisformaat", "lingerie"],
  179: ["mesh", "oplaadbaar", "vegan", "lingerie"],
  180: ["fluweel", "vegan", "hypoallergeen", "lingerie"],
  181: ["kant", "vegan", "hypoallergeen", "lingerie"],
  182: ["leer", "vegan", "hypoallergeen", "lingerie"],
  183: ["fluweel", "waterproof", "vegan", "lingerie"],
  184: ["siliconen", "app-gestuurd", "reisformaat", "bdsm"],
  185: ["fluweel", "reisformaat", "vegan", "bdsm"],
  186: ["glas", "oplaadbaar", "waterproof", "bdsm"],
  187: ["mesh", "hypoallergeen", "vegan", "bdsm"],
  188: ["glas", "reisformaat", "vegan", "bdsm"],
  189: ["mesh", "vegan", "app-gestuurd", "bdsm"],
  190: ["satijn", "vegan", "reisformaat", "bdsm"],
  191: ["mesh", "waterproof", "stil", "bdsm"],
  192: ["satijn", "app-gestuurd", "waterproof", "bdsm"],
  193: ["kant", "vegan", "hypoallergeen", "bdsm"],
  194: ["mesh", "stil", "oplaadbaar", "bdsm"],
  195: ["satijn", "hypoallergeen", "stil", "bdsm"],
  196: ["siliconen", "app-gestuurd", "vegan", "bdsm"],
  197: ["leer", "stil", "waterproof", "bdsm"],
  198: ["fluweel", "waterproof", "oplaadbaar", "bdsm"],
  199: ["leer", "vegan", "waterproof", "bdsm"],
  200: ["fluweel", "hypoallergeen", "app-gestuurd", "bdsm"],
  201: ["mesh", "hypoallergeen", "waterproof", "bdsm"],
  202: ["fluweel", "waterproof", "stil", "bdsm"],
  203: ["glas", "waterproof", "hypoallergeen", "bdsm"],
  204: ["glas", "app-gestuurd", "stil", "wellness"],
  205: ["mesh", "vegan", "stil", "wellness"],
  206: ["glas", "waterproof", "oplaadbaar", "wellness"],
  207: ["leer", "stil", "reisformaat", "wellness"],
  208: ["leer", "hypoallergeen", "stil", "wellness"],
  209: ["kant", "reisformaat", "vegan", "wellness"],
  210: ["fluweel", "stil", "oplaadbaar", "wellness"],
  211: ["fluweel", "waterproof", "oplaadbaar", "wellness"],
  212: ["leer", "stil", "vegan", "wellness"],
  213: ["leer", "waterproof", "vegan", "wellness"],
  214: ["latex", "waterproof", "reisformaat", "wellness"],
  215: ["kant", "waterproof", "app-gestuurd", "wellness"],
  216: ["kant", "hypoallergeen", "oplaadbaar", "wellness"],
  217: ["mesh", "reisformaat", "oplaadbaar", "wellness"],
  218: ["mesh", "vegan", "hypoallergeen", "wellness"],
  219: ["latex", "stil", "hypoallergeen", "wellness"],
  220: ["siliconen", "hypoallergeen", "stil", "wellness"],
  221: ["mesh", "reisformaat", "app-gestuurd", "wellness"],
  222: ["leer", "vegan", "stil", "wellness"],
  223: ["mesh", "stil", "waterproof", "wellness"],
  224: ["fluweel", "app-gestuurd", "hypoallergeen", "wellness"],
};

/* true = op voorraad. Bewust één product op false gezet (7), zodat de
   beschikbaarheid-filter ook echt iets te filteren heeft in de demo. */
window.VELORA_AVAILABILITY = {
  1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: false, 8: true,
  9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true,

  100: false,
  101: true,
  102: true,
  103: true,
  104: true,
  105: true,
  106: true,
  107: true,
  108: true,
  109: true,
  110: true,
  111: true,
  112: true,
  113: true,
  114: true,
  115: true,
  116: true,
  117: true,
  118: true,
  119: true,
  120: true,
  121: true,
  122: true,
  123: true,
  124: true,
  125: false,
  126: true,
  127: true,
  128: true,
  129: true,
  130: true,
  131: true,
  132: true,
  133: true,
  134: true,
  135: true,
  136: true,
  137: true,
  138: true,
  139: true,
  140: true,
  141: true,
  142: true,
  143: true,
  144: true,
  145: true,
  146: true,
  147: true,
  148: true,
  149: true,
  150: true,
  151: true,
  152: true,
  153: true,
  154: true,
  155: false,
  156: true,
  157: true,
  158: true,
  159: true,
  160: true,
  161: true,
  162: true,
  163: true,
  164: true,
  165: true,
  166: true,
  167: true,
  168: true,
  169: true,
  170: true,
  171: true,
  172: true,
  173: true,
  174: true,
  175: true,
  176: true,
  177: true,
  178: true,
  179: true,
  180: true,
  181: true,
  182: true,
  183: true,
  184: true,
  185: true,
  186: true,
  187: true,
  188: true,
  189: true,
  190: true,
  191: true,
  192: true,
  193: true,
  194: true,
  195: true,
  196: false,
  197: true,
  198: true,
  199: true,
  200: true,
  201: true,
  202: true,
  203: true,
  204: true,
  205: true,
  206: true,
  207: true,
  208: true,
  209: true,
  210: true,
  211: true,
  212: true,
  213: true,
  214: true,
  215: true,
  216: true,
  217: true,
  218: true,
  219: true,
  220: true,
  221: true,
  222: true,
  223: true,
  224: true,
};

/* Attributen t.b.v. de AI-keuzehulp (Fase 4) — zelfde lookup-patroon.
   experience: 'beginner' | 'gevorderd' | 'alle'
   usage: welke situaties het product past ('solo' en/of 'samen')
   noiseLevel: 'stil' | 'geen' (niet-elektronisch) | 'gemiddeld'
   waterproof: true/false */
window.VELORA_ATTRIBUTES = {
  1: { experience: 'alle', usage: ['solo', 'samen'], noiseLevel: 'geen', waterproof: false },
  2: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  3: { experience: 'alle', usage: ['solo', 'samen'], noiseLevel: 'stil', waterproof: true },
  4: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  5: { experience: 'alle', usage: ['solo', 'samen'], noiseLevel: 'geen', waterproof: false },
  6: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  7: { experience: 'beginner', usage: ['solo'], noiseLevel: 'stil', waterproof: true },
  8: { experience: 'alle', usage: ['solo', 'samen'], noiseLevel: 'geen', waterproof: false },
  9: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  10: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  11: { experience: 'alle', usage: ['samen'], noiseLevel: 'stil', waterproof: true },
  12: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },
  13: { experience: 'alle', usage: ['solo', 'samen'], noiseLevel: 'geen', waterproof: false },
  14: { experience: 'alle', usage: ['solo'], noiseLevel: 'stil', waterproof: true },
  15: { experience: 'beginner', usage: ['solo'], noiseLevel: 'stil', waterproof: true },
  16: { experience: 'beginner', usage: ['samen'], noiseLevel: 'geen', waterproof: false },

  100: { experience: "beginner", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: false },
  101: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  102: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "geen", waterproof: false },
  103: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  104: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  105: { experience: "gevorderd", usage: ["solo"], noiseLevel: "geen", waterproof: false },
  106: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  107: { experience: "alle", usage: ["solo"], noiseLevel: "geen", waterproof: false },
  108: { experience: "alle", usage: ["solo"], noiseLevel: "geen", waterproof: false },
  109: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  110: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  111: { experience: "beginner", usage: ["solo"], noiseLevel: "geen", waterproof: true },
  112: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  113: { experience: "beginner", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: true },
  114: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  115: { experience: "alle", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: true },
  116: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  117: { experience: "alle", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: true },
  118: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  119: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "geen", waterproof: false },
  120: { experience: "alle", usage: ["solo"], noiseLevel: "geen", waterproof: true },
  121: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  122: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  123: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  124: { experience: "beginner", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: false },
  125: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  126: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  127: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  128: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  129: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  130: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  131: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  132: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  133: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  134: { experience: "beginner", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: false },
  135: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  136: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  137: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  138: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  139: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  140: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  141: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  142: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  143: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  144: { experience: "alle", usage: ["samen"], noiseLevel: "geen", waterproof: true },
  145: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  146: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  147: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  148: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  149: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  150: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  151: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "geen", waterproof: false },
  152: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  153: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  154: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  155: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  156: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  157: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  158: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  159: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  160: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  161: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  162: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "gemiddeld", waterproof: false },
  163: { experience: "alle", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: false },
  164: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  165: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  166: { experience: "beginner", usage: ["solo"], noiseLevel: "geen", waterproof: false },
  167: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  168: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "gemiddeld", waterproof: false },
  169: { experience: "alle", usage: ["solo"], noiseLevel: "geen", waterproof: true },
  170: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  171: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  172: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  173: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  174: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  175: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  176: { experience: "alle", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: false },
  177: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  178: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  179: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  180: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  181: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  182: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  183: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  184: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  185: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  186: { experience: "gevorderd", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: true },
  187: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  188: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "gemiddeld", waterproof: false },
  189: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  190: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  191: { experience: "alle", usage: ["samen"], noiseLevel: "geen", waterproof: true },
  192: { experience: "beginner", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  193: { experience: "beginner", usage: ["solo"], noiseLevel: "geen", waterproof: false },
  194: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  195: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "gemiddeld", waterproof: false },
  196: { experience: "gevorderd", usage: ["samen"], noiseLevel: "geen", waterproof: false },
  197: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "gemiddeld", waterproof: true },
  198: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  199: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  200: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  201: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  202: { experience: "alle", usage: ["samen"], noiseLevel: "gemiddeld", waterproof: true },
  203: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  204: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  205: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  206: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  207: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  208: { experience: "alle", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: false },
  209: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "geen", waterproof: false },
  210: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  211: { experience: "alle", usage: ["solo"], noiseLevel: "stil", waterproof: true },
  212: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  213: { experience: "gevorderd", usage: ["samen"], noiseLevel: "stil", waterproof: true },
  214: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  215: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: true },
  216: { experience: "gevorderd", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  217: { experience: "gevorderd", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  218: { experience: "beginner", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  219: { experience: "beginner", usage: ["solo"], noiseLevel: "stil", waterproof: false },
  220: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  221: { experience: "alle", usage: ["samen"], noiseLevel: "stil", waterproof: false },
  222: { experience: "alle", usage: ["solo", "samen"], noiseLevel: "stil", waterproof: false },
  223: { experience: "alle", usage: ["solo"], noiseLevel: "gemiddeld", waterproof: true },
  224: { experience: "alle", usage: ["samen"], noiseLevel: "geen", waterproof: false },
};

/* Merken die Velora Secrets voert — voor de Merken-pagina en de
   merk-filters op collectie-/zoekpagina's. Aantal producten per merk
   wordt live berekend uit VELORA_PRODUCTS (nooit hardcoded, dus nooit
   uit sync). */
window.VELORA_BRANDS = [
  { name: 'Satisfyer', description: 'Innovatieve, betaalbare technologie voor plezier — bekend om de luchtdruktechnologie.' },
  { name: 'Womanizer', description: 'Pionier in drukgolftechnologie, premium kwaliteit met een cultstatus.' },
  { name: 'LELO', description: 'Zweeds luxemerk — verfijnd design, premium materialen, tijdloze kwaliteit.' },
  { name: 'We-Vibe', description: 'Specialist in app-gestuurde koppeltoys, ontworpen om samen te verbinden.' },
  { name: 'Lovense', description: 'Voorloper in connected toys, ideaal voor koppels op afstand.' },
  { name: 'Fun Factory', description: 'Duits designmerk met een breed, kleurrijk assortiment van hoge kwaliteit.' },
  { name: 'Fifty Shades of Grey', description: 'De officiële, toegankelijke BDSM-lijn — perfect voor beginners.' },
  { name: 'EasyGlide', description: 'Betrouwbare, betaalbare glijmiddelen voor dagelijks gebruik.' },
  { name: 'Pjur', description: 'Duitse kwaliteitsglijmiddelen en verzorgingsproducten, dermatologisch getest.' },
  { name: 'Durex', description: 'Wereldwijd vertrouwd merk voor veilig en plezierig intiem contact.' },
  { name: 'CalExotics', description: 'Amerikaans merk met een breed, toegankelijk assortiment voor elk budget.' },
  { name: 'Obsessive', description: 'Pools lingeriemerk, bekend om verfijnd kant en romantisch design.' },
  { name: 'Leg Avenue', description: 'Speelse, kwalitatieve lingerie en kostuums voor elke gelegenheid.' },
  { name: 'Doc Johnson', description: 'Amerikaanse pionier sinds 1976, bekend om innovatief BDSM- en fetish-design.' },
  { name: 'Bijoux Indiscrets', description: 'Spaans designmerk voor sensuele accessoires en wellnessproducten.' },
  { name: 'Velora Secrets', description: 'Ons eigen huismerk — zorgvuldig samengesteld op kwaliteit en discretie.' },
];

/* Publiek: de EN­IGE productkaart-HTML voor rails/grids in de hele site
   (homepage-rails, collectie-/zoekresultatengrid, gerelateerde-producten-
   rails op de productpagina). Was voorheen als bijna-identieke template
   apart aanwezig in index.html, product-page.js, collection-page.js en
   tweemaal in search-page.js — dat is nu allemaal deze ene functie.
   options.showQuickAdd: toont de "In winkelwagen"-knop (grids) of niet
   (compacte rail-kaarten, bv. bij "vaak samen gekocht"). */
window.veloraProductCardHTML = function (p, options = {}) {
  const fmt = window.veloraFmt;
  const showQuickAdd = options.showQuickAdd !== false;
  const wrapInRailItem = options.wrapInRailItem !== false;
  const outOfStock = window.VELORA_AVAILABILITY[p.id] === false;

  const card = `
      <article class="product-card">
        <div class="product-card__media">
          <a href="product.html?id=${p.id}" aria-label="${p.title}" class="product-card__media-link"></a>
          ${p.badge ? `<div class="product-card__badges"><span class="badge ${p.badge === 'Sale' ? 'badge--sale' : 'badge--gold'}">${p.badge}</span></div>` : ''}
          ${outOfStock ? '<div class="product-card__badges" style="left:auto; right:10px;"><span class="badge badge--ink">Uitverkocht</span></div>' : ''}
          <button class="product-card__wishlist" data-wishlist="${p.id}" aria-label="Verlanglijst"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.2C.6 8 2.3 4.5 6 4c2.2-.3 4.1 1 6 3 1.9-2 3.8-3.3 6-3 3.7.5 5.4 4 4 7.8C19.5 16.4 12 21 12 21Z"/></svg></button>
          ${showQuickAdd ? `<button class="product-card__quick-add" data-add-to-cart='${JSON.stringify({ id: p.id, title: p.title, price: p.price })}'>In winkelwagen</button>` : ''}
        </div>
        <a href="product.html?id=${p.id}">
          <div class="product-card__vendor">${p.vendor}</div>
          <div class="product-card__title">${p.title}</div>
          <div class="product-card__rating"><svg viewBox="0 0 20 20"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3.1 1.4-6.3L1 8.5l6.4-.6z"/></svg><span>${p.rating} (${p.reviews})</span></div>
          <div><span class="price">${fmt(p.price)}</span>${p.compareAt ? `<span class="price--compare">${fmt(p.compareAt)}</span>` : ''}</div>
        </a>
      </article>`;

  return wrapInRailItem ? `<div class="product-rail__item">${card}</div>` : card;
};

/* Publiek: scoort alle producten tegen de antwoorden uit de AI-
   keuzehulp (Fase 4). Leeft in products.js — niet in ai.js — omdat
   dit productdata-logica is, net als veloraGetRelatedProducts
   hierboven; ai.js roept dit alleen aan, dupliceert het niet.
   preferences: { experience, budget, usage, wantsQuiet, wantsWaterproof, category } */
window.veloraGetAdvisorRecommendations = function (preferences, limit = 3) {
  const { experience, budget, usage, wantsQuiet, wantsWaterproof, category } = preferences;

  return window.VELORA_PRODUCTS.filter((p) => window.VELORA_AVAILABILITY[p.id] !== false)
    .map((p) => {
      const attrs = window.VELORA_ATTRIBUTES[p.id] || {};
      let score = 0;

      if (category && p.category === category) score += 3;
      if (experience && experience !== 'geen voorkeur' && (attrs.experience === experience || attrs.experience === 'alle')) score += 2;
      if (usage && usage !== 'geen voorkeur' && attrs.usage) {
        if (usage === 'beide' || attrs.usage.includes(usage)) score += 2;
      }
      if (budget) {
        const [min, max] = budget;
        if (p.price >= min && p.price <= max) score += 2;
      }
      if (wantsQuiet && attrs.noiseLevel === 'stil') score += 1;
      if (wantsWaterproof && attrs.waterproof === true) score += 1;

      return { product: p, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
};

/* Publiek: gemiddelde beoordeling + aantal, berekend uit de echte
   reviews-array — nooit hardcoded, dus nooit uit sync met de reviews
   zelf. Valt terug op het (geschatte) rating/reviews-veld van het
   product zelf als er nog geen reviews-array voor is ingevoerd. */
window.veloraGetReviewSummary = function (productId) {
  const reviews = window.VELORA_REVIEWS[productId] || [];
  if (!reviews.length) {
    const product = window.VELORA_PRODUCTS.find((p) => p.id === productId);
    return { average: product?.rating || 0, count: product?.reviews || 0, reviews: [] };
  }
  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { average, count: reviews.length, reviews };
};

/* Publiek: gerelateerde producten op basis van categorie, merk en
   prijsklasse (±30%) — score-gebaseerd, zodat het beste-passende
   product eerst komt i.p.v. willekeurig binnen dezelfde categorie. */
window.veloraGetRelatedProducts = function (product, limit = 4) {
  const priceMin = product.price * 0.7;
  const priceMax = product.price * 1.3;

  return window.VELORA_PRODUCTS.filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      if (p.vendor === product.vendor) score += 2;
      if (p.price >= priceMin && p.price <= priceMax) score += 1;
      return { product: p, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
};

/* Publiek: "Vaak samen gekocht" — cross-categorie aanvullingen die
   minstens één tag delen (bv. een wellness-product bij een lingerie-
   product met de tag "cadeau"). Bewust een ANDERE categorie dan het
   bekeken product, zodat dit een aanvulling is, geen herhaling van
   "gerelateerde producten". Data-gegrond op echte tags — geen
   verzonnen "vaak samen gekocht"-statistiek, die bestaat hier niet. */
window.veloraGetFrequentlyBoughtTogether = function (product, limit = 4) {
  const productTags = new Set(window.VELORA_TAGS[product.id] || []);
  if (!productTags.size) return [];

  return window.VELORA_PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category)
    .map((p) => {
      const tags = window.VELORA_TAGS[p.id] || [];
      const sharedTags = tags.filter((t) => productTags.has(t)).length;
      return { product: p, sharedTags };
    })
    .filter((entry) => entry.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((entry) => entry.product);
};

/* Publiek: "Klanten kochten ook" — populaire producten (op aantal
   reviews) uit dezelfde categorie maar een ANDERE subcategorie dan
   het bekeken product, zodat dit zich onderscheidt van zowel
   "gerelateerde producten" (categorie+merk+prijs) als "vaak samen
   gekocht" (cross-categorie via tags). */
window.veloraGetAlsoBought = function (product, limit = 4) {
  const productSubcat = window.VELORA_SUBCATEGORY[product.id];

  return window.VELORA_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category && window.VELORA_SUBCATEGORY[p.id] !== productSubcat
  )
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit);
};
