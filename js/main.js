import { applyTheme }    from './theme.js';
import { initCountdown } from './countdown.js';
import { initLeaves, initScrollFade } from './animations.js';
import { renderQR }      from './qr.js';
import { initRSVP }      from './rsvp.js';
import { CONFIG }        from '../config.js';

// Apply colors & fonts from config before anything renders
applyTheme();

document.addEventListener('DOMContentLoaded', () => {
  initLeaves();
  initScrollFade();
  initCountdown();
  renderQR('qr-holder');
  initRSVP();
  populateContent();
});

/** Fills in any text nodes driven by CONFIG (couple names, dates, etc.) */
function populateContent() {
  const { couple, event, gift, apps } = CONFIG;

  setAll('[data-partner1]',     couple.partner1);
  setAll('[data-partner2]',     couple.partner2);
  setAll('[data-full-names]',   couple.fullNames);
  setAll('[data-date-display]', event.dateDisplay);
  setAll('[data-venue]',        event.venue);
  setAll('[data-city]',         event.city);
  setAll('[data-ceremony-time]',  event.ceremonyTime);
  setAll('[data-reception-time]', event.receptionTime);
  setAll('[data-rsvp-deadline]',  event.rsvpDeadline);

  // Gift details
  setAll('[data-gift-bank]',     gift.bank);
  setAll('[data-gift-holder]',   gift.holder);
  setAll('[data-gift-account]',  gift.account);
  setAll('[data-gift-currency]', gift.currency);
  setAll('[data-gift-ci]',       gift.ci);

  // Map
  const mapFrame = document.getElementById('map-frame');
  if (mapFrame) mapFrame.src = event.mapsEmbedUrl;

  const mapBtn = document.getElementById('map-btn');
  if (mapBtn) mapBtn.href = event.mapsSearchUrl;

  // App store links
  const appStoreBtn   = document.getElementById('app-store-btn');
  const googlePlayBtn = document.getElementById('google-play-btn');
  if (appStoreBtn)   appStoreBtn.href   = apps.appStore;
  if (googlePlayBtn) googlePlayBtn.href = apps.googlePlay;
}

function setAll(selector, value) {
  document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
}
