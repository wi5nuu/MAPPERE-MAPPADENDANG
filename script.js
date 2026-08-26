/* ================================================
   script.js — Pesta Panen Calodo Cenrana
   ================================================ */

/* ---- Navbar scroll ---- */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const toggle   = document.getElementById('navToggle');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

toggle && toggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('#navLinks a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---- Active nav highlight on scroll ---- */
const sections   = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('#navLinks a');
const onScroll = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ================================================
   CANVAS PARTICLE SYSTEM — Hero
   ================================================ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Particle class */
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = H + Math.random() * 60;
      this.size  = 1 + Math.random() * 2;
      this.speedY = 0.3 + Math.random() * 0.7;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha  = 0;
      this.fadeIn = 0.008 + Math.random() * 0.008;
      this.life   = 0;
      this.maxLife = 300 + Math.random() * 400;
      /* Gold palette */
      const hue = 35 + Math.random() * 20;
      const lit = 55 + Math.random() * 25;
      this.color = `hsl(${hue}, 70%, ${lit}%)`;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.life++;
      if (this.life < 60) this.alpha = Math.min(this.alpha + this.fadeIn, 0.65);
      if (this.life > this.maxLife - 80) this.alpha -= 0.012;
      if (this.alpha <= 0 || this.y < -20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* Spawn */
  const COUNT = 55;
  for (let i = 0; i < COUNT; i++) {
    const p = new Particle();
    p.y     = Math.random() * H;   /* spread initial positions */
    p.life  = Math.random() * p.maxLife;
    particles.push(p);
  }

  /* Animation loop */
  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ================================================
   INTERSECTION OBSERVER — Scroll reveals
   ================================================ */
const revealEls = document.querySelectorAll('.reveal');
const tlItems   = document.querySelectorAll('.tl-item');

const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      /* stagger siblings */
      const siblings = [...e.target.parentNode.children]
        .filter(c => c.classList.contains('reveal') || c.classList.contains('tl-item'));
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('visible');
      }, idx * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => io.observe(el));
tlItems.forEach(el  => io.observe(el));

/* ================================================
   PARALLAX — Hero background (subtle)
   ================================================ */
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
    }
  }, { passive: true });
}

/* ================================================
   STICKY MEDIA — make sticky within section
   ================================================ */
/* (handled via CSS position:sticky) */
