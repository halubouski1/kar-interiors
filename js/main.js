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
    spaceBetween: 20,
    grabCursor: true,
    navigation: {
      prevEl: '.portfolio__prev',
      nextEl: '.portfolio__next',
    },
    breakpoints: {
      1024: {
        spaceBetween: 0,
      },
      },
  });
}

// ========================================
// Reviews slider (Swiper)
// ========================================
if (typeof Swiper !== 'undefined' && document.querySelector('.reviews__swiper')) {
  new Swiper('.reviews__swiper', {
    slidesPerView: 'auto',
    spaceBetween: 40, // ≤570: one full-width card, next one fully off-screen
    slidesOffsetBefore: 20,
    slidesOffsetAfter: 20,
    speed: 700,
    grabCursor: true,
    navigation: {
      prevEl: '.reviews__prev',
      nextEl: '.reviews__next',
    },
    breakpoints: {
      571: {
        spaceBetween: 15,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
      },
      1024: {
        spaceBetween: 11,
        slidesOffsetBefore: 24,
        slidesOffsetAfter: 24,
      },
      1919: {
        spaceBetween: 15,
        slidesOffsetBefore: 30,
        slidesOffsetAfter: 30,
      }
    },
  });
}

// ========================================
// Cases — grid + big sliders, both filtered by category
// ========================================
if (typeof Swiper !== 'undefined' && document.querySelector('.cases__grid')) {
  const casesGrid = new Swiper('.cases__grid', {
    slidesPerView: 'auto',
    spaceBetween: 26,
    slidesOffsetBefore: 50,
    slidesOffsetAfter: 0,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: '.cases__arrow--prev',
      nextEl: '.cases__arrow--next',
    },
    breakpoints: {
        1919: {
        spaceBetween: 26,
        slidesOffsetBefore: 50,
        slidesOffsetAfter: 0,
      },
      1024: {
        spaceBetween: 20,
        slidesOffsetBefore: 42,
        slidesOffsetAfter: 42,
      },
      571: {
        spaceBetween: 30,
        slidesOffsetBefore: 30,
        slidesOffsetAfter: 30,
      },
      0: {
        spaceBetween: 20,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
      },
    },
  });

  const casesBig = document.querySelector('.cases__big')
    ? new Swiper('.cases__big', {
        slidesPerView: 'auto', // use the CSS slide width (100vw - 100px)
        spaceBetween: 50,       // next card sits exactly off-screen (no peek)
        slidesOffsetBefore: 50,
        slidesOffsetAfter: 50,
        speed: 700,
        grabCursor: true,
        navigation: {
          prevEl: '.cases__big-arrow--prev',
          nextEl: '.cases__big-arrow--next',
        },
        breakpoints: {
          1919: {
            spaceBetween: 50,
            slidesOffsetBefore: 50,
            slidesOffsetAfter: 50,
          },
          1024: {
            spaceBetween: 42,
            slidesOffsetBefore: 42,
            slidesOffsetAfter: 42,
          },
          571: {
          spaceBetween: 30,
          slidesOffsetBefore: 30,
          slidesOffsetAfter: 30,
        },
              0: {
        spaceBetween: 20,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
      },
        },
      })
    : null;

  // Hide non-matching slides, then replay the staggered appear animation
  const filterSlider = (swiper, slides, cat) => {
    if (!swiper || !slides.length) return;

    slides.forEach((slide) => {
      const match = cat === 'all' || slide.dataset.cat === cat;
      slide.classList.toggle('is-hidden', !match);
      slide.classList.remove('is-appearing');
    });

    swiper.update();
    swiper.slideTo(0, 0);

    void swiper.el.offsetWidth; // force reflow so the animation replays
    let visible = 0;
    slides.forEach((slide) => {
      if (slide.classList.contains('is-hidden')) return;
      slide.style.setProperty('--appear-delay', `${visible * 60}ms`);
      slide.classList.add('is-appearing');
      visible += 1;
    });
  };

  const filters = document.querySelectorAll('.cases__filter');
  const gridSlides = [...document.querySelectorAll('.cases__grid .swiper-slide')];
  const bigSlides = [...document.querySelectorAll('.cases__big .swiper-slide')];

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((f) => f.classList.remove('is-active'));
      filter.classList.add('is-active');

      const cat = filter.dataset.filter;
      filterSlider(casesGrid, gridSlides, cat);
      filterSlider(casesBig, bigSlides, cat);
    });
  });
}

// ========================================
// Project detail — image slider
// ========================================
if (typeof Swiper !== 'undefined' && document.querySelector('.project__slider')) {
  new Swiper('.project__slider', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    slidesOffsetBefore: 50,
    slidesOffsetAfter: 50,
    speed: 600,
    grabCursor: true,
    navigation: {
      prevEl: '.project__prev',
      nextEl: '.project__next',
    },
    breakpoints: {
      1919: {
        spaceBetween: 16,
        slidesOffsetBefore: 50,
        slidesOffsetAfter: 50,
      },
      1024: {
        spaceBetween: 12,
        slidesOffsetBefore: 38,
        slidesOffsetAfter: 38,
      },
      0: {
        spaceBetween: 12,
        slidesOffsetBefore: 20,
        slidesOffsetAfter: 20,
      }
    }
  });
}

