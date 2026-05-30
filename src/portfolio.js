/* ============================================================
   Portfolio — motion choreography
   Lenis smooth scroll · GSAP ScrollTrigger · SplitType reveals
   blend-mode cursor · branded preloader · clip-path / parallax
   Degrades gracefully under prefers-reduced-motion.
   ============================================================ */
import './styles/portfolio.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import './aurora-warm.js';

gsap.registerPlugin(ScrollTrigger);

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- custom cursor ---------------- */
  (function cursor() {
    if (window.matchMedia('(hover:none)').matches) return;
    const dot = document.createElement('div');
    dot.className = 'cursor';
    document.body.appendChild(dot);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    addEventListener('mouseleave', () => dot.classList.add('hide'));
    addEventListener('mouseenter', () => dot.classList.remove('hide'));
    const sel = 'a, button, .btn, .case, .badge, .contact-link, .tab';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(sel)) dot.classList.add('hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(sel)) dot.classList.remove('hover'); });
    (function raf() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    })();
  })();

  /* ---------------- nav ---------------- */
  const nav = document.querySelector('.nav');
  const setNav = (s) => nav && nav.classList.toggle('scrolled', s > 40);
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav .links');
  if (burger) burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links && links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis = null;
  function startLenis() {
    if (reduce) {
      addEventListener('scroll', () => setNav(scrollY), { passive: true });
      // anchor smooth fallback
      document.querySelectorAll('a[href^="#"]').forEach((a) =>
        a.addEventListener('click', (e) => {
          const t = document.querySelector(a.getAttribute('href'));
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'auto' }); }
        }));
      return;
    }
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, lerp: 0.1 });
    lenis.on('scroll', (e) => { setNav(e.scroll); ScrollTrigger.update(); });
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); }
      }));
  }

  /* ---------------- reveals ---------------- */
  function setupReveals() {
    // generic .r
    const rs = document.querySelectorAll('.r');
    if (reduce) { rs.forEach((r) => r.classList.add('in')); }
    else rs.forEach((el) => ScrollTrigger.create({ trigger: el, start: 'top 88%',
      onEnter: () => el.classList.add('in') }));

    // clip-path frame reveals
    const frames = document.querySelectorAll('.frame');
    if (reduce) { frames.forEach((f) => f.classList.add('shown')); }
    else frames.forEach((f) => ScrollTrigger.create({ trigger: f, start: 'top 82%',
      onEnter: () => f.classList.add('shown') }));

    // SplitType line reveals on [data-split]
    if (!reduce) {
      document.querySelectorAll('[data-split]').forEach((el) => {
        const split = new SplitType(el, { types: 'lines' });
        split.lines.forEach((line) => {
          const w = document.createElement('div'); w.style.overflow = 'hidden'; w.style.display = 'block';
          line.parentNode.insertBefore(w, line); w.appendChild(line);
        });
        gsap.set(split.lines, { yPercent: 115 });
        ScrollTrigger.create({ trigger: el, start: 'top 85%', onEnter: () =>
          gsap.to(split.lines, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out' }) });
      });

      // parallax [data-speed]
      document.querySelectorAll('[data-speed]').forEach((el) => {
        const sp = parseFloat(el.getAttribute('data-speed')) || 0;
        gsap.to(el, { yPercent: sp * -12, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }
  }

  /* ---------------- count-up ---------------- */
  function animateCount(el) {
    const num = parseFloat(el.getAttribute('data-count'));
    if (isNaN(num) || reduce) { el.textContent = el.getAttribute('data-count'); return; }
    const dur = 1400, t0 = performance.now();
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(num * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  function setupCounts() {
    const counts = document.querySelectorAll('[data-count]');
    if (!reduce) counts.forEach((c) => ScrollTrigger.create({ trigger: c, start: 'top 92%',
      once: true, onEnter: () => animateCount(c) }));
    else counts.forEach(animateCount);
  }

  /* ---------------- typed terminals ---------------- */
  function typeTerminal(term) {
    const data = term.querySelector('script.seq'), body = term.querySelector('.body');
    if (!data || !body) return;
    let steps; try { steps = JSON.parse(data.textContent); } catch (e) { return; }
    const renderRow = (s) => s.cmd
      ? `<div class="row"><span class="prompt">mikael@sg</span> <span class="path">~ %</span> <span class="cmd">${s.cmd}</span></div>`
      : `<div class="row out">${s.out}</div>`;
    if (reduce) { body.innerHTML = steps.map(renderRow).join(''); return; }
    body.innerHTML = ''; const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async function run() {
      for (const s of steps) {
        if (s.cmd) {
          const row = document.createElement('div'); row.className = 'row';
          row.innerHTML = `<span class="prompt">mikael@sg</span> <span class="path">~ %</span> <span class="cmd"></span><span class="cursor-blink"></span>`;
          body.appendChild(row);
          const target = row.querySelector('.cmd'), cur = row.querySelector('.cursor-blink');
          for (let i = 0; i < s.cmd.length; i++) { target.textContent += s.cmd[i]; await sleep(32 + Math.random() * 34); }
          cur.remove(); await sleep(s.pause || 360);
        } else {
          const row = document.createElement('div'); row.className = 'row out'; row.innerHTML = s.out;
          body.appendChild(row); await sleep(s.pause || 240);
        }
      }
      const tail = document.createElement('div'); tail.className = 'row';
      tail.innerHTML = `<span class="prompt">mikael@sg</span> <span class="path">~ %</span> <span class="cursor-blink"></span>`;
      body.appendChild(tail);
    })();
  }
  function setupTerminals() {
    const terms = document.querySelectorAll('.term[data-typed]');
    terms.forEach((t) => ScrollTrigger.create({ trigger: t, start: 'top 80%', once: true,
      onEnter: () => typeTerminal(t) }));
  }

  /* ---------------- tunnel map pings ---------------- */
  function setupPings() {
    const map = document.querySelector('.rmap svg');
    if (!map || reduce) return;
    [...map.querySelectorAll('line.tunnel')].forEach((ln, i) => {
      const ping = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ping.setAttribute('r', '3.5'); ping.setAttribute('class', 'ping'); map.appendChild(ping);
      const x1 = +ln.getAttribute('x1'), y1 = +ln.getAttribute('y1');
      const x2 = +ln.getAttribute('x2'), y2 = +ln.getAttribute('y2');
      const dur = 1900 + i * 260, delay = i * 520, t0 = performance.now();
      (function tick(now) {
        const e = ((now - t0 - delay) % (dur + 700)) / dur;
        if (e >= 0 && e <= 1) {
          ping.setAttribute('cx', x2 + (x1 - x2) * e);
          ping.setAttribute('cy', y2 + (y1 - y2) * e);
          ping.setAttribute('opacity', String(Math.sin(e * Math.PI) * 0.95));
        } else ping.setAttribute('opacity', '0');
        requestAnimationFrame(tick);
      })(performance.now());
    });
  }

  /* ---------------- preloader → curtain up ---------------- */
  function preloader() {
    const pl = document.getElementById('preloader');
    const pct = pl && pl.querySelector('.pl-pct');
    const barFill = pl && pl.querySelector('.pl-bar i');

    function revealHero() {
      document.body.classList.remove('is-loading');
      startLenis();
      if (!reduce) {
        const tl = gsap.timeline();
        tl.to('#preloader', { yPercent: -100, duration: 1.0, ease: 'expo.inOut' })
          .from('.hero h1 .line span', { yPercent: 115, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, '-=0.5')
          .from('.hero-eyebrow, .hero .tagline, .hero .cta, .scrollcue',
            { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, '-=0.8')
          .add(() => pl && pl.remove());
      } else {
        if (pl) pl.remove();
        document.querySelectorAll('.hero h1 .line span').forEach((s) => (s.style.transform = 'none'));
      }
      ScrollTrigger.refresh();
    }

    if (!pl) { revealHero(); return; }

    if (reduce) {
      if (pct) pct.textContent = '100';
      setTimeout(revealHero, 200);
      return;
    }
    // animate a fake load to 100, finish on window load
    let progress = { v: 0 };
    let loaded = false;
    addEventListener('load', () => { loaded = true; });
    gsap.to(progress, { v: 100, duration: 1.6, ease: 'power1.inOut',
      onUpdate: () => { if (pct) pct.textContent = Math.round(progress.v); if (barFill) gsap.set(barFill, { scaleX: progress.v / 100 }); },
      onComplete: () => { const go = () => revealHero(); loaded ? go() : addEventListener('load', go, { once: true }); } });
  }

  /* ---------------- year ---------------- */
  const y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();

  /* ---------------- honest mode ---------------- */
  (function honestMode() {
    const btn = document.querySelector('.honest');
    if (!btn) return;
    const nodes = [...document.querySelectorAll('[data-honest]')];
    nodes.forEach((n) => { n.dataset.real = n.innerHTML; });
    let on = false;
    btn.addEventListener('click', () => {
      on = !on;
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      const txt = btn.querySelector('.htxt'); if (txt) txt.textContent = on ? 'Polished mode' : 'Honest mode';
      nodes.forEach((n) => {
        n.style.opacity = '0';
        setTimeout(() => { n.innerHTML = on ? n.dataset.honest : n.dataset.real; n.style.opacity = '1'; }, 220);
      });
    });
  })();

  /* ---------------- boot ---------------- */
  function boot() {
    setupReveals(); setupCounts(); setupTerminals(); setupPings();
    preloader();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
