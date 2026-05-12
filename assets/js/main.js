'use strict';

/* ─── 1. Navbar Scroll State ─────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}());


/* ─── 2. Mobile Nav ──────────────────────────────────────── */
(function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const closeBtn   = document.getElementById('mobile-nav-close');
  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
}());


/* ─── 3. Scroll Reveal (IntersectionObserver) ────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  });

  elements.forEach(el => observer.observe(el));
}());
