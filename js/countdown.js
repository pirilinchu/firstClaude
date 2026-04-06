import { CONFIG } from '../config.js';

export function initCountdown() {
  const target  = new Date(CONFIG.event.isoDate);
  const els = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
  };

  if (!els.days) return; // not on a page with a countdown

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      Object.values(els).forEach(el => { el.textContent = '00'; });
      return;
    }

    els.days.textContent    = Math.floor(diff / 86_400_000);
    els.hours.textContent   = pad(Math.floor((diff % 86_400_000) / 3_600_000));
    els.minutes.textContent = pad(Math.floor((diff % 3_600_000)  /    60_000));
    els.seconds.textContent = pad(Math.floor((diff % 60_000)     /     1_000));
  }

  tick();
  setInterval(tick, 1_000);
}
