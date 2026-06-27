/*!
 * GSAP SCROLLTRIGGER — Mujeeb Portfolio (v4 — with book flip)
 */

gsap.registerPlugin(ScrollTrigger);

/* ── helpers ─────────────────────────────────────────── */
const sel  = (s, ctx) => (ctx || document).querySelectorAll(s);
const page = () => (location.pathname.split('/').pop() || 'index.html');

/* Set elements invisible BEFORE first paint ─────────────── */
function hideForGSAP(selector, extra) {
  const els = sel(selector);
  if (!els.length) return;
  gsap.set(els, { autoAlpha: 0, ...extra });
}

function initHide() {
  const p = page();

  /* Always hide these */
  hideForGSAP('.eyebrow');
  hideForGSAP('.sec-title');
  hideForGSAP('.sec-sub');
  hideForGSAP('.footer-col');
  hideForGSAP('.footer-brand');
  hideForGSAP('.footer-bot');

  if (p === 'index.html' || p === '') {
    hideForGSAP('.hero-badge',     { y: 30 });
    hideForGSAP('.hero-title',     { y: 50 });
    hideForGSAP('.hero-typing',    { y: 20 });
    hideForGSAP('.hero-desc',      { y: 20 });
    hideForGSAP('.hero-stats .stat', { y: 30 });
    hideForGSAP('.hero-btns .btn', { y: 20 });
    hideForGSAP('.hero-visual',    { x: 60 });
    hideForGSAP('.pr-badge',       { scale: 0 });
    hideForGSAP('.av-item',        { x: -30 });
    hideForGSAP('.av-div',         { scaleY: 0 });
    hideForGSAP('.cta-box',        { y: 60 });
    hideForGSAP('.ct',             { y: 14 });
  }

  if (p === 'about.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.about-ph',        { scale: 0.82 });
    hideForGSAP('.af-card',         { x: 40 });
    hideForGSAP('.about-text',      { x: 50 });
    hideForGSAP('.hi',              { x: -24 });
    hideForGSAP('.info-card',       { y: 50 });
    hideForGSAP('.ic-icon',         { scale: 0, rotate: -180 });
    hideForGSAP('.ic-num',          { scale: 0.4 });
    hideForGSAP('.section.sec-alt .glass', { x: -40 });
  }

  if (p === 'skills.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.tab',             { y: 20, scale: 0.85 });
    hideForGSAP('.sk-card',         { y: 40 });
    hideForGSAP('.sk-icon',         { scale: 0, rotate: -90 });
  }

  if (p === 'experience.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.tl-dot',          { scale: 0 });
    hideForGSAP('.tl-card',         { x: 60 });
    hideForGSAP('.tl-list li',      { x: 20 });
    hideForGSAP('.wc',              { y: 50 });
    hideForGSAP('.wc-icon',         { scale: 0, rotate: -30 });
  }

  if (p === 'projects.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.proj-card',       { y: 40 });
    hideForGSAP('.proj-badge',      { scale: 0 });
    hideForGSAP('.pa',              { y: 14 });
  }

  if (p === 'certifications.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.cert-card',       { y: 50 });
    hideForGSAP('.cert-icon',       { scale: 0, rotate: 180 });
    hideForGSAP('.cert-badge',      { y: -20, scale: 0.6 });
    hideForGSAP('.cert-link',       { x: -16 });
  }

  if (p === 'contact.html') {
    hideForGSAP('.page-hero-title', { y: 50 });
    hideForGSAP('.breadcrumb',      { x: -30 });
    hideForGSAP('.ci',              { x: -40 });
    hideForGSAP('.ci-icon',         { scale: 0, rotate: -90 });
    hideForGSAP('.soc',             { y: 20, scale: 0.7 });
    hideForGSAP('.c-form',          { x: 50 });
    hideForGSAP('.fg',              { y: 20 });
    hideForGSAP('.avail-banner',    { scale: 0.92 });
  }
}

