/* ═══════════════════════════════════════════
   APP.JS — Animations, Accordion, Lightbox
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  // ── NAV ──
  var nav = document.querySelector('.nav');
  function handleNav() { nav.classList.toggle('scrolled', window.scrollY > 50); }

  // ── PARALLAX ──
  var heroBg = document.querySelector('.hero__bg img');
  function handleParallax() {
    if (!heroBg || window.scrollY >= window.innerHeight) return;
    heroBg.style.transform = 'translate3d(0,' + (window.scrollY * 0.3) + 'px,0)';
  }

  // ── REVEAL ON SCROLL ──
  var revealObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

  // ── GALLERY STAGGERED REVEAL ──
  var galObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); galObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.img-gallery').forEach(function (g) { galObs.observe(g); });

  // ── TIMELINE ──
  var tlItems = document.querySelectorAll('.tl-item');
  var tlProgress = document.querySelector('.timeline-line__progress');
  var tlWrap = document.querySelector('.timeline-wrap');
  var tlObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
  tlItems.forEach(function (i) { tlObs.observe(i); });

  function updateTlProgress() {
    if (!tlWrap || !tlProgress) return;
    var r = tlWrap.getBoundingClientRect();
    var pct = Math.max(0, Math.min(100, ((window.innerHeight - r.top) / r.height) * 100));
    tlProgress.style.height = pct + '%';
  }

  // ── SCROLL HANDLER ──
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNav(); handleParallax(); updateTlProgress(); ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  handleNav(); handleParallax(); updateTlProgress();

  // ── SMOOTH NAV ──
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var h = this.getAttribute('href');
      if (h && h.startsWith('#')) {
        e.preventDefault();
        var t = document.querySelector(h);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── ACCORDION ──
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.accordion__trigger');
    if (!trigger) return;
    var acc = trigger.closest('.accordion');
    if (!acc) return;
    acc.classList.toggle('open');
    // If just opened and has gallery images, trigger their stagger animation
    if (acc.classList.contains('open')) {
      var gallery = acc.querySelector('.img-gallery');
      if (gallery) {
        // Small delay so the max-height transition starts first
        setTimeout(function () { gallery.classList.add('visible'); }, 80);
      }
    }
  });

  // ── LIGHTBOX ──
  // Create lightbox DOM
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = '<button class="lightbox__close" aria-label="Close image viewer">&times;</button><img src="" alt=""/>';
  document.body.appendChild(lb);
  var lbImg = lb.querySelector('img');
  var lbClose = lb.querySelector('.lightbox__close');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Click on gallery images
  document.addEventListener('click', function (e) {
    var img = e.target.closest('.img-gallery img');
    if (img) { openLightbox(img.src, img.alt); return; }
  });
  lbClose.addEventListener('click', closeLightbox);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('active')) closeLightbox();
  });

  // ── CARD HOVER ──
  document.querySelectorAll('.glass-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * -2;
      var ry = ((e.clientX - r.left - r.width/2) / (r.width/2)) * 2;
      card.style.transform = 'translateY(-3px) perspective(500px) rotateX('+rx+'deg) rotateY('+ry+'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
})();
