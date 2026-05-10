# Sentry — Business Consultancy & Startup Acceleration

> Premium landing page for a UK-based business consultancy and startup accelerator. Designed with a futuristic, data-driven aesthetic — deep blue palette, metallic white, animated particles, and smooth scroll interactions.

---

## Table of Contents

- [Overview](#overview)
- [Live Preview](#live-preview)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Design System](#design-system)
- [Sections](#sections)
- [JavaScript Modules](#javascript-modules)
- [CSS Architecture](#css-architecture)
- [Customisation Guide](#customisation-guide)
- [Performance](#performance)
- [Browser Support](#browser-support)

---

## Overview

| Property     | Detail                                      |
|--------------|---------------------------------------------|
| **Project**  | Sentry — Landing Page                       |
| **Type**     | Static HTML / CSS / Vanilla JS              |
| **Market**   | United Kingdom                              |
| **Industry** | Business Consultancy & Startup Acceleration |
| **Language** | English (en-GB)                             |
| **Currency** | GBP (£)                                     |

Sentry is positioned as the UK's premier consultancy for founders and businesses. The landing page is designed to communicate authority, precision, and measurable impact — converting visitors into consultation bookings.

---

## Live Preview

Open directly in any browser — no build step, no dependencies, no server required:

```
consultans/index.html
```

Double-click `index.html` or open via your IDE's Live Server extension.

---

## Project Structure

```
consultans/
│
├── index.html                  # Main HTML entry point (clean, no inline styles)
│
├── assets/
│   ├── css/
│   │   └── styles.css          # All styles — 21 organised sections (27.6 KB)
│   └── js/
│       └── main.js             # All JavaScript — 6 IIFE modules (5.7 KB)
│
├── imagen/
│   └── logo.png                # Sentry shield logo (51.7 KB)
│
├── CLAUDE.md                   # AI assistant project instructions
└── README.md                   # This file
```

### File Responsibilities

| File | Responsibility |
|------|----------------|
| `index.html` | Semantic HTML structure, section layout, content copy |
| `assets/css/styles.css` | Visual design, animations, responsive breakpoints |
| `assets/js/main.js` | Interactivity — particles, scroll effects, counters |
| `imagen/logo.png` | Brand logo — used in navbar and footer |

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Markup | HTML5 (semantic) | Accessibility, SEO, clean structure |
| Styles | CSS3 — Custom Properties, Grid, Flexbox | No framework dependency, full control |
| Scripts | Vanilla JavaScript (ES6+) | Zero dependencies, maximum performance |
| Fonts | Inter (Google Fonts) | Modern, high-legibility, corporate feel |
| Animations | CSS keyframes + Canvas API | Smooth, GPU-accelerated |
| Observers | IntersectionObserver API | Efficient scroll-based triggers |

**No frameworks. No bundlers. No npm. No build step.**

---

## Design System

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--blue-deep` | `#030b1a` | Page background |
| `--blue-dark` | `#060f27` | Section backgrounds |
| `--blue-mid` | `#0a1f4e` | CTA section background |
| `--blue-primary` | `#1a4fd8` | Primary buttons, gradients |
| `--blue-electric` | `#3b82f6` | Accents, borders, icons |
| `--blue-glow` | `#60a5fa` | Glow effects, metric values |
| `--blue-accent` | `#93c5fd` | Subtle highlights |
| `--silver` | `#e2e8f0` | Body text on dark |
| `--white` | `#ffffff` | Headlines, key text |
| `--text-muted` | `#94a3b8` | Descriptions, labels |

All tokens are defined as CSS custom properties in `:root` inside `styles.css`.

### Typography

**Font:** [Inter](https://fonts.google.com/specimen/Inter) — loaded via Google Fonts.

| Role | Weight | Size |
|------|--------|------|
| Hero headline | 900 | `clamp(2.8rem, 6vw, 5rem)` |
| Section title | 800 | `clamp(2rem, 4vw, 3rem)` |
| CTA headline | 900 | `clamp(2rem, 4vw, 3.5rem)` |
| Body / Sub | 400 | `1.1–1.2rem` |
| Labels / Tags | 600 | `0.7–0.85rem` |

### Glow Effects

```css
--glow-sm: 0 0 20px rgba(59, 130, 246, .25);
--glow-md: 0 0 40px rgba(59, 130, 246, .35);
--glow-lg: 0 0 80px rgba(59, 130, 246, .40);
```

### Spacing Scale

Cards and sections use multiples of `4px`. Core spacers: `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `120px`.

---

## Sections

The landing page is divided into **8 core sections**:

### 1. Navigation
- Fixed position, transparent on load
- Becomes frosted glass (`backdrop-filter: blur`) on scroll
- Logo: `imagen/logo.png` + wordmark
- Mobile: hamburger menu toggle
- Active link highlighting via scroll position

### 2. Hero
- Full-viewport height
- Animated particle network (Canvas API)
- Perspective grid background
- Radial gradient atmosphere
- Floating analytics dashboard card (hover animation)
- Animated metric counters (150+, 94%, £280M+, 12 years)
- Dual CTA buttons: *Book a Strategy Call* / *Explore Our Services*

### 3. About Sentry
- Two-column grid: copy + visual card
- Animated orbit rings (CSS `@keyframes spin`)
- Four feature cards with hover lift
- Stats: 150+ Clients, 18 Industries, 4.9★ Rating

### 4. Core Services
- 3×2 card grid
- Six service areas (numbered 01–06)
- Top border glow on hover
- Radial glow pseudo-element on hover
- Cards animate upward on hover (`translateY(-6px)`)

### 5. Why Sentry
- Two-column: points list + chart card
- Five value propositions with icon boxes
- Before/After bar chart (CSS custom properties for heights)
- 2.4× revenue multiplier highlight

### 6. Case Studies
- 3-column card grid
- UK-specific industries: London FinTech, UK Retail, UK SaaS
- Metrics: £2.4M seed, 60% cost reduction, £145K MRR
- Gradient divider between description and metrics

### 7. Testimonials
- 3-column card grid
- 5-star ratings
- UK cities: London, Manchester, Edinburgh
- Avatar initials with blue gradient glow

### 8. CTA + Footer
- Full-width deep blue gradient CTA with radial glow
- Email link to `hello@sentry-consulting.co.uk`
- Four trust signals
- Footer: 4-column grid — brand, services, company, contact
- UK phone: `+44 (0) 20 7946 0800`
- Copyright: Registered in England & Wales

---

## JavaScript Modules

All modules are wrapped in **IIFEs** (`immediately invoked function expressions`) to avoid polluting the global scope. Each module is self-contained and defensive — it checks for element existence before running.

### `initParticles()`
```
Canvas-based particle network.
- 70 particles, random position and velocity
- Draws connection lines between particles < 110px apart
- Respects window resize
- Runs on requestAnimationFrame loop
```

### `initNavbar()`
```
Scroll state management.
- Adds .scrolled class to <nav> when scrollY > 60px
- Triggers frosted glass + border-bottom effect
- Uses passive scroll listener for performance
```

### `initActiveNav()`
```
Active link highlight.
- Tracks scroll position against section offsets
- Sets current nav link colour to white
- 120px offset to trigger before section reaches top
```

### `initHamburger()`
```
Mobile menu toggle.
- Toggles .nav-links display between flex/none
- Updates aria-expanded attribute for accessibility
```

### `initScrollReveal()`
```
Scroll-triggered reveal animations.
- IntersectionObserver on all .reveal elements
- Adds .visible class when element enters viewport
- threshold: 0.12, rootMargin: -40px bottom
- CSS handles the opacity + translateY transition
```

### `initCounters()`
```
Animated number counters.
- Targets elements with [data-target] attribute
- Supports [data-prefix] (e.g. "£") and [data-suffix] (e.g. "M+")
- 1800ms duration with cubic ease-out curve
- IntersectionObserver triggers animation once on entry
```

---

## CSS Architecture

`styles.css` is divided into **21 labelled sections**:

```
 1. Custom Properties      — all design tokens in :root
 2. Reset & Base           — box-sizing, body, noise overlay
 3. Scrollbar              — webkit custom scrollbar
 4. Canvas Particles       — fixed canvas positioning
 5. Layout Utilities       — .container, .section, .section-header
 6. Typography Utilities   — .section-title, .gradient-text, .section-sub
 7. Tag Badge              — .tag, .cta-tag
 8. Buttons                — .btn, .btn-primary, .btn-outline, .btn-lg, .btn-sm
 9. Navigation             — nav, .nav-logo, .nav-links, .hamburger
10. Hero Section           — .hero, .hero-bg, .hero-grid, metrics
11. Hero Dashboard Card    — .hero-card, .kpi-box, .bar-fill, .hc-*
12. About Section          — .about-grid, .feat-card, orbit system
13. Services Section       — .services-grid, .service-card, hover effects
14. Why Sentry Section     — .why-grid, .why-point, chart card
15. Case Studies Section   — .cases-grid, .case-card, .case-metrics
16. Testimonials Section   — .testi-grid, .testi-card, .ta-avatar
17. CTA Section            — .cta-section, .cta-bg, .cta-glow
18. Footer                 — .footer-grid, .footer-logo, .social-btn
19. Scroll Reveal          — .reveal, .reveal.visible
20. Keyframe Animations    — pulse-dot, float, bar-grow, bar-up, spin
21. Responsive             — breakpoints at 1024px and 768px
```

### CSS Custom Properties for Dynamic Bar Values

Chart bars use CSS custom properties passed via `style` attribute — keeping HTML semantic and CSS in control of rendering:

```html
<!-- HTML passes only the data value -->
<div class="c-bar" style="--bar-h:82%;--bar-delay:.1s"></div>
```

```css
/* CSS reads and applies it */
.c-bar {
  height: var(--bar-h, 80%);
  animation-delay: var(--bar-delay, 0s);
}
```

---

## Customisation Guide

### Change Brand Colours

Edit the `:root` block at the top of `assets/css/styles.css`:

```css
:root {
  --blue-primary:  #1a4fd8;  /* ← main brand colour */
  --blue-electric: #3b82f6;  /* ← accent / hover */
  --blue-glow:     #60a5fa;  /* ← glow / highlight */
}
```

### Update Hero Metrics

In `index.html`, find the `.hero-metrics` block and edit the `data-*` attributes:

```html
<div class="metric-value" data-prefix="£" data-target="280" data-suffix="M+">£0M+</div>
```

| Attribute | Purpose |
|-----------|---------|
| `data-target` | Final number the counter animates to |
| `data-prefix` | Text before the number (e.g. `£`) |
| `data-suffix` | Text after the number (e.g. `M+`, `%`) |

### Add a New Service Card

Copy this block inside `.services-grid` in `index.html`:

```html
<div class="service-card reveal">
  <div class="sc-number">07</div>
  <div class="sc-icon">🌐</div>
  <div class="sc-title">Your Service Title</div>
  <div class="sc-desc">Short description of the service and its value to the client.</div>
  <div class="sc-value">Your value proposition</div>
</div>
```

> Note: The grid is `repeat(3, 1fr)`. Adding a 7th card will start a new row automatically.

### Change the Logo

Replace `imagen/logo.png` with your new image file. The logo renders at:
- **Navbar:** `height: 40px`
- **Footer:** `height: 36px`

Both sizes are defined in `assets/css/styles.css` under sections 9 and 18.

### Update Contact Details

Search `index.html` for these strings and replace:

| Find | Replace with |
|------|-------------|
| `hello@sentry-consulting.co.uk` | Your email |
| `+44 (0) 20 7946 0800` | Your phone |
| `London · Manchester · Edinburgh` | Your cities |

### Adjust Particle Count or Density

In `assets/js/main.js`, inside `initParticles()`:

```js
const PARTICLE_COUNT  = 70;   // number of particles
const CONNECTION_DIST = 110;  // max distance (px) to draw a connection line
```

---

## Performance

| Metric | Approach |
|--------|----------|
| **No framework overhead** | Pure HTML/CSS/JS — zero build step |
| **Passive scroll listeners** | `{ passive: true }` on all scroll events |
| **IntersectionObserver** | No scroll-based layout recalculations |
| **CSS animations** | `transform` and `opacity` only — GPU-composited |
| **Font preconnect** | `<link rel="preconnect">` for Google Fonts |
| **Canvas RAF** | Particle loop uses `requestAnimationFrame` |
| **Single CSS file** | One HTTP request for all styles |
| **Single JS file** | One HTTP request for all scripts |

---

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome 88+ | ✅ Full |
| Firefox 85+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 88+ | ✅ Full |
| Opera 74+ | ✅ Full |
| IE 11 | ❌ Not supported |

Features used that require modern browsers: `IntersectionObserver`, CSS Custom Properties, `backdrop-filter`, `clamp()`, CSS Grid, Canvas API.

---

## Contact

**Sentry Consulting Group Ltd.**
Registered in England & Wales

- Email: [hello@sentry-consulting.co.uk](mailto:hello@sentry-consulting.co.uk)
- Phone: +44 (0) 20 7946 0800
- Offices: London · Manchester · Edinburgh

---

*Built with HTML5, CSS3, and Vanilla JavaScript. No frameworks. No dependencies.*
