/**
 * SENTRY — Motion & Animation Engine
 * Handles: parallax, scroll-reveal, ripple, stagger, page transitions,
 *          card 3D tilt, scroll progress, scroll-down indicator,
 *          footer reveal, nav enhancements.
 *
 * No external dependencies. ~60fps target via rAF + passive listeners.
 */

'use strict';

/* ─── Utility ────────────────────────────────────────────── */

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/* rAF throttle — fires the callback once per animation frame */
function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fn.apply(this, args);
      ticking = false;
    });
  };
}

/* ─── 1. Page Transition Overlay ─────────────────────────── */
/**
 * Creates a full-screen navy overlay.
 * Fades OUT on page load → fades IN when clicking a same-site link.
 */
(function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'sry-overlay';
  document.body.appendChild(overlay);

  /* Fade out after page paint */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.opacity = '0';
    });
  });

  /* Intercept all internal <a> clicks */
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');

    /* Skip: hash anchors, external, mailto/tel, blank targets */
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('http') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();
    overlay.classList.add('sry-covering');

    setTimeout(() => {
      window.location.href = href;
    }, 440);
  });
}());


/* ─── 2. Scroll Progress Bar ──────────────────────────────── */
/**
 * Thin gradient line across the bottom of the nav
 * showing how far the user has scrolled.
 */
(function initScrollProgress() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const bar = document.createElement('div');
  bar.className = 'nav-progress';
  nav.appendChild(bar);

  const update = rafThrottle(function () {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? clamp((scrollTop / docHeight) * 100, 0, 100) : 0;
    bar.style.width = pct + '%';
  });

  window.addEventListener('scroll', update, { passive: true });
}());


/* ─── 3. Hero Parallax ────────────────────────────────────── */
/**
 * Moves hero background layers at fractional scroll speeds to
 * create a soft depth parallax effect.
 *
 * Speeds (fraction of scrollY):
 *   .hero-bg   → 0.28  (slowest — deepest layer)
 *   .hero-grid → 0.18  (medium)
 *   .hero-content → -0.06  (counter-scroll — slight foreground lift)
 */
(function initHeroParallax() {
  const hero    = document.querySelector('.hero');
  const heroBg  = document.querySelector('.hero-bg');
  const heroGrid = document.querySelector('.hero-grid');
  const heroContent = document.querySelector('.hero-content');

  if (!hero || !heroBg) return;

  const BG_SPEED      = 0.28;
  const GRID_SPEED    = 0.18;
  const CONTENT_SPEED = -0.06;

  const onScroll = rafThrottle(function () {
    const scrollY    = window.scrollY;
    const heroBottom = hero.getBoundingClientRect().bottom + scrollY;

    /* Only run parallax while the hero is visible */
    if (scrollY > heroBottom) return;

    heroBg.style.transform   = `translateY(${scrollY * BG_SPEED}px)`;
    if (heroGrid)    heroGrid.style.transform    = `translateY(${scrollY * GRID_SPEED}px)`;
    if (heroContent) heroContent.style.transform = `translateY(${scrollY * CONTENT_SPEED}px)`;
  });

  window.addEventListener('scroll', onScroll, { passive: true });
}());


/* ─── 4. Scroll-Down Hint ────────────────────────────────── */
/**
 * Injects a small "scroll" chevron indicator at the bottom of the hero.
 * Fades out once the user scrolls past 120px.
 */
(function initScrollHint() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const hint = document.createElement('div');
  hint.className = 'hero-scroll-hint';
  hint.innerHTML =
    '<span class="hero-scroll-hint__label">Scroll</span>' +
    '<span class="hero-scroll-hint__arrow"></span>';
  hero.appendChild(hint);

  const toggle = rafThrottle(function () {
    hint.classList.toggle('sry-hidden', window.scrollY > 120);
  });

  window.addEventListener('scroll', toggle, { passive: true });
}());


/* ─── 5. Enhanced Scroll Reveal (IntersectionObserver) ───── */
/**
 * Targets every .reveal element.
 * Automatically assigns stagger data-attributes to siblings
 * inside known container selectors so groups animate in sequence.
 */
