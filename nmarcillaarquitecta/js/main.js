/* ============================================
   NMARCILLA ARQUITECTA - MAIN JS
   Progressive enhancement + safe animation boot
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasScrollTrigger = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  function clearPendingFallback() {
    if (window.__nmAnimFallback) {
      window.clearTimeout(window.__nmAnimFallback);
      window.__nmAnimFallback = null;
    }
  }

  /* ---- CURSOR PERSONALIZADO ---- */
  const cursor = document.querySelector('.cursor');
  const cursorDot = cursor?.querySelector('.cursor-dot');
  const cursorRing = cursor?.querySelector('.cursor-ring');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  if (cursor && window.innerWidth > 900 && !prefersReducedMotion) {
    document.body.classList.add('cursor-enabled');

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      window.requestAnimationFrame(animateRing);
    }

    animateRing();

    document.querySelectorAll('a, button, .service-card, .process-step, .filter-btn').forEach((element) => {
      element.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.querySelectorAll('.project-item, .proj-card').forEach((element) => {
      element.addEventListener('mouseenter', () => document.body.classList.add('cursor-img'));
      element.addEventListener('mouseleave', () => document.body.classList.remove('cursor-img'));
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ---- SCROLL PROGRESS BAR ---- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    });
  }

  /* ---- NAV SCROLL BEHAVIOUR ---- */
  const nav = document.querySelector('nav');
  if (nav) {
    const isInnerNav = nav.classList.contains('inner-nav');
    const syncNavState = () => {
      if (isInnerNav) {
        nav.classList.add('scrolled');
        nav.classList.remove('dark-nav');
        return;
      }

      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('dark-nav');
      } else {
        nav.classList.remove('scrolled');
        nav.classList.add('dark-nav');
      }
    };

    syncNavState();
    if (!isInnerNav) {
      window.addEventListener('scroll', syncNavState);
    }
  }

  /* ---- MOBILE MENU ---- */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  let menuOpen = false;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';

      const spans = hamburger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach((span) => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach((span) => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      });
    });
  }

  /* ---- REVEAL ON SCROLL ---- */
  function setupReveal() {
    const revealEls = Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'));

    if (!revealEls.length) {
      root.classList.add('reveal-ready');
      return;
    }

    if (prefersReducedMotion || typeof window.IntersectionObserver === 'undefined') {
      revealEls.forEach((element) => element.classList.add('visible'));
      root.classList.add('reveal-ready');
      return;
    }

    const foldLimit = window.innerHeight * 0.9;
    revealEls.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top <= foldLimit && rect.bottom >= 0) {
        element.classList.add('visible');
      }
    });

    root.classList.add('reveal-ready');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((element) => {
      if (!element.classList.contains('visible')) {
        observer.observe(element);
      }
    });
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCounters() {
    const counters = Array.from(document.querySelectorAll('[data-count]'));
    if (!counters.length) return;

    const setFinalValue = (element) => {
      const target = Number.parseInt(element.dataset.count || '', 10);
      const suffix = element.dataset.suffix || '';
      if (!Number.isNaN(target)) {
        element.textContent = `${target}${suffix}`;
      }
    };

    if (prefersReducedMotion || typeof window.IntersectionObserver === 'undefined') {
      counters.forEach(setFinalValue);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number.parseInt(element.dataset.count || '', 10);
        const suffix = element.dataset.suffix || '';

        if (Number.isNaN(target)) {
          observer.unobserve(element);
          return;
        }

        let current = 0;
        const duration = 1800;
        const step = target / (duration / 16);

        const timer = window.setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            window.clearInterval(timer);
          }
          element.textContent = `${Math.round(current)}${suffix}`;
        }, 16);

        observer.unobserve(element);
      });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ---- PROJECT FILTER (HOME) ---- */
  function setupFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.project-item[data-cat]');

    if (!btns.length || !items.length) return;

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((button) => button.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach((item) => {
          const show = filter === 'all' || item.dataset.cat === filter;
          item.style.opacity = show ? '1' : '0.2';
          item.style.transform = show ? '' : 'scale(0.96)';
          item.style.transition = 'opacity 0.4s, transform 0.4s';
          item.style.pointerEvents = show ? '' : 'none';
        });
      });
    });
  }

  /* ---- GSAP ENHANCEMENTS ---- */
  function initGSAP() {
    if (!hasGSAP || prefersReducedMotion) return;

    const hero = document.getElementById('hero');
    if (hero) {
      const heroTimeline = window.gsap.timeline({ delay: 0.15 });
      heroTimeline
        .from('.hero-eyebrow', { y: 28, opacity: 0, duration: 0.75, ease: 'power3.out' })
        .from('.hero-title', { y: 56, opacity: 0, duration: 0.95, ease: 'power3.out' }, '-=0.45')
        .from('.hero-subtitle', { y: 28, opacity: 0, duration: 0.75, ease: 'power3.out' }, '-=0.5')
        .from('.hero-actions', { y: 18, opacity: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
        .from('.hero-annotation', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.35')
        .from('.hero-stats .hero-stats-item', { y: 18, opacity: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' }, '-=0.25');
    }

    if (!hasScrollTrigger) return;

    if (document.querySelector('.hero-geo')) {
      window.gsap.to('.hero-geo', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    if (document.querySelector('.services-grid')) {
      window.gsap.from('.service-card', {
        y: 48,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
      });
    }

    if (document.querySelector('.process-grid')) {
      window.gsap.from('.process-step', {
        y: 36,
        opacity: 0,
        stagger: 0.1,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.process-grid', start: 'top 80%' }
      });
    }

    if (document.querySelector('.projects-grid')) {
      window.gsap.from('.project-item', {
        y: 36,
        opacity: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-grid', start: 'top 82%' }
      });
    }

    if (document.querySelector('.projects-masonry')) {
      window.gsap.from('.proj-card', {
        y: 36,
        opacity: 0,
        stagger: 0.08,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.projects-masonry', start: 'top 82%' }
      });
    }
  }

  function initAnimations() {
    setupReveal();
    animateCounters();
    setupFilter();
    initGSAP();
  }

  function releasePendingState() {
    clearPendingFallback();
    root.classList.remove('anim-pending');
  }

  /* ---- LOADER ---- */
  const loader = document.getElementById('loader');

  function bootSite() {
    initAnimations();
    window.requestAnimationFrame(releasePendingState);
  }

  if (loader) {
    const loaderDelay = prefersReducedMotion ? 0 : 1700;
    window.setTimeout(() => {
      loader.classList.add('is-hidden');
      window.setTimeout(() => {
        loader.style.display = 'none';
        bootSite();
      }, prefersReducedMotion ? 20 : 620);
    }, loaderDelay);
  } else {
    bootSite();
  }

  /* ---- CONTACT FORM (generic forms only) ---- */
  document.querySelectorAll('.contact-form').forEach((form) => {
    if (form.dataset.successScreen === 'true') return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const btn = form.querySelector('.btn-submit');
      if (!btn) return;

      btn.textContent = 'Mensaje enviado';
      btn.style.background = '#27ae60';

      window.setTimeout(() => {
        btn.innerHTML = '<span>Enviar mensaje</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  });

  /* ---- SMOOTH SCROLL FOR VALID ANCHORS ---- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;

      let target = null;
      try {
        target = document.querySelector(selector);
      } catch (error) {
        target = null;
      }

      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
});
