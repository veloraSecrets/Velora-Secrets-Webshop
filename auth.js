/* ============================================================
   assets/analytics.js — analytics-loader
   ------------------------------------------------------------
   Leest uitsluitend window.VELORA_ANALYTICS_CONFIG (analytics-
   config.js) en injecteert per dienst het bijbehorende script —
   maar alleen als enabled:true staat én de ID is ingevuld. Staat
   alles nog op enabled:false (de standaardstaat), dan doet dit
   bestand letterlijk niets — geen enkel extern script wordt
   geladen totdat jij dat expliciet aanzet.

   Vereist: analytics-config.js, vóór dit bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const cfg = window.VELORA_ANALYTICS_CONFIG || {};

  /* ---------- Plausible (privacyvriendelijke, cookievrije analytics) ---------- */
  if (cfg.plausible?.enabled && cfg.plausible.domain) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = cfg.plausible.domain;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  /* ---------- Google Search Console (site-verificatie via meta-tag) ---------- */
  if (cfg.googleSearchConsole?.enabled && cfg.googleSearchConsole.verificationCode) {
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = cfg.googleSearchConsole.verificationCode;
    document.head.appendChild(meta);
  }

  /* ---------- Meta Pixel ---------- */
  if (cfg.metaPixel?.enabled && cfg.metaPixel.pixelId) {
    /* Officiële Meta Pixel base-code, ID komt uitsluitend uit de config. */
    const pixelId = cfg.metaPixel.pixelId;
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
})();