(function initScrollReveal() {
  /* Auto-stagger direct children inside these containers */
  const STAGGER_CONTAINERS = [
    '.services-list',
    '.support-grid',
    '.why-list',
    '.footer-grid',
    '.philosophy-list',
    '.cta-pillars',
  ];

  STAGGER_CONTAINERS.forEach(selector => {
    const container = document.querySelector(selector);
    if (!container) return;

    const children = container.querySelectorAll('.reveal, .support-item, .why-item, .philosophy-item');
    children.forEach((child, i) => {
      if (!child.classList.contains('reveal')) {
        child.classList.add('reveal');
      }
      /* Assign stagger attribute for CSS transition-delay */
      const slot = Math.min(i + 1, 6);
      child.dataset.stagger = String(slot);
    });
  });

  /* Observe all .reveal elements */
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -36px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}());


/* ─── 6. Footer Reveal ────────────────────────────────────── */
/**
 * Adds the .footer-visible class to .footer-grid when the
 * footer enters the viewport, triggering the staggered column
 * reveal defined in animations.css.
 */
(function initFooterReveal() {
  const footerGrid = document.querySelector('.footer-grid');
  if (!footerGrid) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footerGrid.classList.add('footer-visible');
          observer.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(footerGrid);
}());


/* ─── 7. Button Ripple Effect ────────────────────────────── */
/**
 * On click, spawns an absolutely-positioned span that scales out
 * from the click point and fades — like Material Design ripple but
 * lighter / more premium.
 */
(function initRipple() {
  function spawnRipple(btn, x, y) {
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';

    Object.assign(ripple.style, {
      width:  size + 'px',
      height: size + 'px',
      left:   (x - size / 2) + 'px',
      top:    (y - size / 2) + 'px',
    });

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    spawnRipple(btn, e.clientX - rect.left, e.clientY - rect.top);
  });
}());


/* ─── 8. Service Card — Subtle 3D Tilt ──────────────────── */
/**
 * On mousemove inside a service card the card tilts ±4° in X/Y
 * based on cursor position — creates a sense of 3D depth.
 * Resets smoothly on mouse leave.
 *
 * Kept intentionally subtle (MAX_TILT = 4) to remain corporate/premium.
 */
(function initCardTilt() {
  const MAX_TILT  = 4;   /* degrees */
  const SCALE_UP  = 1.01;
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', rafThrottle(function (e) {
      const rect = card.getBoundingClientRect();
      const cx   = (e.clientX - rect.left)  / rect.width  - 0.5;   /* -0.5 → 0.5 */
      const cy   = (e.clientY - rect.top)   / rect.height - 0.5;

      const rotX = (-cy * MAX_TILT).toFixed(2);
      const rotY = ( cx * MAX_TILT).toFixed(2);

      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) ` +
        `translateY(-10px) scale(${SCALE_UP})`;
    }));

    card.addEventListener('mouseleave', function () {
      card.style.transition =
        'transform .55s cubic-bezier(0.25,1,0.5,1), border-color .30s ease, box-shadow .38s ease';
      card.style.transform = '';

      /* Remove the extra transition override after it settles */
      card.addEventListener('transitionend', function handler() {
        card.style.transition = '';
        card.removeEventListener('transitionend', handler);
      }, { once: true });
    });
  });
}());


/* ─── 9. Why-Item Reveal Counter ─────────────────────────── */
/**
 * Animates the why-number from dim to silver as each row enters
 * the viewport — reinforces the "reading through a list" motion.
 */
(function initWhyReveal() {
  const items = document.querySelectorAll('.why-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('why-active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  items.forEach(item => observer.observe(item));
}());


/* ─── 10. Smooth Anchor Scroll ───────────────────────────── */
/**
 * Intercepts hash-only links and scrolls smoothly, accounting for
 * the fixed nav height.
 */
(function initSmoothScroll() {
  const NAV_OFFSET = 90; /* px */

  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}());


/* ─── 11. Support Item — Stagger on Scroll ───────────────── */
/**
 * When the support grid enters the viewport, apply a staggered
 * opacity/transform reveal to each item in sequence.
 * (Complements the CSS stagger-data system.)
 */
(function initSupportStagger() {
  const grid = document.querySelector('.support-grid');
  if (!grid) return;

  const items = grid.querySelectorAll('.support-item');

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 80);
        });
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(grid);
}());


/* ─── 12. Nav Link Active Highlight on Scroll ────────────── */
/**
 * Updates the .active class on nav links based on the current
 * visible section — the CSS sliding underline follows automatically.
 */
(function initNavActiveOnScroll() {
  const sections  = document.querySelectorAll('section[id], .cta-section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const update = rafThrottle(function () {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 130) current = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${current}` || href === `${window.location.pathname}#${current}`);
    });
  });

  window.addEventListener('scroll', update, { passive: true });
}());


