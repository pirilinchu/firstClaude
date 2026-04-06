// ══════════════════════════════════════════════════════════════════
//  WEDDING CONFIG — Edit this file to customize your site.
//  No other files need to be touched for content or style changes.
// ══════════════════════════════════════════════════════════════════

export const CONFIG = {

  // ── COUPLE ───────────────────────────────────────────────────────
  couple: {
    partner1:  "Santiago",
    partner2:  "Alexandra",
    fullNames: "Santiago Mendoza & Alexandra Bustamante",
  },

  // ── EVENT ────────────────────────────────────────────────────────
  event: {
    isoDate:       "2026-10-03T17:00:00",  // Used for countdown
    dateDisplay:   "3 · Octubre · 2026",   // Displayed on the hero
    ceremonyTime:  "17:00 hrs",
    receptionTime: "19:00 hrs",
    venue:         "Viñedo Cañón Escondido",
    city:          "Tarija, Bolivia",
    rsvpDeadline:  "1 de septiembre de 2026",
    mapsEmbedUrl:  "https://maps.google.com/maps?q=Tarija+Bolivia&t=&z=13&ie=UTF8&iwloc=&output=embed",
    mapsSearchUrl: "https://www.google.com/maps/search/Vi%C3%B1edo+Ca%C3%B1%C3%B3n+Escondido+Tarija+Bolivia",
  },

  // ── THEME ────────────────────────────────────────────────────────
  theme: {
    colors: {
      burgundy:  "#6B2737",
      deepBurg:  "#4A1525",
      gold:      "#C9A96E",
      lightGold: "#E8D5A3",
      cream:     "#FAF7F2",
      warmWhite: "#FFFDF9",
      charcoal:  "#3D3D3D",
    },
    fonts: {
      heading: "Cormorant Garamond",  // Serif — headings & names
      body:    "Lato",                // Sans-serif — body text & labels
    },
    // Replace null with a path or URL to use an image in the hero.
    // e.g.  heroBgImage: "./images/vineyard.jpg"
    heroBgImage: null,
  },

  // ── GIFT / BANK ──────────────────────────────────────────────────
  gift: {
    bank:     "Banco Unión S.A.",
    holder:   "Santiago Mendoza",
    account:  "1-6453782-0-1",
    currency: "Bolivianos (BOB)",
    ci:       "8234567",
  },

  // ── APP LINKS ────────────────────────────────────────────────────
  apps: {
    appStore:   "https://apps.apple.com",   // Replace with real link when ready
    googlePlay: "https://play.google.com",  // Replace with real link when ready
  },

  // ── SUPABASE (backend for RSVPs & guest tokens) ──────────────────
  // Setup steps:
  //   1. Go to https://supabase.com → create a free project
  //   2. Open the SQL Editor and run the contents of supabase-setup.sql
  //   3. Go to Project Settings → API and paste your values below
  supabase: {
    url:     "https://gsyymnjxjpipcrbjjehm.supabase.co",       // https://xxxx.supabase.co
    anonKey: "sb_publishable_g-d45RUlA1n8GSxtZsnOWA_E2Zq9Jpu",  // anon / public key
  },

  // ── ADMIN ────────────────────────────────────────────────────────
  // Password required to open admin.html and see all RSVPs.
  // Change this before deploying!
  admin: {
    password: "bodas2026",
  },

};
