/* ============================================
   VELORA SECRETS — VERLANGLIJST (localStorage)
   ============================================ */

var VELORA_WISHLIST_KEY = 'velora_wishlist';

function veloraGetWishlist() {
  try {
    var raw = localStorage.getItem(VELORA_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function veloraSaveWishlist(ids) {
  try {
    localStorage.setItem(VELORA_WISHLIST_KEY, JSON.stringify(ids));
  } catch (e) {
    // localStorage niet beschikbaar — verlanglijst werkt dan alleen binnen de huidige pagina.
  }
  veloraUpdateWishlistBadge();
}

function veloraIsInWishlist(productId) {
  return veloraGetWishlist().indexOf(productId) !== -1;
}

function veloraToggleWishlist(productId) {
  productId = parseInt(productId, 10);
  if (!Number.isInteger(productId)) return false;
  var ids = veloraGetWishlist();
  var idx = ids.indexOf(productId);
  var nowActive;
  if (idx === -1) {
    ids.push(productId);
    nowActive = true;
  } else {
    ids.splice(idx, 1);
    nowActive = false;
  }
  veloraSaveWishlist(ids);
  return nowActive;
}

function veloraUpdateWishlistBadge() {
  var badge = document.querySelector('.wishlist-count');
  if (badge) badge.textContent = String(veloraGetWishlist().length);
}
