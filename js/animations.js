/** Floating grape-leaf SVG string (reused for each leaf element) */
const LEAF_SVG = `
<svg viewBox="0 0 42 52" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 3 C25 3 30 6 33 10 C37 8 41 11 41 16 C41 22 37 26 33 27
           C35 32 33 39 28 43 C25 46 22 49 21 51 C20 49 17 46 14 43
           C9 39 7 32 9 27 C5 26 1 22 1 16 C1 11 5 8 9 10
           C12 6 17 3 21 3 Z"
    fill="rgba(107,39,55,0.12)" stroke="#C9A96E" stroke-width="0.8" opacity="0.7"/>
  <line x1="21" y1="5"  x2="21" y2="49" stroke="#C9A96E" stroke-width="0.5" opacity="0.4"/>
  <line x1="21" y1="17" x2="9"  y2="30" stroke="#C9A96E" stroke-width="0.4" opacity="0.35"/>
  <line x1="21" y1="17" x2="33" y2="30" stroke="#C9A96E" stroke-width="0.4" opacity="0.35"/>
  <line x1="21" y1="28" x2="11" y2="40" stroke="#C9A96E" stroke-width="0.4" opacity="0.3"/>
  <line x1="21" y1="28" x2="31" y2="40" stroke="#C9A96E" stroke-width="0.4" opacity="0.3"/>
</svg>`;

const LEAF_CONFIGS = [
  { left:  '4%', size: 22, dur: 13, delay:  0 },
  { left: '13%', size: 16, dur: 17, delay:  4 },
  { left: '25%', size: 26, dur: 14, delay:  8 },
  { left: '38%', size: 18, dur: 19, delay:  2 },
  { left: '52%', size: 24, dur: 12, delay:  6 },
  { left: '65%', size: 20, dur: 16, delay: 10 },
  { left: '78%', size: 28, dur: 15, delay:  3 },
  { left: '91%', size: 17, dur: 11, delay:  7 },
];

/** Spawns animated floating leaves inside #leaf-stage */
export function initLeaves() {
  const stage = document.getElementById('leaf-stage');
  if (!stage) return;

  LEAF_CONFIGS.forEach(({ left, size, dur, delay }) => {
    const el = document.createElement('div');
    el.className = 'f-leaf';
    el.innerHTML = LEAF_SVG;
    el.style.cssText = [
      `left:${left}`,
      `width:${size}px`,
      `height:${Math.round(size * 1.24)}px`,
      `animation-duration:${dur}s`,
      `animation-delay:-${delay}s`,
    ].join(';');
    stage.appendChild(el);
  });
}

/** Fade-in elements with class .fade-in as they enter the viewport */
export function initScrollFade() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