/* ── Shared animations (footer, eyebrow, titles) ─────── */
function initShared() {
  /* Footer */
  gsap.to('footer', {
    scrollTrigger: { trigger: 'footer', start: 'top 92%' },
    autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out'
  });
  gsap.to('.footer-brand, .footer-col', {
    scrollTrigger: { trigger: 'footer', start: 'top 88%' },
    autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
  });
  gsap.to('.footer-bot', {
    scrollTrigger: { trigger: '.footer-bot', start: 'top 95%' },
    autoAlpha: 1, duration: 0.5, ease: 'power2.out'
  });

  /* Eyebrow badges */
  sel('.eyebrow').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      autoAlpha: 1, duration: 0.5, ease: 'power2.out'
    });
  });

  /* Section titles */
  sel('.sec-title').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out'
    });
  });

  /* Section subtitles */
  sel('.sec-sub').forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      autoAlpha: 1, duration: 0.6, ease: 'power2.out'
    });
  });

  /* Nav slide in */
  gsap.from('#nav', { y: -80, autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
}

/* ── Page hero parallax (inner pages) ──────────────────── */
function initParallax() {
  if (!sel('.page-hero').length) return;
  gsap.to('.page-orb1', {
    scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: -60, ease: 'none'
  });
  gsap.to('.page-orb2', {
    scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: -40, ease: 'none'
  });
}

/* ── BOOK FLIP ANIMATION ───────────────────────────────── */
function initBookFlip() {
  // Define all major content blocks that should flip like pages
  const selectors = [
    '.page-hero',
    '.section',
    '.sec-alt',
    '.cta-sec',
    '.available-bar',
    '.avail-banner',
    '.info-cards',
    '.why-cards',
    '.proj-grid',
    '.cert-grid',
    '.contact-grid',
    '.timeline',
    '.about-grid',
    '.skills-tabs',
    '.skill-panels'
  ];

  // Add class 'book-page' to all matching elements
  selectors.forEach(selStr => {
    sel(selStr).forEach(el => {
      if (!el.classList.contains('book-page')) {
        el.classList.add('book-page');
        // Also add a shadow wrapper if needed (we'll handle via CSS)
        el.classList.add('book-page-shadow');
      }
    });
  });

  // Now animate each book-page
  sel('.book-page').forEach((el, i) => {
    // Random slight variation for a more organic feel
    const rotY = gsap.utils.random(-12, -4);
    const xOff = gsap.utils.random(30, 80);
    const yOff = gsap.utils.random(-20, 20);

    // Set initial state (hidden, rotated, shifted)
    gsap.set(el, {
      autoAlpha: 0,
      rotationY: rotY,
      x: xOff,
      y: yOff,
      transformPerspective: 1400,
      transformOrigin: 'right center'  // flip from the right edge
    });

    // Animate in when element enters viewport
    gsap.to(el, {
      autoAlpha: 1,
      rotationY: 0,
      x: 0,
      y: 0,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
        // Optional: scrub for a smoother parallax-like flip
        // scrub: 0.5,
      },
      onStart: () => {
        // Add 'in-view' class for shadow effect (if you want)
        el.classList.add('in-view');
      }
    });
  });
}

