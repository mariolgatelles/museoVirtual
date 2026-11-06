/* Obras de ejemplo: se pintan con código. Para las reales, cada una se reemplaza por su foto. */
const WORKS = [
  { title: 'Arte pop', series: 'Arte pop', src: './img/artePOP.jpeg' },
  { title: 'India', series: 'Retrato', src: './img/india.jpeg' },
  { title: 'Jesús', series: 'Religioso', tech: 'Crayón sobre hoja', year: 2026, src: './img/jesus.jpeg' },
  { title: 'Loro', series: 'Fauna', src: './img/loro.jpeg' },
  { title: 'Retrato pop', series: 'Arte pop', src: './img/nariArtePOP.jpeg' },
  { title: 'Niña en el agua', series: 'Retrato', src: './img/niñaEnElAgua.jpeg' },
  { title: 'Perro', series: 'Fauna', src: './img/perro.jpeg' },
  { title: 'Persona en el agua', series: 'Retrato', src: './img/personaEnElAgua.jpeg' },
  { title: 'Tortuga', series: 'Fauna', src: './img/Tortuga.jpeg' }
];

/* ---------- Generador de pinturas ---------- */
const TAU = Math.PI * 2;
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function blob(ctx, r, cx, cy, rad) {
  const n = 14, pts = [];
  for (let i = 0; i < n; i++) {
    const a = i / n * TAU, k = rad * (0.62 + 0.62 * r());
    pts.push([cx + Math.cos(a) * k, cy + Math.sin(a) * k]);
  }
  ctx.beginPath();
  ctx.moveTo((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2);
  for (let i = 1; i <= n; i++) {
    const p = pts[i % n], q = pts[(i + 1) % n];
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
  }
  ctx.closePath();
}
function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }

