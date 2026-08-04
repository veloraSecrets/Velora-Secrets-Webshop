/* ============================================
   VELORA SECRETS — DEMO-AUTHENTICATIE (localStorage)
   ============================================
   BELANGRIJK: dit is een client-side DEMO zodat login/registreren/account
   al zichtbaar werken vóór er een echte backend is. Wachtwoorden staan
   hier in leesbare vorm in localStorage — dat is NOOIT geschikt voor
   productie. Vervang dit volledig door echte server-side authenticatie
   (gehashte wachtwoorden, sessies/JWT) zodra de backend wordt aangesloten. */

var VELORA_USERS_KEY = 'velora_demo_users';
var VELORA_SESSION_KEY = 'velora_demo_session';

function veloraGetUsers() {
  try {
    var raw = localStorage.getItem(VELORA_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

var VELORA_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function veloraRegister(name, email, password) {
  var nameTrimmed = String(name || '').trim();
  var emailLower = String(email || '').toLowerCase().trim();
  if (!nameTrimmed || !VELORA_EMAIL_REGEX.test(emailLower) || !password || String(password).length < 6) {
    return { ok: false, error: 'Vul een geldige naam, e-mailadres en wachtwoord (min. 6 tekens) in.' };
  }
  var users = veloraGetUsers();
  if (users.some(function (u) { return u.email === emailLower; })) {
    return { ok: false, error: 'Er bestaat al een account met dit e-mailadres.' };
  }
  users.push({ name: nameTrimmed, email: emailLower, password: password });
  try { localStorage.setItem(VELORA_USERS_KEY, JSON.stringify(users)); } catch (e) { /* geen opslag beschikbaar */ }
  veloraSetSession(emailLower);
  return { ok: true };
}

function veloraLogin(email, password) {
  var users = veloraGetUsers();
  var emailLower = String(email).toLowerCase().trim();
  var user = users.find(function (u) { return u.email === emailLower && u.password === password; });
  if (!user) {
    return { ok: false, error: 'E-mailadres of wachtwoord onjuist.' };
  }
  veloraSetSession(emailLower);
  return { ok: true };
}

function veloraSetSession(email) {
  try { localStorage.setItem(VELORA_SESSION_KEY, email); } catch (e) { /* geen opslag beschikbaar */ }
}

function veloraLogout() {
  try { localStorage.removeItem(VELORA_SESSION_KEY); } catch (e) { /* geen opslag beschikbaar */ }
}

function veloraGetCurrentUser() {
  try {
    var email = localStorage.getItem(VELORA_SESSION_KEY);
    if (!email) return null;
    return veloraGetUsers().find(function (u) { return u.email === email; }) || null;
  } catch (e) {
    return null;
  }
}