/* ── HOME ───────────────────────────────────────────────── */
function initHome() {
  /* Hero cinematic entrance — delayed after loader (1.8s) */
  const tl = gsap.timeline({ delay: 1.8 });
  tl.to('.hero-badge',        { autoAlpha:1, y:0, duration:0.6, ease:'power3.out' })
    .to('.hero-title',        { autoAlpha:1, y:0, duration:0.7, ease:'power3.out' }, '-=0.3')
    .to('.hero-typing',       { autoAlpha:1, y:0, duration:0.5, ease:'power2.out' }, '-=0.35')
    .to('.hero-desc',         { autoAlpha:1, y:0, duration:0.6, ease:'power2.out' }, '-=0.3')
    .to('.hero-stats .stat',  { autoAlpha:1, y:0, duration:0.5, stagger:0.1, ease:'back.out(1.5)' }, '-=0.25')
    .to('.hero-btns .btn',    { autoAlpha:1, y:0, duration:0.45, stagger:0.09, ease:'power2.out' }, '-=0.2')
    .to('.hero-visual',       { autoAlpha:1, x:0, duration:0.8, ease:'power3.out' }, '-=0.6')
    .to('.pr-badge',          { autoAlpha:1, scale:1, duration:0.5, stagger:0.13, ease:'back.out(2)' }, '-=0.4');

  /* Profile ring float loop */
  gsap.to('.profile-ring', {
    y: -14, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1
  });
  gsap.to('.pr-badge.b1', { y: -8,  duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.pr-badge.b2', { y:  8,  duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
  gsap.to('.pr-badge.b3', { y: -6,  duration: 2.0, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.9 });

  /* Available bar */
  gsap.to('.av-item', {
    scrollTrigger: { trigger: '.available-bar', start: 'top 90%' },
    autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
  });
  gsap.to('.av-div', {
    scrollTrigger: { trigger: '.available-bar', start: 'top 90%' },
    autoAlpha: 1, scaleY: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.2
  });

  /* CTA */
  gsap.to('.cta-box', {
    scrollTrigger: { trigger: '.cta-box', start: 'top 82%' },
    autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out'
  });
  gsap.to('.ct', {
    scrollTrigger: { trigger: '.cta-tags', start: 'top 88%' },
    autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out'
  });
}

/* ── ABOUT ──────────────────────────────────────────────── */
function initAbout() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  gsap.to('.about-ph', {
    scrollTrigger: { trigger: '.about-ph', start: 'top 82%' },
    autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)'
  });

  gsap.to('.af-card', {
    scrollTrigger: { trigger: '.about-img-wrap', start: 'top 80%' },
    autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.6)'
  });
  /* Float bob */
  gsap.to('.af-card', { y: -6, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4, delay: 1 });

  gsap.to('.about-text', {
    scrollTrigger: { trigger: '.about-text', start: 'top 82%' },
    autoAlpha: 1, x: 0, duration: 0.85, ease: 'power3.out'
  });

  gsap.to('.hi', {
    scrollTrigger: { trigger: '.highlights', start: 'top 85%' },
    autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.09, ease: 'power2.out'
  });

  gsap.to('.info-card', {
    scrollTrigger: { trigger: '.info-cards', start: 'top 84%' },
    autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out'
  });
  gsap.to('.ic-icon', {
    scrollTrigger: { trigger: '.info-cards', start: 'top 82%' },
    autoAlpha: 1, scale: 1, rotate: 0, duration: 0.65, stagger: 0.12, ease: 'back.out(2)', delay: 0.1
  });
  gsap.to('.ic-num', {
    scrollTrigger: { trigger: '.info-cards', start: 'top 82%' },
    autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.12, ease: 'back.out(2)', delay: 0.2
  });

  gsap.to('.section.sec-alt .glass', {
    scrollTrigger: { trigger: '.section.sec-alt', start: 'top 82%' },
    autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out'
  });
}

/* ── SKILLS ─────────────────────────────────────────────── */
function initSkills() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  gsap.to('.tab', {
    scrollTrigger: { trigger: '.skills-tabs', start: 'top 86%' },
    autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(2)'
  });

  gsap.to('.sk-card', {
    scrollTrigger: { trigger: '.skill-grid', start: 'top 84%' },
    autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out'
  });
  gsap.to('.sk-icon', {
    scrollTrigger: { trigger: '.skill-grid', start: 'top 82%' },
    autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)', delay: 0.12
  });

  /* Skill bars — animate width on scroll */
  sel('.sk-card').forEach(card => {
    const bar = card.querySelector('.sk-fill');
    if (!bar) return;
    const pct = (bar.getAttribute('data-pct') || '80') + '%';
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      onEnter: () => gsap.to(bar, { width: pct, duration: 1.1, ease: 'power2.out', delay: 0.25 })
    });
  });
}

/* ── EXPERIENCE ─────────────────────────────────────────── */
function initExperience() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  gsap.to('.tl-dot', {
    scrollTrigger: { trigger: '.timeline', start: 'top 84%' },
    autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.18, ease: 'back.out(2.5)'
  });

  gsap.to('.tl-card', {
    scrollTrigger: { trigger: '.timeline', start: 'top 84%' },
    autoAlpha: 1, x: 0, duration: 0.75, stagger: 0.18, ease: 'power3.out'
  });

  gsap.to('.tl-list li', {
    scrollTrigger: { trigger: '.tl-list', start: 'top 85%' },
    autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out'
  });

  gsap.to('.wc', {
    scrollTrigger: { trigger: '.why-cards', start: 'top 84%' },
    autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.11, ease: 'power2.out'
  });
  gsap.to('.wc-icon', {
    scrollTrigger: { trigger: '.why-cards', start: 'top 82%' },
    autoAlpha: 1, scale: 1, rotate: 0, duration: 0.55, stagger: 0.11, ease: 'back.out(2.5)', delay: 0.15
  });
}

