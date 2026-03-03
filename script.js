'use strict';
let currentLang = 'de';

function toggleLang() {
  currentLang = currentLang === 'de' ? 'en' : 'de';
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
  document.title = lang === 'de' ? 'JV Media \u2013 Social Media Agentur' : 'JV Media \u2013 Social Media Agency';
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

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(el => el.classList.remove('error'));
  let valid = true;
  inputs.forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
      el.classList.add('error');
      valid = false;
    }
  });
  if (!valid) return;
  const nameEl = form.querySelector('[name="name"]');
  const emailEl = form.querySelector('[name="email"]');
  const messageEl = form.querySelector('[name="message"]');
  const subject = encodeURIComponent('Anfrage \u00fcber JV Media Website');
  const body = encodeURIComponent('Name: ' + nameEl.value + '\nE-Mail: ' + emailEl.value + '\n\nNachricht:\n' + messageEl.value);
  window.location.href = 'mailto:jakob@vrabitsch-media.com?subject=' + subject + '&body=' + body;
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.6';
  if (successMsg) {
    successMsg.textContent = currentLang === 'de'
      ? '\u2713 Danke! Dein E-Mail-Client wird ge\u00f6ffnet.'
      : '\u2713 Thanks! Your email client will open.';
    successMsg.classList.add('visible');
  }
  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    if (successMsg) successMsg.classList.remove('visible');
  }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
  applyLang(currentLang);
});
