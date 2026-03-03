'use strict';
let currentLang = 'de';

function toggleLang() {
  currentLang = currentLang === 'de' ? 'en' : 'de';
  localStorage.setItem('lang', currentLang);
  applyLang(currentLang);
}

function applyLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'de' ? 'EN' : 'DE';
  document.querySelectorAll('[data-de][data-en]').forEach(el => {
    el.textContent = el.getAttribute('data-' + lang);
  });
  document.querySelectorAll('[data-placeholder-de][data-placeholder-en]').forEach(el => {
    el.setAttribute('placeholder', el.getAttribute('data-placeholder-' + lang));
  });
  document.documentElement.setAttribute('lang', lang);
  document.title = lang === 'de' ? 'JV Media' : 'JV Media';
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
}

document.addEventListener('click', function (e) {
  const menu = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (!menu || !hamburger) return;
  if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
    menu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  elements.forEach(el => observer.observe(el));
})();

// ── EmailJS Configuration ────────────────────────────────────────────────────
// Setup steps:
//   1. Go to https://emailjs.com and create a free account
//   2. "Add New Service" → connect Gmail (jakob@vrabitsch-media.com)
//   3. "Create New Template" → use variables: {{from_name}}, {{from_email}}, {{message}}
//   4. Replace the three placeholder values below with your real IDs
//      (Account → API Keys for the Public Key, Email Services for Service ID,
//       Email Templates for Template ID)
const EMAILJS_SERVICE_ID  = 'service_10l9e1k';
const EMAILJS_TEMPLATE_ID = 'template_lpkzh6s';
const EMAILJS_PUBLIC_KEY  = 'WOc8_cfcnHUXzKOva';

if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');

  // Validate inputs
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(el => el.classList.remove('error'));
  let valid = true;
  inputs.forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      el.classList.add('error'); valid = false;
    }
  });
  if (!valid) return;

  // Loading state
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.6';
  const btnSpan = submitBtn.querySelector('span');
  if (btnSpan) btnSpan.textContent = currentLang === 'de' ? 'Wird gesendet\u2026' : 'Sending\u2026';

  const templateParams = {
    name:    form.querySelector('[name="name"]').value,
    email:   form.querySelector('[name="email"]').value,
    message: form.querySelector('[name="message"]').value,
  };

  if (typeof emailjs === 'undefined' || EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
    // EmailJS not yet configured – show setup reminder
    if (successMsg) {
      successMsg.style.color = '#f59e0b';
      successMsg.textContent = currentLang === 'de'
        ? '\u26a0\ufe0f EmailJS noch nicht konfiguriert. Bitte Service-ID in script.js eintragen.'
        : '\u26a0\ufe0f EmailJS not configured yet. Please add your Service ID to script.js.';
      successMsg.classList.add('visible');
    }
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    if (btnSpan) btnSpan.textContent = currentLang === 'de' ? 'Nachricht senden' : 'Send message';
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(() => {
      if (successMsg) {
        successMsg.style.color = '';
        successMsg.textContent = currentLang === 'de'
          ? '\u2713 Danke! Wir melden uns bald bei dir.'
          : '\u2713 Thanks! We\'ll be in touch soon.';
        successMsg.classList.add('visible');
      }
      form.reset();
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        if (btnSpan) btnSpan.textContent = currentLang === 'de' ? 'Nachricht senden' : 'Send message';
        if (successMsg) successMsg.classList.remove('visible');
      }, 5000);
    })
    .catch(() => {
      if (successMsg) {
        successMsg.style.color = '#ef4444';
        successMsg.textContent = currentLang === 'de'
          ? '\u2717 Fehler beim Senden. Bitte versuche es erneut.'
          : '\u2717 Error sending. Please try again.';
        successMsg.classList.add('visible');
      }
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      if (btnSpan) btnSpan.textContent = currentLang === 'de' ? 'Nachricht senden' : 'Send message';
    });
}

// ── Cookie Consent ───────────────────────────────────────────────────────────
(function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;
  if (!localStorage.getItem('cookieConsent')) {
    // Small delay so the page renders first
    setTimeout(() => banner.classList.add('visible'), 800);
  }
})();

function acceptCookies() {
  localStorage.setItem('cookieConsent', '1');
  const banner = document.getElementById('cookieBanner');
  if (banner) banner.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', function () {
  currentLang = localStorage.getItem('lang') || 'de';
  applyLang(currentLang);
});