/* ─── 13. Hamburger Morph ─────────────────────────────────── */
/**
 * Adds a visual morph animation (X shape) to hamburger lines
 * when the mobile nav is open.
 */
(function initHamburgerMorph() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  const spans = btn.querySelectorAll('span');

  function setOpen(isOpen) {
    btn.classList.toggle('is-open', isOpen);
    if (spans.length >= 3) {
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    }
  }

  btn.style.transition = 'transform .2s ease';
  spans.forEach(s => {
    s.style.transition = 'transform .3s cubic-bezier(0.25,1,0.5,1), opacity .2s ease';
  });

  /* Sync with main.js mobile nav toggle */
  const observer = new MutationObserver(() => {
    setOpen(nav.classList.contains('open'));
  });
  observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
}());


/* ─── 14. CTA Section — Text Word Reveal ─────────────────── */
/**
 * When the CTA section enters the viewport, the headline words
 * each slide up sequentially — adds extra emphasis to the
 * centrepiece message.
 */
(function initCtaWordReveal() {
  const headline = document.querySelector('.cta-headline');
  if (!headline) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        headline.style.opacity = '1';

        /* Split text nodes into word-spans inside the existing elements */
        headline.querySelectorAll('*').forEach(el => {
          if (el.children.length) return; /* skip nested elements */
          const words = el.textContent.trim().split(/\s+/);
          if (words.length <= 1) return;

          el.innerHTML = words
            .map((w, i) =>
              `<span class="cta-word" style="display:inline-block;opacity:0;transform:translateY(20px);` +
              `transition:opacity .5s ease ${i * 0.07 + 0.1}s,transform .5s cubic-bezier(0.25,1,0.5,1) ${i * 0.07 + 0.1}s">${w}</span> `
            )
            .join('');

          requestAnimationFrame(() => {
            el.querySelectorAll('.cta-word').forEach(span => {
              span.style.opacity   = '1';
              span.style.transform = 'translateY(0)';
            });
          });
        });

        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(headline);
}());


/* ─── 15. Touch Device Detection ────────────────────────── */
/**
 * Adds .is-touch to <html> when a touch device is detected.
 * Used by CSS to disable 3D tilt and hover states on those devices.
 */
(function detectTouch() {
  const isTouch =
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (isTouch) document.documentElement.classList.add('is-touch');
}());


/* ─── 16. Disable Card Tilt on Touch Devices ─────────────── */
/**
 * Overrides the 3D-tilt mousemove handler on touch screens
 * so cards never get stuck in a tilted state.
 * The guard is set before initCardTilt runs — but since initCardTilt
 * already ran (module 8), we unbind it here for touch devices.
 */
(function guardTouchTilt() {
  if (!document.documentElement.classList.contains('is-touch')) return;
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.transform = '';
  });
}());


/* ─── 17. Responsive Parallax Guard ─────────────────────── */
/**
 * Disables hero parallax transforms on mobile to avoid
 * the subtle judder that occurs on low-powered devices.
 * Parallax was set up in module 3; this patches the handler.
 */
(function guardMobileParallax() {
  const MOBILE_BP = 768;

  function resetParallax() {
    ['.hero-bg', '.hero-grid', '.hero-content'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.transform = '';
    });
  }

  /* Re-check on resize */
  let wasMobile = window.innerWidth <= MOBILE_BP;

  window.addEventListener('resize', rafThrottle(function () {
    const isMobile = window.innerWidth <= MOBILE_BP;
    if (isMobile && !wasMobile) resetParallax();
    wasMobile = isMobile;
  }), { passive: true });

  /* Initial reset if already mobile */
  if (window.innerWidth <= MOBILE_BP) resetParallax();
}());


/* ================================================================
   18. 3D TESTIMONIAL CAROUSEL — SentryCarousel
   ================================================================

   Position class map (relative to this.current):
     offset  0   → is-center
     offset +1   → is-right-1
     offset -1   → is-left-1
     offset +2   → is-right-2
     offset -2   → is-left-2
     anything else → is-hidden

   Supports: click prev/next · dot navigation · touch swipe ·
             keyboard ArrowLeft/Right · auto-advance (5.5 s) ·
             pause on hover · click side card to focus it
================================================================ */

