/* ============================================================
   assets/ai.js — AI-assistent-module (Velora Assistant)
   ------------------------------------------------------------
   Enige bron voor de chatinterface EN de stapsgewijze keuzehulp
   (Fase 4). Antwoorden/vragen komen uit VELORA_CONFIG.ai
   (config.js) — geen hardcoded content hier.

   Dupliceert bewust GEEN andere logica:
   - Productdata/scoring: window.veloraGetAdvisorRecommendations,
     window.veloraGetRelatedProducts (products.js)
   - Zoeken: window.veloraSearchProducts (search.js)
   - Winkelwagen: de "Voeg toe"-knoppen in chatberichten gebruiken
     hetzelfde data-add-to-cart-attribuut als de rest van de site —
     cart.js's bestaande, gedelegeerde click-listener op document
     pikt ze vanzelf op. Er staat geen eigen cart-code in dit bestand.

   Vereist: products.js, config.js, search.js — alle vóór dit
   bestand geladen.
   ============================================================ */
(() => {
  'use strict';

  const { answers: AI_ANSWERS, fallbackAnswer, advisorSteps } = window.VELORA_CONFIG.ai;
  const fmt = window.veloraFmt;

  const aiTrigger = document.getElementById('aiTrigger');
  const aiPanel = document.getElementById('aiPanel');
  const aiMessages = document.getElementById('aiMessages');
  const aiComposer = document.getElementById('aiComposer');
  const aiInput = document.getElementById('aiInput');

  function toggleAi() {
    aiPanel?.classList.toggle('is-open');
    if (aiPanel?.classList.contains('is-open')) aiInput?.focus();
  }
  aiTrigger?.addEventListener('click', toggleAi);
  document.getElementById('aiClose')?.addEventListener('click', toggleAi);
  document.getElementById('aiTeaserOpen')?.addEventListener('click', () => {
    if (!aiPanel.classList.contains('is-open')) toggleAi();
  });
  document.getElementById('heroAskAi')?.addEventListener('click', () => {
    if (!aiPanel.classList.contains('is-open')) toggleAi();
  });

  /* Delegatie: werkt ook voor de "Vraag AI om advies"-knop op de
     productpagina, die pas ná deze module wordt ingevoegd. */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ai-advisor]');
    if (!btn) return;
    if (!aiPanel.classList.contains('is-open')) toggleAi();
    const title = btn.dataset.aiAdvisor;
    addAiMessage(`Kun je me advies geven over "${title}"?`, 'user');
    setTimeout(() => addAiMessage(`Goede keuze om even stil te staan bij "${title}". Vertel me wat je vooral belangrijk vindt — formaat, materiaal of gebruiksgemak — dan denk ik gericht met je mee.`, 'bot'), 400);
  });

  /* ---------- Berichten renderen ---------- */
  function addAiMessage(text, role) {
    if (!aiMessages) return;
    const el = document.createElement('div');
    el.className = `ai-message ai-message--${role === 'user' ? 'user' : 'bot'}`;
    el.textContent = text;
    aiMessages.appendChild(el);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return el;
  }

  /* Rijk bot-bericht (HTML): alleen voor content die wíj zelf
     opbouwen (productkaarten, keuzeknoppen) — nooit voor tekst die
     de bezoeker zelf typt, die blijft via addAiMessage (textContent). */
  function addAiRichMessage(html) {
    if (!aiMessages) return;
    const el = document.createElement('div');
    el.className = 'ai-message ai-message--bot ai-message--rich';
    el.innerHTML = html;
    aiMessages.appendChild(el);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    return el;
  }

  function starRow(rating) {
    return `<svg viewBox="0 0 20 20" width="11" height="11" fill="var(--gold)"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3.1 1.4-6.3L1 8.5l6.4-.6z"/></svg> ${rating}`;
  }

  /* Eén productkaart binnen een chatbericht: koppelt naar de echte
     productpagina en hergebruikt het bestaande data-add-to-cart-
     attribuut, dus geen eigen "voeg toe"-logica hier. */
  function productCardHTML(p) {
    return `
      <div class="ai-product-card">
        <div class="ai-product-card__media"></div>
        <div class="ai-product-card__info">
          <div class="ai-product-card__title">${p.title}</div>
          <div class="ai-product-card__meta">${starRow(p.rating)} · ${fmt(p.price)}</div>
        </div>
        <div class="ai-product-card__actions">
          <a href="product.html?id=${p.id}" class="ai-product-card__btn">Bekijk</a>
          <button type="button" class="ai-product-card__btn ai-product-card__btn--primary" data-add-to-cart='${JSON.stringify({ id: p.id, title: p.title, price: p.price })}'>Toevoegen</button>
        </div>
      </div>`;
  }

  let lastShownProducts = []; // recent getoonde aanbevelingen, voor de vergelijk-flow als snelkeuze

  function renderProductRecommendations(products, introText) {
    if (!products.length) {
      addAiMessage('Ik kon hier geen passende producten bij vinden — wil je het over een andere hoek proberen?', 'bot');
      return;
    }
    lastShownProducts = products;
    const cards = products.map(productCardHTML).join('');
    let html = `<p>${introText}</p>${cards}`;
    if (products.length >= 2) {
      html += `<button type="button" class="ai-chip" data-compare-ids="${products[0].id},${products[1].id}">Vergelijk deze twee</button>`;
    }
    addAiRichMessage(html);
  }

  /* ---------- Vergelijken ---------- */
  function renderComparison(idA, idB) {
    const a = window.VELORA_PRODUCTS.find((p) => p.id === idA);
    const b = window.VELORA_PRODUCTS.find((p) => p.id === idB);
    if (!a || !b) return;
    const attrsA = window.VELORA_ATTRIBUTES[a.id] || {};
    const attrsB = window.VELORA_ATTRIBUTES[b.id] || {};
    const tagsA = window.VELORA_TAGS[a.id] || [];
    const tagsB = window.VELORA_TAGS[b.id] || [];
    const MATERIALS = ['siliconen', 'glas', 'kant', 'satijn', 'mesh', 'leer', 'latex', 'fluweel', 'zijde', 'katoen'];
    const materialA = tagsA.find((t) => MATERIALS.includes(t)) || '—';
    const materialB = tagsB.find((t) => MATERIALS.includes(t)) || '—';
    const experienceLabel = (v) => (v === 'alle' ? 'Geschikt voor iedereen' : v === 'beginner' ? 'Beginners' : v === 'gevorderd' ? 'Gevorderden' : '—');
    const usageLabel = (arr) => (arr ? arr.map((u) => (u === 'solo' ? 'Solo' : 'Samen')).join(' & ') : '—');

    const rows = [
      ['Prijs', fmt(a.price), fmt(b.price)],
      ['Beoordeling', `${a.rating} (${a.reviews} reviews)`, `${b.rating} (${b.reviews} reviews)`],
      ['Categorie', a.category, b.category],
      ['Subcategorie (formaat/type)', window.VELORA_SUBCATEGORY[a.id] || '—', window.VELORA_SUBCATEGORY[b.id] || '—'],
      ['Materiaal', materialA, materialB],
      ['Eigenschappen', tagsA.join(', ') || '—', tagsB.join(', ') || '—'],
      ['Gebruik', usageLabel(attrsA.usage), usageLabel(attrsB.usage)],
      ['Geluidsniveau', attrsA.noiseLevel || '—', attrsB.noiseLevel || '—'],
      ['Waterdicht', attrsA.waterproof ? 'Ja' : 'Nee', attrsB.waterproof ? 'Ja' : 'Nee'],
      ['Voor wie geschikt', experienceLabel(attrsA.experience), experienceLabel(attrsB.experience)],
    ];

    /* Plus-/minpunten: uitsluitend afgeleid uit echte, meetbare verschillen
       tussen de twee producten — geen verzonnen marketingtaal. */
    function buildProsAndCons(mine, other, myAttrs, otherAttrs) {
      const pros = [];
      if (mine.price < other.price) pros.push(`Voordeliger (${fmt(other.price - mine.price)} goedkoper)`);
      if (mine.rating > other.rating) pros.push('Hoger beoordeeld door klanten');
      if (myAttrs.waterproof && !otherAttrs.waterproof) pros.push('Wel waterdicht');
      if (myAttrs.noiseLevel === 'stil' && otherAttrs.noiseLevel !== 'stil') pros.push('Stiller in gebruik');
      if (myAttrs.experience === 'beginner' && otherAttrs.experience !== 'beginner') pros.push('Beter geschikt voor beginners');
      if (!pros.length) pros.push('Vergelijkbaar met de andere optie op de belangrijkste punten');
      return pros;
    }
    const prosA = buildProsAndCons(a, b, attrsA, attrsB);
    const prosB = buildProsAndCons(b, a, attrsB, attrsA);

    const html = `
      <table class="ai-compare-table">
        <thead><tr><th></th><th>${a.title}</th><th>${b.title}</th></tr></thead>
        <tbody>
          ${rows.map(([label, va, vb]) => `<tr><th>${label}</th><td>${va}</td><td>${vb}</td></tr>`).join('')}
          <tr><th>Pluspunten</th><td>${prosA.map((p) => `+ ${p}`).join('<br>')}</td><td>${prosB.map((p) => `+ ${p}`).join('<br>')}</td></tr>
        </tbody>
      </table>
      <div class="ai-product-card__actions" style="margin-top:10px;">
        <a href="product.html?id=${a.id}" class="ai-product-card__btn">Bekijk ${a.title.split(' ')[0]}</a>
        <a href="product.html?id=${b.id}" class="ai-product-card__btn">Bekijk ${b.title.split(' ')[0]}</a>
      </div>`;
    addAiRichMessage(html);
  }

  /* ---------- Interactieve "vergelijk twee producten"-flow ---------- */
  let compareFlowState = null; // { firstId: number|null } zolang de flow loopt

  function renderComparePicker(promptText, excludeId) {
    const candidates = lastShownProducts.filter((p) => p.id !== excludeId).slice(0, 6);
    const chips = candidates.map((p) => `<button type="button" class="ai-chip" data-compare-pick="${p.id}">${p.title}</button>`).join('');
    const html = `<p>${promptText}</p>${chips ? `<div class="ai-chips">${chips}</div>` : ''}`;
    addAiRichMessage(html);
  }

  function startCompareFlow(triggerText) {
    addAiMessage(triggerText || 'Help me twee producten vergelijken', 'user');
    compareFlowState = { firstId: null };
    setTimeout(() => {
      renderComparePicker('Welke twee producten wil je vergelijken? Typ de namen, of kies hieronder uit wat ik je eerder liet zien:');
    }, 350);
  }

  function handleComparePick(id) {
    const product = window.VELORA_PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    addAiMessage(product.title, 'user');

    if (compareFlowState.firstId == null) {
      compareFlowState.firstId = id;
      setTimeout(() => renderComparePicker('Oké! En het tweede product?', id), 350);
      return;
    }

    const firstId = compareFlowState.firstId;
    compareFlowState = null;
    setTimeout(() => renderComparison(firstId, id), 350);
  }

  /* Vrij getypte productnaam tijdens de vergelijk-flow — hergebruikt
     uitsluitend window.veloraSearchProducts, geen eigen zoeklogica. */
  function handleCompareTypedText(text) {
    const matches = window.veloraSearchProducts(text);
    if (!matches.length) {
      addAiMessage(`Ik kon geen product vinden dat overeenkomt met "${text}". Probeer een andere naam, of kies hieronder.`, 'bot');
      renderComparePicker('Kies uit deze opties:', compareFlowState.firstId);
      return;
    }
    handleComparePick(matches[0].id);
  }

  /* ---------- Stapsgewijze keuzehulp — context blijft bewaard in advisorState ---------- */
  let advisorState = null; // { stepIndex, answers: {} } zolang de flow loopt

  function startAdvisorFlow(triggerText) {
    advisorState = { stepIndex: 0, answers: {} };
    addAiMessage(triggerText || 'Persoonlijk productadvies', 'user');
    setTimeout(() => {
      addAiMessage('Leuk! Ik stel je een paar korte vragen, dan denk ik gericht met je mee.', 'bot');
      renderAdvisorStep();
    }, 350);
  }

  function renderAdvisorStep() {
    const step = advisorSteps[advisorState.stepIndex];
    const chips = step.options
      .map((opt, i) => `<button type="button" class="ai-chip" data-advisor-option="${i}">${opt.label}</button>`)
      .join('');
    addAiRichMessage(`<p>${step.question}</p><div class="ai-chips">${chips}</div>`);
  }

  function handleAdvisorOptionClick(optionIndex) {
    const step = advisorSteps[advisorState.stepIndex];
    const chosen = step.options[optionIndex];
    if (!chosen) return;

    addAiMessage(chosen.label, 'user');
    advisorState.answers[step.key] = chosen.value;
    advisorState.stepIndex += 1;

    if (advisorState.stepIndex < advisorSteps.length) {
      setTimeout(renderAdvisorStep, 350);
      return;
    }

    // Alle stappen doorlopen — aanbevelingen tonen op basis van het
    // volledige, tijdens dit gesprek onthouden antwoordenoverzicht.
    setTimeout(() => {
      const recommendations = window.veloraGetAdvisorRecommendations(advisorState.answers, 3);
      renderProductRecommendations(recommendations, 'Op basis van je antwoorden denk ik dat dit goed bij je past:');
      advisorState = null; // flow afgerond, gewone chat hervat
    }, 350);
  }

  /* ---------- Zoekintegratie: freeform berichten kunnen de catalogus doorzoeken ---------- */
  const PRODUCT_INTENT_KEYWORDS = ['zoek', 'product', 'aanbevel', 'welke', 'heb je', 'hebben jullie'];

  function tryCompareIntent(message) {
    const compareMatch = message.match(/vergelijk\s+(.+?)\s+(?:en|met|vs)\s+(.+)/i);
    if (!compareMatch) return false;
    const [, termA, termB] = compareMatch;
    const resultsA = window.veloraSearchProducts(termA);
    const resultsB = window.veloraSearchProducts(termB);
    if (resultsA[0] && resultsB[0] && resultsA[0].id !== resultsB[0].id) {
      addAiMessage(`Ik vergelijk "${resultsA[0].title}" met "${resultsB[0].title}":`, 'bot');
      renderComparison(resultsA[0].id, resultsB[0].id);
      return true;
    }
    return false;
  }

  const STOPWORDS = ['hebben', 'jullie', 'heb', 'je', 'iets', 'met', 'een', 'de', 'het', 'voor', 'van', 'wat', 'is', 'zijn', 'ik', 'zoek', 'naar', 'welke', 'goede'];

  function trySearchIntent(message) {
    const lower = message.toLowerCase();
    const looksLikeProductQuestion = PRODUCT_INTENT_KEYWORDS.some((k) => lower.includes(k));

    // Eerst de hele zin proberen (kan al matchen bij een korte, directe vraag)
    let results = window.veloraSearchProducts(message);

    // Levert dat niets op, dan losse betekenisvolle woorden proberen —
    // de matchlogica zelf blijft in search.js, hier verbetert alleen
    // wát we ernaartoe sturen.
    if (!results.length) {
      const words = lower
        .split(/\s+/)
        .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ''))
        .filter((w) => w.length > 3 && !STOPWORDS.includes(w));
      const found = new Map();
      words.forEach((w) => {
        window.veloraSearchProducts(w).forEach((p) => found.set(p.id, p));
      });
      results = [...found.values()];
    }

    if (results.length && (looksLikeProductQuestion || results.length <= 5)) {
      renderProductRecommendations(results.slice(0, 4), `Dit vond ik in onze catalogus voor "${window.veloraEscapeHTML(message)}":`);
      return true;
    }
    return false;
  }

  function aiReply(msg) {
    const lower = msg.toLowerCase();
    const match = AI_ANSWERS.find((a) => a.kw.some((k) => lower.includes(k)));
    return match ? match.a : fallbackAnswer;
  }

  /* ---------- Eén centraal instappunt voor elk bericht (chip of typen) ---------- */
  function handleUserMessage(text) {
    if (advisorState) return; // antwoorden tijdens de flow lopen via de keuzeknoppen, niet hier
    if (compareFlowState) {
      handleCompareTypedText(text);
      return;
    }

    if (tryCompareIntent(text)) return;
    if (trySearchIntent(text)) return;
    tryRealAiService(text);
  }

  /* Probeert de echte AI-service (api/ai-chat.js). Zolang die nog niet
     gekoppeld is (501, zie die bestandskop) of bij een netwerkfout,
     valt dit onzichtbaar terug op de bestaande, regelgebaseerde flow
     — de gebruiker merkt niets van het verschil, en niets van de
     bestaande werking verandert. */
  async function tryRealAiService(text) {
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setTimeout(() => addAiRichMessage(`<p>${data.reply}</p>`), 400);
          return;
        }
      }
    } catch (e) {
      // Netwerkfout of endpoint bestaat niet in deze omgeving — negeren,
      // val hieronder terug op de bestaande flow.
    }
    setTimeout(() => addAiRichMessage(`<p>${aiReply(text)}</p>`), 400);
  }

  /* ---------- Event-afhandeling ---------- */
  document.addEventListener('click', (e) => {
    const advisorBtn = e.target.closest('[data-advisor-option]');
    if (advisorBtn) {
      handleAdvisorOptionClick(Number(advisorBtn.dataset.advisorOption));
      return;
    }
    const compareBtn = e.target.closest('[data-compare-ids]');
    if (compareBtn) {
      const [idA, idB] = compareBtn.dataset.compareIds.split(',').map(Number);
      renderComparison(idA, idB);
      return;
    }
    const startAdvisorBtn = e.target.closest('[data-start-advisor]');
    if (startAdvisorBtn) {
      startAdvisorFlow(startAdvisorBtn.textContent);
      return;
    }
    const startCompareBtn = e.target.closest('[data-start-compare]');
    if (startCompareBtn) {
      startCompareFlow(startCompareBtn.textContent);
      return;
    }
    const comparePickBtn = e.target.closest('[data-compare-pick]');
    if (comparePickBtn) {
      handleComparePick(Number(comparePickBtn.dataset.comparePick));
      return;
    }
    const chip = e.target.closest('.ai-chip');
    if (
      chip &&
      !chip.hasAttribute('data-advisor-option') &&
      !chip.hasAttribute('data-start-advisor') &&
      !chip.hasAttribute('data-start-compare') &&
      !chip.hasAttribute('data-compare-pick')
    ) {
      addAiMessage(chip.textContent, 'user');
      handleUserMessage(chip.textContent);
    }
  });

  aiComposer?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = aiInput.value.trim();
    if (!val) return;
    addAiMessage(val, 'user');
    aiInput.value = '';
    handleUserMessage(val);
  });
})();
