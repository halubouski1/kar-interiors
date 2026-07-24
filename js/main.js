// ========================================
// Lenis smooth scroll
// ========================================
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const lenisRaf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  };
  requestAnimationFrame(lenisRaf);
}

// ========================================
// AOS init
// ========================================
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
  if (lenis) lenis.on('scroll', AOS.refresh);
}

// ========================================
// Hero scroll-down button -> next section
// ========================================
const heroScrollBtn = document.querySelector('.hero__scroll');
if (heroScrollBtn) {
  heroScrollBtn.addEventListener('click', () => {
    const hero = heroScrollBtn.closest('.hero');
    const nextSection = hero && hero.nextElementSibling;
    const target = nextSection || window.innerHeight;

    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4 });
    } else if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  });
}

// ========================================
// "How do we work" — custom circular cursor
// ========================================
const howSection = document.querySelector('.how');
const howCursor = document.querySelector('.how-cursor');

if (howSection && howCursor) {
  const items = howSection.querySelectorAll('.how__item');
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const renderCursor = () => {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    howCursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  items.forEach((item) => {
    item.addEventListener('mouseenter', () => howCursor.classList.add('is-active'));
    item.addEventListener('mouseleave', () => howCursor.classList.remove('is-active'));
  });
}

// ========================================
// Portfolio slider (Swiper)
// ========================================
if (typeof Swiper !== 'undefined' && document.querySelector('.portfolio__swiper')) {
  new Swiper('.portfolio__swiper', {
    loop: false,
    speed: 800,
    grabCursor: true,
    navigation: {
      prevEl: '.portfolio__prev',
      nextEl: '.portfolio__next',
    },
  });
}

// ========================================
// Reviews slider (Swiper)
// ========================================
if (typeof Swiper !== 'undefined' && document.querySelector('.reviews__swiper')) {
  new Swiper('.reviews__swiper', {
    slidesPerView: 'auto',
    spaceBetween: 15,
    slidesOffsetBefore: 30,
    slidesOffsetAfter: 30,
    speed: 700,
    grabCursor: true,
    navigation: {
      prevEl: '.reviews__prev',
      nextEl: '.reviews__next',
    },
  });
}

// ========================================
// FAQ accordion (single-open, whole item clickable)
// ========================================
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach((item) => {
  item.addEventListener('click', () => {
    const willOpen = !item.classList.contains('is-open');

    // Close every item (so only one stays open at a time)
    faqItems.forEach((other) => {
      other.classList.remove('is-open');
      const otherTrigger = other.querySelector('.faq__trigger');
      if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
    });

    // Open the clicked one (or leave all closed if it was already open)
    item.classList.toggle('is-open', willOpen);
    const trigger = item.querySelector('.faq__trigger');
    if (trigger) trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

// ========================================
// Contact — custom dropdown(s)
// ========================================
document.querySelectorAll('[data-select]').forEach((select) => {
  const trigger = select.querySelector('.contact__select-trigger');
  const valueEl = select.querySelector('.contact__select-value');
  const hidden = select.querySelector('input[type="hidden"]');
  const options = select.querySelectorAll('.contact__select-option');

  const close = () => {
    select.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !select.classList.contains('is-open');
    // close any other open selects
    document.querySelectorAll('[data-select].is-open').forEach((s) => {
      if (s !== select) {
        s.classList.remove('is-open');
        const t = s.querySelector('.contact__select-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
    select.classList.toggle('is-open', willOpen);
    trigger.setAttribute('aria-expanded', String(willOpen));
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      valueEl.textContent = option.textContent;
      select.classList.add('is-filled');
      if (hidden) hidden.value = option.dataset.value || option.textContent;
      options.forEach((o) => o.classList.remove('is-selected'));
      option.classList.add('is-selected');
      close();
    });
  });

  // close when clicking outside
  document.addEventListener('click', (e) => {
    if (!select.contains(e.target)) close();
  });
});

// Prevent the demo contact form from reloading the page
const contactForm = document.querySelector('.contact__form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => e.preventDefault());
}

// ========================================
// Footer — back to top
// ========================================
const toTopBtn = document.querySelector('.footer__totop');
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========================================
// Smooth scroll for in-page anchor links (via Lenis)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const id = link.getAttribute('href');
  if (!id || id.length < 2) return; // skip bare "#"

  link.addEventListener('click', (e) => {
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ========================================
// Footer — dark map (Leaflet + CartoDB dark tiles)
// ========================================
const mapEl = document.getElementById('footer-map');
if (typeof L !== 'undefined' && mapEl) {
  const coords = [40.7328, -73.986]; // New York

  const map = L.map(mapEl, {
    center: coords,
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: true,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(map);

  const pin = L.divIcon({
    className: 'footer__map-pin',
    html: '<svg width="26" height="34" viewBox="0 0 26 34" fill="none"><path d="M13 0C5.82 0 0 5.82 0 13c0 9.75 13 21 13 21s13-11.25 13-21C26 5.82 20.18 0 13 0z" fill="#fff"/><circle cx="13" cy="13" r="4.5" fill="#1a1a1a"/></svg>',
    iconSize: [26, 34],
    iconAnchor: [13, 34],
  });

  L.marker(coords, { icon: pin }).addTo(map);

  // Keep the map sized correctly once laid out
  setTimeout(() => map.invalidateSize(), 300);
}

// ========================================
// Create — animated stat counters (CountUp.js)
// ========================================
const CountUpLib = (window.countUp && window.countUp.CountUp) || window.CountUp;
const statNums = document.querySelectorAll('.create__num');

if (CountUpLib && statNums.length) {
  const counters = [];

  statNums.forEach((el) => {
    const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
    if (Number.isNaN(target)) return;

    const startVal = el.dataset.start ? parseInt(el.dataset.start, 10) : 0;

    counters.push(new CountUpLib(el, target, {
      startVal,
      duration: 4,
      separator: ' ', // thin space, e.g. 18 000
      useEasing: true,
      enableScrollSpy: false,
    }));
  });

  const statsBlock = document.querySelector('.create__stats');
  if (statsBlock && counters.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((c) => c.start());
        obs.disconnect();
      });
    }, { threshold: 0.4 });

    io.observe(statsBlock);
  }
}