/* ── PROJECTS ───────────────────────────────────────────── */
function initProjects() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  sel('.proj-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 86%' },
      autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.08
    });
  });

  sel('.proj-badge').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 90%' },
      autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)', delay: 0.2
    });
  });

  gsap.to('.pa', {
    scrollTrigger: { trigger: '.proj-ach', start: 'top 88%' },
    autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out'
  });

  /* Hover lift */
  sel('.proj-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -8, duration: 0.28, ease: 'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y:  0, duration: 0.35, ease: 'power2.out' }));
  });
}

/* ── CERTIFICATIONS ─────────────────────────────────────── */
function initCertifications() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  sel('.cert-card').forEach((card, i) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: 'top 87%' },
      autoAlpha: 1, y: 0, rotate: 0, duration: 0.65, ease: 'back.out(1.4)', delay: i * 0.07
    });
  });

  gsap.to('.cert-icon', {
    scrollTrigger: { trigger: '.cert-grid', start: 'top 85%' },
    autoAlpha: 1, scale: 1, rotate: 0, duration: 0.55, stagger: 0.09, ease: 'back.out(2)'
  });
  gsap.to('.cert-badge', {
    scrollTrigger: { trigger: '.cert-grid', start: 'top 85%' },
    autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(2)', delay: 0.15
  });
  gsap.to('.cert-link', {
    scrollTrigger: { trigger: '.cert-grid', start: 'top 83%' },
    autoAlpha: 1, x: 0, duration: 0.38, stagger: 0.08, ease: 'power2.out', delay: 0.28
  });

  /* Hover lift */
  sel('.cert-card').forEach(card => {
    card.addEventListener('mouseenter', () => gsap.to(card, { y: -6, duration: 0.28, ease: 'power2.out' }));
    card.addEventListener('mouseleave', () => gsap.to(card, { y:  0, duration: 0.35, ease: 'power2.out' }));
  });
}

/* ── CONTACT ────────────────────────────────────────────── */
function initContact() {
  gsap.to('.page-hero-title', { autoAlpha:1, y:0, duration:0.9, delay:0.3, ease:'power3.out' });
  gsap.to('.breadcrumb',      { autoAlpha:1, x:0, duration:0.6, delay:0.2, ease:'power2.out' });

  gsap.to('.ci', {
    scrollTrigger: { trigger: '.contact-items', start: 'top 84%' },
    autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.09, ease: 'power3.out'
  });
  gsap.to('.ci-icon', {
    scrollTrigger: { trigger: '.contact-items', start: 'top 82%' },
    autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, stagger: 0.09, ease: 'back.out(2)', delay: 0.1
  });
  gsap.to('.soc', {
    scrollTrigger: { trigger: '.c-socials', start: 'top 88%' },
    autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(2)'
  });
  gsap.to('.c-form', {
    scrollTrigger: { trigger: '.c-form', start: 'top 84%' },
    autoAlpha: 1, x: 0, duration: 0.75, ease: 'power3.out'
  });
  gsap.to('.fg', {
    scrollTrigger: { trigger: '.c-form', start: 'top 82%' },
    autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.09, ease: 'power2.out', delay: 0.18
  });
  gsap.to('.avail-banner', {
    scrollTrigger: { trigger: '.avail-banner', start: 'top 86%' },
    autoAlpha: 1, scale: 1, duration: 0.75, ease: 'back.out(1.5)'
  });
}

/* ── BOOT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Step 1: hide elements BEFORE first paint */
  initHide();

  /* Step 2: run shared + page animations */
  initShared();
  initParallax();

  const p = page();
  if      (p === 'index.html' || p === '') initHome();
  else if (p === 'about.html')             initAbout();
  else if (p === 'skills.html')            initSkills();
  else if (p === 'experience.html')        initExperience();
  else if (p === 'projects.html')          initProjects();
  else if (p === 'certifications.html')    initCertifications();
  else if (p === 'contact.html')           initContact();

  /* Step 3: apply book flip to all major sections (after page-specific) */
  initBookFlip();

  /* Ensure ScrollTrigger recalculates after full page load */
  window.addEventListener('load', () => ScrollTrigger.refresh());
});