import { CONFIG } from '../config.js';

let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  const { url, anonKey } = CONFIG.supabase;
  if (!url || url === 'YOUR_SUPABASE_URL') return null;
  supabase = window.supabase.createClient(url, anonKey);
  return supabase;
}

/**
 * Reads ?invite=TOKEN from the URL and loads guest data from Supabase.
 * Returns { name, maxSeats, token } or null if no token / Supabase not set up.
 */
async function loadGuest() {
  const token = new URLSearchParams(window.location.search).get('invite');
  if (!token) return null;

  const db = getSupabase();
  if (!db) return null;

  const { data, error } = await db
    .from('guests')
    .select('name, max_seats, token')
    .eq('token', token)
    .single();

  if (error || !data) {
    console.warn('Guest token not found:', token);
    return null;
  }

  return { name: data.name, maxSeats: data.max_seats, token: data.token };
}

/** Submits an RSVP to Supabase (or falls back to a local thank-you if not configured) */
async function submitRSVP(payload) {
  const db = getSupabase();

  if (!db) {
    // Supabase not configured — still show thank-you, warn in console
    console.warn('Supabase not configured. RSVP not saved to database.');
    return { ok: true, offline: true };
  }

  const { error } = await db.from('rsvps').insert([payload]);
  if (error) throw error;
  return { ok: true };
}

export async function initRSVP() {
  const form       = document.getElementById('rsvp-form');
  const thankYou   = document.getElementById('rsvp-thankyou');
  const nameInput  = document.getElementById('f-nombre');
  const radioRow   = document.getElementById('f-asistencia-row');
  const numInput   = document.getElementById('f-personas');
  const numLabel   = document.getElementById('f-personas-label');

  if (!form) return;

  // ── Load personalized guest data ──────────────────────────────
  const guest = await loadGuest();

  if (guest) {
    // Pre-fill name and lock it (this is a personal invite)
    nameInput.value    = guest.name;
    nameInput.readOnly = true;
    nameInput.style.background = 'var(--cream)';
    nameInput.style.cursor     = 'default';

    // Cap the seat count to what this invite allows
    numInput.max = guest.maxSeats;

    if (guest.maxSeats === 1) {
      // Solo invite — hide the people count field entirely
      numInput.value = 1;
      numInput.closest('.form-group').style.display = 'none';
    } else {
      if (numLabel) {
        numLabel.textContent = `Número de personas (máx. ${guest.maxSeats}) *`;
      }
    }
  }

  // ── Form validation & submission ──────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault();

    let valid = true;

    // Validate name
    nameInput.classList.remove('err');
    if (!nameInput.value.trim()) {
      nameInput.classList.add('err');
      valid = false;
    }

    // Validate attendance radio
    const attending = form.querySelector('input[name="asistencia"]:checked');
    radioRow.classList.remove('err');
    if (!attending) {
      radioRow.classList.add('err');
      valid = false;
    }

    // Validate seat count (only when attending)
    numInput.classList.remove('err');
    const isAttending = attending?.value === 'si';
    if (isAttending && (!numInput.value || parseInt(numInput.value, 10) < 1)) {
      numInput.classList.add('err');
      valid = false;
    }

    if (!valid) {
      form.querySelector('.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Disable submit while saving
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.textContent = 'Guardando…';

    try {
      await submitRSVP({
        guest_token:          guest?.token ?? null,
        guest_name:           nameInput.value.trim(),
        attending:            isAttending,
        num_people:           isAttending ? parseInt(numInput.value, 10) : 0,
        dietary_restrictions: document.getElementById('f-restricciones')?.value.trim() || null,
      });

      form.style.display = 'none';
      thankYou.classList.add('show');
      thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      console.error('RSVP submission failed:', err);
      btn.disabled    = false;
      btn.textContent = 'Confirmar asistencia';
      alert('Hubo un error al guardar. Por favor intenta de nuevo.');
    }
  });

  // Clear error state on interaction
  nameInput.addEventListener('input', () => nameInput.classList.remove('err'));
  numInput.addEventListener('input',  () => numInput.classList.remove('err'));
  form.querySelectorAll('input[name="asistencia"]').forEach(r =>
    r.addEventListener('change', () => radioRow.classList.remove('err'))
  );
}