const STYLES = {
  abstract(ctx, w, h, r, P) {
    ctx.fillStyle = P[0]; ctx.fillRect(0, 0, w, h);
    const m = Math.min(w, h);
    for (let i = 0; i < 12; i++) {
      ctx.globalAlpha = 0.55 + 0.4 * r();
      ctx.fillStyle = pick(r, P.slice(1, -1));
      blob(ctx, r, r() * w, r() * h, (0.15 + 0.3 * r()) * m); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = pick(r, P.slice(1, -1)); ctx.lineWidth = (0.012 + 0.04 * r()) * w;
      ctx.beginPath(); ctx.moveTo(r() * w, r() * h);
      ctx.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, r() * h); ctx.stroke();
    }
    ctx.strokeStyle = P[P.length - 1]; ctx.lineWidth = w * 0.004;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(r() * w, r() * h);
      ctx.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, r() * h); ctx.stroke();
    }
  },
  field(ctx, w, h, r, P) {
    ctx.fillStyle = P[0]; ctx.fillRect(0, 0, w, h);
    const blocks = [[0.1, 0.09, 0.8, 0.46, P[1]], [0.1, 0.6, 0.8, 0.3, P[2]]];
    blocks.forEach(([x, y, bw, bh, col]) => {
      for (let k = 0; k < 2; k++) {
        ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = w * 0.035; ctx.fillStyle = col; ctx.globalAlpha = k ? 0.9 : 0.6;
        ctx.fillRect(x * w, y * h, bw * w, bh * h); ctx.restore();
      }
    });
    ctx.fillStyle = P[3]; ctx.globalAlpha = 0.85; ctx.fillRect(0.1 * w, 0.565 * h, 0.8 * w, 0.014 * h); ctx.globalAlpha = 1;
  },
  landscape(ctx, w, h, r, P, o) {
    const g = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    g.addColorStop(0, P[0]); g.addColorStop(1, P[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (o.night) {
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 70; i++) { ctx.globalAlpha = 0.3 + 0.7 * r(); ctx.fillRect(r() * w, r() * h * 0.45, w * 0.003, w * 0.003); }
      ctx.globalAlpha = 1;
    }
    const sx = w * (0.3 + 0.4 * r()), sy = h * 0.3, sr = w * 0.085;
    const halo = ctx.createRadialGradient(sx, sy, sr * 0.4, sx, sy, sr * 3);
    halo.addColorStop(0, P[2] + 'AA'); halo.addColorStop(1, P[2] + '00'); ctx.fillStyle = halo; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = P[2]; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, TAU); ctx.fill();
    const ridge = (base, amp, col) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(0, h);
      const ph = r() * 10, f = 2 + r() * 3, step = o.jag ? w / 14 : w / 60;
      for (let x = 0; x <= w + step; x += step) {
        const y = o.jag ? base - amp * (0.25 + 0.75 * r())
                        : base - amp * (0.5 * Math.sin(x / w * f * Math.PI + ph) + 0.5 * Math.sin(x / w * f * 2.3 + ph * 2) + 0.5);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
    };
    if (o.lake) {
      ridge(h * 0.6, h * 0.12, P[3]);
      const wg = ctx.createLinearGradient(0, h * 0.6, 0, h); wg.addColorStop(0, P[4]); wg.addColorStop(1, P[6]);
      ctx.fillStyle = wg; ctx.fillRect(0, h * 0.6, w, h * 0.4);
      ctx.fillStyle = P[2]; ctx.globalAlpha = 0.5;
      for (let i = 0; i < 16; i++) { const yy = h * (0.62 + 0.36 * (i / 16)); const ww = sr * (1.8 - i * 0.07); ctx.fillRect(sx - ww / 2 + (r() - .5) * sr * .4, yy, Math.max(ww, sr * .3), h * 0.008); }
      ctx.globalAlpha = 1;
      ridge(h * 0.7, h * 0.08, P[5]);
    } else {
      ridge(h * 0.58, h * 0.16, P[3]); ridge(h * 0.7, h * 0.16, P[4]);
      ridge(h * 0.82, h * 0.16, P[5]); ridge(h * 0.95, h * 0.14, P[6]);
    }
  },
  portrait(ctx, w, h, r, P, o) {
    ctx.fillStyle = P[0]; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = P[1]; ctx.fillRect(w * 0.52, 0, w * 0.48, h);
    ctx.fillStyle = P[4]; ctx.globalAlpha = 0.5; blob(ctx, r, w * 0.22, h * 0.8, w * 0.28); ctx.fill(); ctx.globalAlpha = 1;
    const face = (cx, cy, s, tilt, skin, hair, lip, shirt) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(tilt);
      ctx.fillStyle = shirt; ctx.beginPath(); ctx.ellipse(0, s * 1.5, s * 1.05, s * 0.6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(0, -s * 0.05, s * 0.66, s * 0.82, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = skin; ctx.fillRect(-s * 0.15, s * 0.4, s * 0.3, s * 0.7);
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.46, s * 0.62, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.46, s * 0.62, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = 'rgba(40,10,30,.2)'; ctx.fillRect(s * 0.06, -s, s, s * 2); ctx.restore();
      ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(-s * 0.12, -s * 0.5, s * 0.52, s * 0.2, -0.2, 0, TAU); ctx.fill();
      ctx.fillStyle = P[3]; ctx.beginPath();
      ctx.ellipse(-s * 0.17, -s * 0.04, s * 0.06, s * 0.025, 0, 0, TAU); ctx.ellipse(s * 0.17, -s * 0.04, s * 0.06, s * 0.025, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = P[3]; ctx.lineWidth = s * 0.018; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-s * 0.26, -s * 0.14); ctx.lineTo(-s * 0.09, -s * 0.16); ctx.moveTo(s * 0.09, -s * 0.16); ctx.lineTo(s * 0.26, -s * 0.14);
      ctx.moveTo(0, -s * 0.02); ctx.lineTo(-s * 0.04, s * 0.14); ctx.lineTo(s * 0.02, s * 0.16); ctx.stroke();
      ctx.fillStyle = lip; ctx.beginPath(); ctx.ellipse(0, s * 0.31, s * 0.1, s * 0.032, 0, 0, TAU); ctx.fill();
      ctx.restore();
    };
    if (o.pair) {
      ctx.globalAlpha = 0.92; face(w * 0.36, h * 0.44, w * 0.3, -0.08, P[2], P[3], P[5], P[1]);
      face(w * 0.64, h * 0.5, w * 0.28, 0.1, '#E3A98A', P[5], P[4], P[0]); ctx.globalAlpha = 1;
    } else {
      face(w * 0.5, h * 0.4, w * 0.4, 0.08, P[2], P[3], P[5], P[4]);
    }
    ctx.strokeStyle = P[3]; ctx.lineWidth = w * 0.005; ctx.globalAlpha = 0.8;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(r() * w, r() * h); ctx.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, r() * h); ctx.stroke(); }
    ctx.globalAlpha = 1;
  },
  flowers(ctx, w, h, r, P) {
    ctx.fillStyle = P[0]; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) {
      const x = r() * w, y = r() * h, rad = (0.1 + 0.2 * r()) * w, col = pick(r, P.slice(2));
      const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
      g.addColorStop(0, col + '66'); g.addColorStop(1, col + '00'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const fx = w * (0.14 + 0.72 * r()), fy = h * (0.2 + 0.42 * r()), pr = w * (0.06 + 0.04 * r());
      ctx.strokeStyle = P[1]; ctx.lineWidth = w * 0.009; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.moveTo(fx + (r() - .5) * w * .2, h * 1.02); ctx.quadraticCurveTo(fx + (r() - .5) * w * .25, h * 0.7, fx, fy); ctx.stroke();
      const col = pick(r, P.slice(2));
      ctx.fillStyle = col; ctx.globalAlpha = 0.78;
      for (let k = 0; k < 9; k++) {
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(k / 9 * TAU);
        ctx.beginPath(); ctx.ellipse(0, -pr, pr * 0.42, pr, 0, 0, TAU); ctx.fill(); ctx.restore();
      }
      ctx.globalAlpha = 1; ctx.fillStyle = '#F6C453'; ctx.beginPath(); ctx.arc(fx, fy, pr * 0.32, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
};

function grain(ctx, w, h, seed) {
  const r = rng(seed + 999), n = w * h / 14;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = r() < 0.5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)';
    ctx.fillRect(r() * w, r() * h, 1.4, 1.4);
  }
}
function paint(canvas, work, longSide) {
  const [rw, rh] = work.ratio, k = longSide / Math.max(rw, rh);
  const w = Math.round(rw * k), h = Math.round(rh * k);
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  STYLES[work.style](ctx, w, h, rng(work.seed), work.pal, work);
  grain(ctx, w, h, work.seed);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', work.title + ', ' + work.tech);
}

