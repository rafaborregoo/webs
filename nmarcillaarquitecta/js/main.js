/* ============================================
   NMARCILLA ARQUITECTA — MAIN JS
   GSAP + ScrollTrigger + Cursor + Loader
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- GSAP register ---- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---- LOADER ---- */
  const loader      = document.getElementById('loader');
  const loaderLogo  = loader?.querySelector('.loader-logo');
  const loaderBar   = loader?.querySelector('.loader-bar');
  const loaderPct   = loader?.querySelector('.loader-pct');

  if (loader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) { progress = 100; clearInterval(interval); }
      if (loaderBar) loaderBar.style.width = progress + '%';
      if (loaderPct) loaderPct.textContent = Math.round(progress) + '%';
    }, 120);

    if (loaderLogo) gsap.to(loaderLogo, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });

    setTimeout(() => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1.1,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete: () => { loader.style.display = 'none'; initAnimations(); }
      });
    }, 1800);
  } else {
    initAnimations();
  }

  /* ---- CURSOR PERSONALIZADO ---- */
  const cursor = document.querySelector('.cursor');
  const cursorDot  = cursor?.querySelector('.cursor-dot');
  const cursorRing = cursor?.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  if (cursor && window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Hover states */
    document.querySelectorAll('a, button, .service-card, .process-step, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.querySelectorAll('.project-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-img'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-img'));
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* ---- SCROLL PROGRESS BAR ---- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const max    = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = (window.scrollY / max) * 100;
      progressBar.style.width = pct + '%';
    });
  }

  /* ---- NAV SCROLL BEHAVIOUR ---- */
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        nav.classList.remove('dark-nav');
      } else {
        nav.classList.remove('scrolled');
        nav.classList.add('dark-nav');
      }
    });
    nav.classList.add('dark-nav');
  }

  /* ---- MOBILE MENU ---- */
  const hamburger  = document.querySelector('.nav-hamburger');
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
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ---- REVEAL ON SCROLL (fallback without GSAP) ---- */
  function setupReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---- COUNTER ANIMATION ---- */
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el      = entry.target;
          const target  = parseInt(el.dataset.count);
          const suffix  = el.dataset.suffix || '';
          const dur     = 1800;
          const step    = target / (dur / 16);
          let current   = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.round(current) + suffix;
          }, 16);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  /* ---- PROJECT FILTER ---- */
  function setupFilter() {
    const btns  = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.project-item[data-cat]');
    if (!btns.length) return;

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        items.forEach(item => {
          const show = filter === 'all' || item.dataset.cat === filter;
          item.style.opacity    = show ? '1' : '0.2';
          item.style.transform  = show ? '' : 'scale(0.96)';
          item.style.transition = 'opacity 0.4s, transform 0.4s';
          item.style.pointerEvents = show ? '' : 'none';
        });
      });
    });
  }

  /* ---- GSAP HERO ANIMATIONS ---- */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;

    /* Hero reveal */
    const tl = gsap.timeline({ delay: 0.3 });
    tl.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-title',   { y: 60, opacity: 0, duration: 1,   ease: 'power3.out' }, '-=0.4')
      .from('.hero-subtitle',{ y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-actions', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from('.hero-stats .hero-stats-item', { y: 20, opacity: 0, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    /* Parallax hero bg */
    gsap.to('.hero-geo', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* Section reveals */
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.from(el, {
        x: -50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.from(el, {
        x: 50, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    /* Service cards stagger */
    gsap.from('.service-card', {
      y: 60, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
    });

    /* Process steps stagger */
    gsap.from('.process-step', {
      y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.process-grid', start: 'top 80%' }
    });

    /* Projects fade in */
    gsap.from('.project-item', {
      y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' }
    });
  }

  function initAnimations() {
    setupReveal();
    animateCounters();
    setupFilter();
    if (typeof gsap !== 'undefined') {
      initGSAP();
    }
  }

  /* ---- CONTACT FORM ---- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.innerHTML = '<span>Enviar mensaje</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