// ========================================
// Mission — animated stat counters (CountUp.js)
// ========================================
const missionStats = document.querySelector('.mission__stats');
const MissionCountUp = (window.countUp && window.countUp.CountUp) || window.CountUp;

if (missionStats && MissionCountUp) {
  const counters = [];

  missionStats.querySelectorAll('.mission__num').forEach((el) => {
    const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
    if (Number.isNaN(target)) return;

    const startVal = el.dataset.start ? parseInt(el.dataset.start, 10) : 0;

    counters.push(new MissionCountUp(el, target, {
      startVal,
      duration: 4,
      separator: ' ', // thin space, e.g. 18 000
      useEasing: true,
    }));
  });

  if (counters.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counters.forEach((c) => c.start());
        obs.disconnect();
      });
    }, { threshold: 0.4 });

    io.observe(missionStats);
  }
}

// ========================================
// Advantages — marquee on desktop, paged slider on mobile (<=570px)
// ========================================
const advTrack = document.querySelector('.advantages__track');
if (advTrack) {
  if (window.matchMedia('(min-width: 570px)').matches) {
    // Desktop: duplicate cards for a seamless marquee loop
    [...advTrack.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      advTrack.appendChild(clone);
    });
  } else {
    // Mobile: one card per screen, cropped 20px each side, arrow nav
    new Swiper('.advantages__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      navigation: {
        prevEl: '.advantages__arrow--prev',
        nextEl: '.advantages__arrow--next',
      },
    });
  }
}

// ========================================
// Why choose us — marquee on desktop, paged slider on mobile (<=570px)
// ========================================
const whyTrack = document.querySelector('.why__track');
if (whyTrack) {
  if (window.matchMedia('(min-width: 571px)').matches) {
    // Desktop: duplicate cards for a seamless marquee loop
    [...whyTrack.children].forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      whyTrack.appendChild(clone);
    });
  } else {
    // Mobile: 290px slides, offset 20 each side, arrow nav, swipeable
    new Swiper('.why__slider', {
      slidesPerView: 'auto',
      spaceBetween: 4,
      slidesOffsetBefore: 20,
      slidesOffsetAfter: 20,
      grabCursor: true,
      navigation: {
        prevEl: '.why__arrow--prev',
        nextEl: '.why__arrow--next',
      },
    });
  }
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
// Footer — back to top (desktop + mobile buttons)
// ========================================
document.querySelectorAll('.footer__totop').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

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
// Create — stats: counters on desktop, marquee on small screens
// ========================================
const statsBlock = document.querySelector('.create__stats');

if (statsBlock && window.matchMedia('(max-width: 769px)').matches) {
  // Small screens: no counting — turn the stats into an infinite auto-slider
  const track = document.createElement('div');
  track.className = 'create__stats-track';
  while (statsBlock.firstChild) track.appendChild(statsBlock.firstChild);

  // Duplicate the stats so the loop is seamless
  track.querySelectorAll('.create__stat').forEach((stat) => {
    const clone = stat.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  statsBlock.classList.add('is-marquee');
  statsBlock.appendChild(track);
} else {
  // Desktop: count up the numbers when the block scrolls into view
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

    if (counters.length) {
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
}

// ========================================
// Fullscreen burger menu
// ========================================
const menu = document.querySelector('.menu');
const burgerBtn = document.querySelector('.header__burger');
const menuCloseBtn = document.querySelector('.menu__close');

if (menu && burgerBtn) {
  const openMenu = () => {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); // lock background scroll
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  };

  burgerBtn.addEventListener('click', openMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

  // Close on a menu link click (capture runs before the anchor-scroll handler,
  // so Lenis is restarted before the smooth scroll fires)
  menu.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', closeMenu, { capture: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

// ========================================
// Popup (modal)
// ========================================
const popup = document.querySelector('.popup');
const popupOpeners = document.querySelectorAll('[data-popup-open]');

if (popup && popupOpeners.length) {
  const openPopup = (e) => {
    if (e) e.preventDefault();
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
  };

  const closePopup = () => {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
  };

  popupOpeners.forEach((btn) => btn.addEventListener('click', openPopup));
  popup.querySelectorAll('[data-popup-close]').forEach((el) => el.addEventListener('click', closePopup));

  // Click on the dark backdrop (outside the window) closes it
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
  });

  const popupForm = popup.querySelector('.popup__form');
  if (popupForm) popupForm.addEventListener('submit', (e) => e.preventDefault());
}