import { CONFIG } from '../config.js';

/**
 * Applies color and font config to CSS custom properties and
 * injects the Google Fonts <link> tag dynamically.
 */
export function applyTheme() {
  const { colors, fonts, heroBgImage } = CONFIG.theme;
  const root = document.documentElement;

  // Colors → CSS variables
  root.style.setProperty('--burgundy',   colors.burgundy);
  root.style.setProperty('--deep-burg',  colors.deepBurg);
  root.style.setProperty('--gold',       colors.gold);
  root.style.setProperty('--light-gold', colors.lightGold);
  root.style.setProperty('--cream',      colors.cream);
  root.style.setProperty('--warm-white', colors.warmWhite);
  root.style.setProperty('--charcoal',   colors.charcoal);

  // Fonts → CSS variables
  root.style.setProperty('--font-heading', `"${fonts.heading}", serif`);
  root.style.setProperty('--font-body',    `"${fonts.body}", sans-serif`);

  // Hero background image (if set)
  if (heroBgImage) {
    root.style.setProperty('--hero-bg-image', `url("${heroBgImage}")`);
  }

  // Inject Google Fonts
  const headingParam = fonts.heading.replace(/ /g, '+');
  const bodyParam    = fonts.body.replace(/ /g, '+');
  const href = `https://fonts.googleapis.com/css2?family=${headingParam}:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=${bodyParam}:wght@300;400;700&display=swap`;

  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = href;
  document.head.prepend(link);

  // Preconnect for faster font load
  ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].forEach(origin => {
    const pc = document.createElement('link');
    pc.rel = 'preconnect';
    pc.href = origin;
    if (origin.includes('gstatic')) pc.crossOrigin = '';
    document.head.prepend(pc);
  });
}
