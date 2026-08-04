(function () {
  'use strict';

  /* ---------- Zoekpaneel: openen/sluiten/live filteren ---------- */
  var searchToggleBtn = document.getElementById('searchToggleBtn');
  var searchPanel = document.getElementById('searchPanel');
  var searchInput = document.getElementById('searchInput');
  var searchCloseBtn = document.getElementById('searchCloseBtn');
  var searchResultsEl = document.getElementById('searchResults');

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.hidden = true;
    if (searchInput) searchInput.value = '';
    if (searchResultsEl) searchResultsEl.innerHTML = '';
  }

  function openSearch() {
    if (!searchPanel) return;
    closeAllMenus(null); // megamenu's sluiten zodat ze niet overlappen met het zoekpaneel
    searchPanel.hidden = false;
    if (searchInput) searchInput.focus();
  }

  if (searchToggleBtn) {
    searchToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (searchPanel.hidden) openSearch(); else closeSearch();
    });
  }
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener('click', closeSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      if (typeof veloraSearchProducts !== 'function' || !searchResultsEl) return;
      var results = veloraSearchProducts(searchInput.value);
      if (!searchInput.value.trim()) {
        searchResultsEl.innerHTML = '';
      } else if (!results.length) {
        var escapedQuery = searchInput.value
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        searchResultsEl.innerHTML = '<p class="search-empty">Geen producten gevonden voor "' + escapedQuery + '".</p>';
      } else {
        searchResultsEl.innerHTML = results.slice(0, 8).map(veloraProductCardHTML).join('');
      }
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
    });
  }
  document.addEventListener('click', function (e) {
    if (searchPanel && !searchPanel.hidden && !e.target.closest('.search-panel') && e.target !== searchToggleBtn) {
      closeSearch();
    }
  });

  /* ---------- Mega menu: click-to-open + click-outside-to-close
     (werkt op touch én desktop, voorkomt vastzittend menu op mobiel) ---------- */
  var navItems = document.querySelectorAll('.main-nav > li > a[aria-haspopup="true"]');

  function closeAllMenus(except) {
    navItems.forEach(function (a) {
      if (a !== except) a.setAttribute('aria-expanded', 'false');
    });
  }

  navItems.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = a.getAttribute('aria-expanded') === 'true';
      closeAllMenus(a);
      a.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.main-nav > li')) {
      closeAllMenus(null);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllMenus(null);
  });

  /* ---------- Mobiel menu toggle ---------- */
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNavEl = document.querySelector('.main-nav');
  if (menuToggle && mainNavEl) {
    menuToggle.addEventListener('click', function () {
      var isShown = mainNavEl.style.display === 'flex';
      mainNavEl.style.display = isShown ? 'none' : 'flex';
      mainNavEl.style.flexDirection = 'column';
      menuToggle.setAttribute('aria-expanded', String(!isShown));
    });
  }

  /* ---------- Nieuwsbrief-formulieren ----------
     Placeholder-implementatie: valideert en toont bevestiging.
     Vervang de fetch-call door een echte serverside-aanroep zodra de nieuwsbrief-koppeling opnieuw wordt gebouwd (in de huidige Shopify-headless-architectuur via een geschikte e-mailprovider, niet de verwijderde api/newsletter.js uit de vóór-Shopify-periode)
     zodra die is teruggebouwd op de server. ---------- */
  function handleNewsletterSubmit(formId, statusElId) {
    var form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var statusEl = statusElId ? document.getElementById(statusElId) : null;
      var email = input.value.trim();

      if (!email) return;

      // TODO: vervangen door een echte serverside-aanroep naar een e-mailprovider zodra gekozen.
      // Zolang die koppeling er niet is, GEEN valse belofte doen over een bevestigingsmail.
      if (statusEl) {
        statusEl.textContent = veloraTranslate('messages.newsletterInactive');
      }
      input.value = '';
    });
  }

  handleNewsletterSubmit('newsletterForm', 'newsletterStatus');
  handleNewsletterSubmit('footerNewsletterForm', null);

  /* ---------- Cart-badge op elke pagina bijwerken bij laden ---------- */
  if (typeof veloraUpdateCartBadge === 'function') veloraUpdateCartBadge();
  if (typeof veloraUpdateWishlistBadge === 'function') veloraUpdateWishlistBadge();

  /* ---------- Verlanglijst: hartje op productkaarten (event delegation, werkt voor dynamisch geladen kaarten) ---------- */
  document.addEventListener('click', function (e) {
    var heartBtn = e.target.closest('.wishlist-toggle');
    if (!heartBtn || typeof veloraToggleWishlist !== 'function') return;
    e.preventDefault();
    var id = parseInt(heartBtn.getAttribute('data-product-id'), 10);
    var nowActive = veloraToggleWishlist(id);
    heartBtn.classList.toggle('is-active', nowActive);
    heartBtn.textContent = nowActive ? '♥' : '♡';
    heartBtn.style.color = nowActive ? 'var(--accent-orange)' : 'var(--ink)';
    heartBtn.setAttribute('aria-label', nowActive ? 'Verwijder uit verlanglijst' : 'Toevoegen aan verlanglijst');
    if (typeof renderWishlistPage === 'function') renderWishlistPage();
  });

  /* ---------- Productpagina: los verlanglijst-hartje in de actieknoppen-rij ---------- */
  var pdWishlistBtn = document.querySelector('.pd-actions button[aria-label="Toevoegen aan verlanglijst"]');
  if (pdWishlistBtn) {
    pdWishlistBtn.addEventListener('click', function () {
      var pdParamsForFav = new URLSearchParams(window.location.search);
      var pdIdForFav = parseInt(pdParamsForFav.get('id'), 10) || (typeof VELORA_PRODUCTS !== 'undefined' ? VELORA_PRODUCTS[0].id : 1);
      var nowActive = veloraToggleWishlist(pdIdForFav);
      pdWishlistBtn.textContent = nowActive ? '♥' : '♡';
      pdWishlistBtn.style.color = nowActive ? 'var(--accent-orange)' : '';
    });
    // Beginstatus tonen als product al op de verlanglijst staat
    var pdParamsInit = new URLSearchParams(window.location.search);
    var pdIdInit = parseInt(pdParamsInit.get('id'), 10) || (typeof VELORA_PRODUCTS !== 'undefined' ? VELORA_PRODUCTS[0].id : 1);
    if (typeof veloraIsInWishlist === 'function' && veloraIsInWishlist(pdIdInit)) {
      pdWishlistBtn.textContent = '♥';
      pdWishlistBtn.style.color = 'var(--accent-orange)';
    }
  }

  /* ---------- Winkelwagenpagina: lege of gevulde staat renderen (Shopify Cart API) ---------- */
  var cartLinesEl = document.getElementById('cartLines');
  if (cartLinesEl) {
    function renderCartPage(cart) {
      var emptyEl = document.getElementById('cartEmptyState');
      var filledEl = document.getElementById('cartFilledState');

      if (!cart || !cart.lines.edges.length) {
        emptyEl.hidden = false;
        filledEl.hidden = true;
        return;
      }
      emptyEl.hidden = true;
      filledEl.hidden = false;

      cartLinesEl.innerHTML = cart.lines.edges.map(function (edge) {
        var line = edge.node;
        var m = line.merchandise;
        var lineTotal = parseFloat(m.price.amount) * line.quantity;
        return (
          '<div class="cart-line" data-line-id="' + line.id + '">' +
            '<div class="cart-line-media"></div>' +
            '<div>' +
              '<p class="cart-line-name">' + m.product.title + (m.title && m.title !== 'Default' ? ' — ' + m.title : '') + '</p>' +
              '<button type="button" class="cart-line-remove" data-action="remove">Verwijderen</button>' +
            '</div>' +
            '<div class="qty-stepper">' +
              '<button type="button" data-action="dec" aria-label="Minder">−</button>' +
              '<span>' + line.quantity + '</span>' +
              '<button type="button" data-action="inc" aria-label="Meer">+</button>' +
            '</div>' +
            '<div class="cart-line-price">' + veloraFormatPrice(lineTotal) + '</div>' +
          '</div>'
        );
      }).join('');

      var subtotal = parseFloat(cart.cost.subtotalAmount.amount);
      document.getElementById('cartSubtotal').textContent = veloraFormatPrice(subtotal);
      document.getElementById('cartTotal').textContent = veloraFormatPrice(parseFloat(cart.cost.totalAmount.amount));
      document.getElementById('cartShipping').textContent = subtotal >= 50 ? 'Gratis' : '€ 4,95';

      var checkoutBtn = document.getElementById('goToCheckoutBtn');
      if (checkoutBtn) {
        checkoutBtn.onclick = function () { veloraGoToShopifyCheckout(cart); };
      }
    }

    cartLinesEl.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var line = btn.closest('.cart-line');
      var lineId = line.getAttribute('data-line-id');
      var currentQtyEl = line.querySelector('.qty-stepper span');
      var currentQty = parseInt(currentQtyEl.textContent, 10);

      btn.disabled = true;
      var pending = (btn.dataset.action === 'remove')
        ? veloraRemoveShopifyCartLine(lineId)
        : veloraUpdateShopifyCartLine(lineId, btn.dataset.action === 'inc' ? currentQty + 1 : currentQty - 1);

      pending.then(function (cart) { renderCartPage(cart); }).catch(function () {
        btn.disabled = false;
      });
    });

    veloraGetShopifyCart().then(function (cart) { renderCartPage(cart); });
  }

  var aiBubble = document.getElementById('aiChatBubble');
  var aiPanel = document.getElementById('aiChatPanel');
  var aiMessagesEl = document.getElementById('aiChatMessages');
  var aiQuickRepliesEl = document.getElementById('aiQuickReplies');
  var aiForm = document.getElementById('aiChatForm');
  var aiInput = document.getElementById('aiChatInput');
  var aiCloseBtn = document.getElementById('aiChatCloseBtn');

  function aiAddMessage(text, who) {
    var div = document.createElement('div');
    div.className = 'ai-msg ' + (who === 'user' ? 'ai-msg-user' : 'ai-msg-bot');
    div.innerHTML = text;
    aiMessagesEl.appendChild(div);
    aiMessagesEl.scrollTop = aiMessagesEl.scrollHeight;
  }

  function aiHandleUserMessage(text) {
    if (!text.trim()) return;
    // Escapen van gebruikersinvoer vóórdat het als "user"-bericht getoond wordt
    // (voorkomt dat iemand HTML/scripts in de chat kan injecteren).
    var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    aiAddMessage(escaped, 'user');
    if (typeof veloraAiRespond === 'function') {
      setTimeout(function () { aiAddMessage(veloraAiRespond(text), 'bot'); }, 350);
    }
  }

  function setAiPanelOpen(isOpen, options) {
    var restoreFocus = options && options.restoreFocus;
    aiPanel.classList.toggle('is-open', isOpen);
    aiBubble.classList.toggle('is-active', isOpen);
    aiBubble.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      if (aiQuickRepliesEl && !aiQuickRepliesEl.dataset.built && typeof VELORA_AI_QUICK_REPLIES !== 'undefined') {
        aiQuickRepliesEl.dataset.built = 'true';
        VELORA_AI_QUICK_REPLIES.forEach(function (label) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.textContent = label;
          btn.addEventListener('click', function () { aiHandleUserMessage(label); });
          aiQuickRepliesEl.appendChild(btn);
        });
      }
      if (aiInput) aiInput.focus();
    } else if (restoreFocus) {
      aiBubble.focus(); // focus teruggeven aan de knop, maar alleen bij expliciet sluiten (X/Escape) — niet bij klik-buiten
    }
  }

  if (aiBubble && aiPanel) {
    aiBubble.addEventListener('click', function () {
      setAiPanelOpen(!aiPanel.classList.contains('is-open'));
    });
  }
  if (aiCloseBtn) {
    aiCloseBtn.addEventListener('click', function () { setAiPanelOpen(false, { restoreFocus: true }); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && aiPanel && aiPanel.classList.contains('is-open')) {
      setAiPanelOpen(false, { restoreFocus: true });
    }
  });
  document.addEventListener('click', function (e) {
    if (aiPanel && aiPanel.classList.contains('is-open') &&
        !e.target.closest('.ai-chat-panel') && !e.target.closest('.ai-chat-bubble')) {
      setAiPanelOpen(false);
    }
  });
  if (aiForm) {
    aiForm.addEventListener('submit', function (e) {
      e.preventDefault();
      aiHandleUserMessage(aiInput.value);
      aiInput.value = '';
    });
  }

  /* ---------- Productpagina: aantal-stepper, in-winkelwagen (Shopify Cart API) ---------- */
  var qtyDisplay = document.getElementById('pdQty');
  if (qtyDisplay) {
    var qtyStepper = qtyDisplay.closest('.qty-stepper');
    var qtyButtons = qtyStepper.querySelectorAll('button');
    qtyButtons[0].addEventListener('click', function () {
      var val = Math.max(1, parseInt(qtyDisplay.textContent, 10) - 1);
      qtyDisplay.textContent = val;
    });
    qtyButtons[1].addEventListener('click', function () {
      var val = parseInt(qtyDisplay.textContent, 10) + 1;
      qtyDisplay.textContent = val;
    });
  }

  var addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function () {
      var qty = qtyDisplay ? parseInt(qtyDisplay.textContent, 10) : 1;
      var variantId = (typeof pdProduct !== 'undefined' && pdProduct) ? pdProduct.variantId : null;
      var originalText = addToCartBtn.textContent;

      addToCartBtn.disabled = true;
      addToCartBtn.textContent = veloraTranslate('messages.adding');

      veloraAddToShopifyCart(variantId, qty).then(function (result) {
        if (result.ok) {
          addToCartBtn.textContent = veloraTranslate('messages.addedShort');
        } else if (result.reason === 'no-variant') {
          addToCartBtn.textContent = veloraTranslate('messages.notAvailableDemo');
        } else {
          addToCartBtn.textContent = veloraTranslate('messages.failedRetry');
        }
        addToCartBtn.disabled = false;
        setTimeout(function () { addToCartBtn.textContent = originalText; }, 2200);
      });
    });
  }

  /* ---------- Contactformulier: honeypot + tijdcontrole anti-bot ---------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var loadedAtField = document.getElementById('contactFormLoadedAt');
    if (loadedAtField) loadedAtField.value = String(Date.now());

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('contactStatus');
      var honeypot = document.getElementById('contactWebsite');

      // Honeypot ingevuld = waarschijnlijk bot: stille succesmelding, geen echte verzending.
      if (honeypot && honeypot.value.trim() !== '') {
        if (statusEl) statusEl.textContent = veloraTranslate('messages.thanksMessage');
        contactForm.reset();
        return;
      }

      var loadedAt = loadedAtField ? parseInt(loadedAtField.value, 10) : 0;
      var elapsed = Date.now() - loadedAt;
      if (loadedAt && elapsed < 1500) {
        // Te snel ingevuld voor een mens: negeer stil, geen foutmelding aan de gebruiker.
        if (statusEl) statusEl.textContent = veloraTranslate('messages.thanksMessage');
        contactForm.reset();
        return;
      }

      // TODO: vervangen door een echte serverside-aanroep naar een e-mailprovider zodra gekozen.
      // Zolang die koppeling er niet is, GEEN valse belofte doen dat het bericht is "ontvangen"
      // of dat er "binnen 1 werkdag" gereageerd wordt — dat zou een bezoeker misleiden.
      if (statusEl) statusEl.textContent = veloraTranslate('messages.contactInactive');
      contactForm.reset();
    });
  }

  /* ---------- Login / registreren: echte demo-authenticatie via auth.js ---------- */
  var loginForm = document.getElementById('loginForm');
  if (loginForm && typeof veloraLogin === 'function') {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('loginEmail').value;
      var password = document.getElementById('loginPassword').value;
      var result = veloraLogin(email, password);
      if (result.ok) {
        window.location.href = 'account.html';
      } else {
        showAuthError(loginForm, result.error);
      }
    });
  }

  var registerForm = document.getElementById('registerForm');
  if (registerForm && typeof veloraRegister === 'function') {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('registerName').value.trim();
      var email = document.getElementById('registerEmail').value;
      var password = document.getElementById('registerPassword').value;
      if (!name || !email || password.length < 6) {
        showAuthError(registerForm, 'Vul alle velden in (wachtwoord: min. 6 tekens).');
        return;
      }
      var result = veloraRegister(name, email, password);
      if (result.ok) {
        window.location.href = 'account.html';
      } else {
        showAuthError(registerForm, result.error);
      }
    });
  }

  function showAuthError(form, message) {
    var existing = form.querySelector('.auth-error');
    if (existing) existing.remove();
    var el = document.createElement('p');
    el.className = 'auth-error';
    el.setAttribute('role', 'alert');
    el.style.cssText = 'color:var(--sale);font-size:13px;margin:-8px 0 16px;';
    el.textContent = message;
    form.insertBefore(el, form.firstChild);
  }

  /* ---------- Accountpagina: ingelogde/uitgelogde staat tonen ---------- */
  var accountLoggedInEl = document.getElementById('accountLoggedIn');
  if (accountLoggedInEl && typeof veloraGetCurrentUser === 'function') {
    var currentUser = veloraGetCurrentUser();
    var loggedOutEl = document.getElementById('accountLoggedOut');
    if (currentUser) {
      accountLoggedInEl.hidden = false;
      document.getElementById('accountWelcome').textContent = veloraTranslate('account.welcomeBack') + ', ' + currentUser.name;
      document.getElementById('accountName').value = currentUser.name;
      document.getElementById('accountEmail').value = currentUser.email;
      document.getElementById('logoutBtn').addEventListener('click', function () {
        veloraLogout();
        window.location.href = 'index.html';
      });
    } else {
      loggedOutEl.hidden = false;
    }
  }

  /* ---------- Header-accountknop: naar account.html als ingelogd, anders login.html ---------- */
  var accountBtn = document.querySelector('.header-icons button[aria-label="Account"]');
  if (accountBtn) {
    accountBtn.addEventListener('click', function () {
      var loggedIn = typeof veloraGetCurrentUser === 'function' && veloraGetCurrentUser();
      window.location.href = loggedIn ? 'account.html' : 'login.html';
    });
  }

  /* ---------- Header-winkelwagen- en verlanglijst-icoon: navigeren naar de bijbehorende pagina ---------- */
  var headerCartBtn = document.querySelector('.header-icons button[aria-label="Winkelwagen"]');
  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', function () { window.location.href = 'winkelwagen.html'; });
  }
  var headerWishlistBtn = document.querySelector('.header-icons button.wishlist-btn');
  if (headerWishlistBtn) {
    headerWishlistBtn.addEventListener('click', function () { window.location.href = 'verlanglijst.html'; });
  }

  /* ---------- Shop-pagina: categoriefilter uit URL (?cat=...&sub=... of ?filter=sale) ---------- */
  var shopHeading = document.querySelector('.page-hero-inner h1');
  var shopSubline = document.querySelector('.page-hero-inner p');
  var filterLinks = document.querySelectorAll('.filter-group ul li a');
  if (filterLinks.length && window.location.search) {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    var sub = params.get('sub');
    var filter = params.get('filter');
    var catLabels = {
      'voor-haar': 'Voor Haar',
      'voor-hem': 'Voor Hem',
      'voor-koppels': 'Voor Koppels',
      'lingerie-bdsm': 'Lingerie & BDSM'
    };
    // TODO: zodra echte productdata beschikbaar is, hier daadwerkelijk filteren i.p.v. alleen de actieve status tonen
    if (cat && catLabels[cat]) {
      filterLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.textContent.trim() === catLabels[cat]);
      });
      if (shopHeading) {
        shopHeading.textContent = sub
          ? catLabels[cat] + ' — ' + sub.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); })
          : catLabels[cat];
      }
      if (shopSubline && sub) {
        shopSubline.textContent = veloraTranslate('messages.subcategoryIn') + ' ' + catLabels[cat] + '.';
      }
    } else if (filter === 'sale') {
      if (shopHeading) shopHeading.textContent = veloraTranslate('nav.sale');
    }
  }
  /* ---------- Shop-pagina: echte filtering + rendering op basis van VELORA_PRODUCTS ---------- */
  var productGridEl = document.querySelector('.shop-layout .product-grid');
  if (productGridEl && typeof veloraFilterProducts === 'function') {
    var params2 = new URLSearchParams(window.location.search);
    var activeCat = params2.get('cat');
    var activeSub = params2.get('sub');
    var activeFilter = params2.get('filter');

    var results = veloraFilterProducts({
      cat: activeCat || null,
      sub: activeSub || null,
      sale: activeFilter === 'sale'
    });

    productGridEl.innerHTML = results.length
      ? results.map(veloraProductCardHTML).join('')
      : '<p style="color:var(--ink-soft);grid-column:1/-1;">Geen producten gevonden in deze categorie.</p>';

    var toolbarCount = document.querySelector('.shop-toolbar span');
    if (toolbarCount) {
      toolbarCount.textContent = veloraTranslate('messages.showingProducts') + ' ' + results.length + ' ' + veloraTranslate('messages.of') + ' ' + VELORA_PRODUCTS.length + ' ' + veloraTranslate('messages.products');
    }
  }

  /* ---------- Homepage: favorieten-sectie vullen met featured=true producten ---------- */
  var isHomepage = !!document.querySelector('.hero');
  if (isHomepage && typeof veloraFilterProducts === 'function') {
    var favGridEl = document.querySelector('.section .product-grid');
    if (favGridEl) {
      var featured = veloraFilterProducts({ featured: true }).slice(0, 5);
      if (featured.length) {
        favGridEl.innerHTML = featured.map(veloraProductCardHTML).join('');
      }
    }
  }

  /* ---------- Productdetailpagina: gegevens uit VELORA_PRODUCTS laden op basis van ?id= ---------- */
  var pdTitleEl = document.querySelector('.pd-title');
  if (pdTitleEl && typeof VELORA_PRODUCTS !== 'undefined') {
    var pdParams = new URLSearchParams(window.location.search);
    var pdId = parseInt(pdParams.get('id'), 10);
    var pdProduct = VELORA_PRODUCTS.find(function (p) { return p.id === pdId; }) || VELORA_PRODUCTS[0];

    document.querySelector('.pd-brand').textContent = pdProduct.brand;
    pdTitleEl.textContent = pdProduct.name;
    document.title = pdProduct.name + ' — Velora Secrets';
    var pdPriceEl = document.querySelector('.pd-price');
    pdPriceEl.innerHTML = pdProduct.salePrice
      ? veloraFormatPrice(pdProduct.salePrice) + ' <del>' + veloraFormatPrice(pdProduct.price) + '</del>'
      : veloraFormatPrice(pdProduct.price);
    var crumbEl = document.querySelector('.breadcrumbs span');
    if (crumbEl) crumbEl.textContent = pdProduct.name;

    var relatedGridEl = document.querySelector('.related-section .product-grid');
    if (relatedGridEl) {
      var related = veloraFilterProducts({ cat: pdProduct.cat }).filter(function (p) { return p.id !== pdProduct.id; }).slice(0, 4);
      if (related.length) relatedGridEl.innerHTML = related.map(veloraProductCardHTML).join('');
    }
  }
  /* ---------- Verlanglijstpagina: lege of gevulde staat renderen ---------- */
  var wishlistGridEl = document.getElementById('wishlistGrid');
  function renderWishlistPage() {
    if (!wishlistGridEl || typeof veloraGetWishlist !== 'function' || typeof VELORA_PRODUCTS === 'undefined') return;
    var ids = veloraGetWishlist();
    var emptyEl = document.getElementById('wishlistEmptyState');
    var filledEl = document.getElementById('wishlistFilledState');
    var products = VELORA_PRODUCTS.filter(function (p) { return ids.indexOf(p.id) !== -1; });

    if (!products.length) {
      emptyEl.hidden = false;
      filledEl.hidden = true;
      return;
    }
    emptyEl.hidden = true;
    filledEl.hidden = false;
    wishlistGridEl.innerHTML = products.map(veloraProductCardHTML).join('');
  }
  renderWishlistPage();

  // Er is BEWUST geen lokale checkout-JS meer — "Naar afrekenen" op de
  // winkelwagenpagina stuurt de gebruiker rechtstreeks naar Shopify's eigen,
  // beveiligde checkoutUrl (zie renderCartPage hierboven en js/shopify-cart.js).
})();