/* ---------- Página ---------- */
const wall = document.getElementById('wall');
const filtersEl = document.getElementById('filters');
const countEl = document.getElementById('count');
const pad = n => String(n).padStart(2, '0');
const formatSpec = w => [w.tech, w.size, w.year].filter(Boolean).join(' · ');
let current = 'Todas';

WORKS.forEach((w, i) => { w.no = i + 1; });
const SERIES = ['Todas', ...Array.from(new Set(WORKS.map(w => w.series)))];

SERIES.forEach(name => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip'; b.textContent = name;
  b.setAttribute('aria-pressed', name === current ? 'true' : 'false');
  b.addEventListener('click', () => { current = name; applyFilter(); });
  filtersEl.appendChild(b);
});

WORKS.forEach((w, i) => {
  const fig = document.createElement('figure');
  fig.className = 'work'; fig.dataset.series = w.series;
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'piece'; btn.setAttribute('aria-label', 'Ver de cerca: ' + w.title);
  const frame = document.createElement('span'); frame.className = 'frame';
  if (w.src) {
    const image = document.createElement('img');
    image.src = w.src; image.alt = w.title; image.loading = 'lazy';
    frame.appendChild(image);
  } else {
    const cv = document.createElement('canvas'); paint(cv, w, 720);
    frame.appendChild(cv);
  }
  const look = document.createElement('span'); look.className = 'look'; look.textContent = 'Ver de cerca';
  btn.append(frame, look);
  btn.addEventListener('click', () => openLb(w));
  const cap = document.createElement('figcaption'); cap.className = 'label';
  cap.innerHTML = '<span class="no">N.º ' + pad(w.no) + '</span><h2></h2><span class="spec"></span>';
  cap.querySelector('h2').textContent = w.title;
  cap.querySelector('.spec').textContent = formatSpec(w);
  fig.append(btn, cap);
  wall.appendChild(fig);
  w.el = fig;
});

function visibleWorks() { return WORKS.filter(w => current === 'Todas' || w.series === current); }
function applyFilter() {
  WORKS.forEach(w => { w.el.hidden = !(current === 'Todas' || w.series === current); });
  [...filtersEl.children].forEach(b => b.setAttribute('aria-pressed', b.textContent === current ? 'true' : 'false'));
  const n = visibleWorks().length;
  countEl.textContent = pad(n) + (n === 1 ? ' obra' : ' obras');
}
applyFilter();

/* ---------- Vista de cerca ---------- */
const lb = document.getElementById('lb');
const lbArt = document.getElementById('lbArt');
let lbWork = null, lastFocus = null;

function showLb(w) {
  lbWork = w;
  if (w.src) {
    const image = document.createElement('img');
    image.src = w.src; image.alt = w.title;
    lbArt.replaceChildren(image);
  } else {
    const cv = document.createElement('canvas'); paint(cv, w, 1500);
    lbArt.replaceChildren(cv);
  }
  document.getElementById('lbNo').textContent = 'N.º ' + pad(w.no) + ' · ' + w.series;
  document.getElementById('lbTitle').textContent = w.title;
  document.getElementById('lbSpec').textContent = formatSpec(w);
}
function openLb(w) {
  lastFocus = document.activeElement;
  showLb(w); lb.hidden = false; document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function closeLb() {
  lb.hidden = true; document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
function step(d) {
  const list = visibleWorks(), i = list.indexOf(lbWork);
  showLb(list[(i + d + list.length) % list.length]);
}
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => step(-1));
document.getElementById('lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb || e.target === lbArt) closeLb(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLb();
  else if (e.key === 'ArrowLeft') step(-1);
  else if (e.key === 'ArrowRight') step(1);
});