class SentryCarousel {
  /**
   * @param {HTMLElement} el - The .carousel-wrapper element
   */
  constructor(el) {
    this.el      = el;
    this.track   = el.querySelector('.carousel-track');
    this.cards   = [...el.querySelectorAll('.testi-card')];
    this.dots    = [...el.querySelectorAll('.carousel-dot')];
    this.prevBtn = el.querySelector('.carousel-prev');
    this.nextBtn = el.querySelector('.carousel-next');

    this.total     = this.cards.length;
    this.current   = 0;
    this.timer     = null;
    this.busy      = false;        /* guard against rapid advances */
    this.BUSY_TIME = 680;         /* ms — matches CSS transition */
    this.AUTO_MS   = 5500;        /* auto-advance interval */
    this.SWIPE_MIN = 50;          /* px to count as intentional swipe */
    this._touchX   = 0;

    this._init();
  }

  /* ── Initialise ─────────────────────────────────────────── */
  _init() {
    this._render();
    this._bindEvents();
    this._startAuto();
  }

  /* ── Position class for card at index i ─────────────────── */
  _posClass(i) {
    let off = ((i - this.current) % this.total + this.total) % this.total;
    /* Convert to signed range: e.g. with 5 cards, offset 4 → -1 */
    if (off > Math.floor(this.total / 2)) off -= this.total;

    switch (off) {
      case  0: return 'is-center';
      case  1: return 'is-right-1';
      case -1: return 'is-left-1';
      case  2: return 'is-right-2';
      case -2: return 'is-left-2';
      default: return 'is-hidden';
    }
  }

  /* ── Apply position classes + ARIA ─────────────────────── */
  _render() {
    const POS_CLASSES = ['is-center','is-left-1','is-right-1','is-left-2','is-right-2','is-hidden'];

    this.cards.forEach((card, i) => {
      POS_CLASSES.forEach(c => card.classList.remove(c));
      const pos = this._posClass(i);
      card.classList.add(pos);

      const isCenter = pos === 'is-center';
      card.setAttribute('aria-hidden', String(!isCenter));
      card.setAttribute('tabindex',    isCenter ? '0' : '-1');
    });

    /* Dots */
    this.dots.forEach((dot, i) => {
      const active = i === this.current;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
  }

  /* ── Advance by direction (-1 or +1) ───────────────────── */
  advance(dir) {
    if (this.busy) return;
    this.busy = true;
    this.current = ((this.current + dir) % this.total + this.total) % this.total;
    this._render();
    setTimeout(() => { this.busy = false; }, this.BUSY_TIME);
  }

  /* ── Jump to specific index ─────────────────────────────── */
  goTo(idx) {
    if (this.busy || idx === this.current) return;
    this.busy = true;
    this.current = idx;
    this._render();
    setTimeout(() => { this.busy = false; }, this.BUSY_TIME);
  }

  /* ── Auto-advance ───────────────────────────────────────── */
  _startAuto() {
    this.timer = setInterval(() => this.advance(1), this.AUTO_MS);
  }
  _stopAuto()  { clearInterval(this.timer); }
  _resetAuto() { this._stopAuto(); this._startAuto(); }

  /* ── Event bindings ─────────────────────────────────────── */
  _bindEvents() {

    /* Prev / Next buttons */
    this.prevBtn?.addEventListener('click', () => { this.advance(-1); this._resetAuto(); });
    this.nextBtn?.addEventListener('click', () => { this.advance( 1); this._resetAuto(); });

    /* Dot navigation */
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { this.goTo(i); this._resetAuto(); });
    });

    /* Click a side card to bring it to center */
    this.cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        if (i !== this.current) { this.goTo(i); this._resetAuto(); }
      });
    });

    /* Keyboard: ArrowLeft / ArrowRight */
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this.advance(-1); this._resetAuto(); }
      if (e.key === 'ArrowRight') { this.advance( 1); this._resetAuto(); }
    });

    /* Touch swipe */
    this.el.addEventListener('touchstart', (e) => {
      this._touchX = e.touches[0].clientX;
    }, { passive: true });

    this.el.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - this._touchX;
      if (Math.abs(delta) >= this.SWIPE_MIN) {
        this.advance(delta > 0 ? -1 : 1);
        this._resetAuto();
      }
    }, { passive: true });

    /* Pause on hover (desktop) */
    this.el.addEventListener('mouseenter', () => this._stopAuto());
    this.el.addEventListener('mouseleave', () => this._startAuto());
  }
}


/* ── Bootstrap carousel on DOMContentLoaded ──────────────── */
(function initCarousel() {
  const wrapper = document.getElementById('sry-carousel');
  if (!wrapper) return;

  /* Wait for fonts / layout so card heights are stable */
  if (document.readyState === 'complete') {
    new SentryCarousel(wrapper);
  } else {
    window.addEventListener('load', () => new SentryCarousel(wrapper), { once: true });
  }
}());
