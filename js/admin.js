import { CONFIG } from '../config.js';

let db = null;

function getSupabase() {
  if (db) return db;
  const { url, anonKey } = CONFIG.supabase;
  if (!url || url === 'YOUR_SUPABASE_URL') return null;
  db = window.supabase.createClient(url, anonKey);
  return db;
}

// ── Password gate ──────────────────────────────────────────────────
function checkPassword() {
  const input    = document.getElementById('admin-password');
  const errorEl  = document.getElementById('pw-error');
  const loginEl  = document.getElementById('admin-login');
  const dashEl   = document.getElementById('admin-dashboard');

  if (input.value === CONFIG.admin.password) {
    loginEl.style.display  = 'none';
    dashEl.style.display   = 'block';
    sessionStorage.setItem('admin_auth', '1');
    loadDashboard();
  } else {
    errorEl.textContent = 'Contraseña incorrecta.';
    input.value = '';
    input.focus();
  }
}

// ── Load RSVPs ─────────────────────────────────────────────────────
async function loadRSVPs() {
  const db = getSupabase();
  if (!db) return showSetupWarning();

  const { data, error } = await db
    .from('rsvps')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) { console.error(error); return; }
  renderRSVPs(data ?? []);
}

function renderRSVPs(rows) {
  const tbody  = document.getElementById('rsvp-tbody');
  const countEl = document.getElementById('rsvp-count');

  const attending = rows.filter(r => r.attending);
  const total     = attending.reduce((s, r) => s + (r.num_people || 0), 0);

  if (countEl) {
    countEl.textContent =
      `${rows.length} respuesta${rows.length !== 1 ? 's' : ''} · ` +
      `${attending.length} asistirán · ${total} persona${total !== 1 ? 's' : ''}`;
  }

  if (!tbody) return;

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#aaa;padding:2rem;">Sin confirmaciones aún.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.guest_name}</td>
      <td class="${r.attending ? 'yes' : 'no'}">${r.attending ? '✓ Sí' : '✗ No'}</td>
      <td>${r.attending ? (r.num_people ?? '—') : '—'}</td>
      <td>${r.dietary_restrictions || '—'}</td>
      <td>${r.guest_token || '—'}</td>
      <td>${formatDate(r.submitted_at)}</td>
    </tr>
  `).join('');
}

// ── Load guests (token management) ────────────────────────────────
async function loadGuests() {
  const db = getSupabase();
  if (!db) return;

  const { data, error } = await db
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  renderGuests(data ?? []);
}

function renderGuests(rows) {
  const tbody = document.getElementById('guests-tbody');
  if (!tbody) return;

  if (rows.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#aaa;padding:2rem;">No hay invitados aún. Crea el primero abajo.</td></tr>';
    return;
  }

  const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', 'index.html');

  tbody.innerHTML = rows.map(r => {
    const url = `${baseUrl}?invite=${r.token}`;
    return `
      <tr>
        <td>${r.name}</td>
        <td>${r.max_seats}</td>
        <td style="font-size:0.8rem;word-break:break-all;">
          <a href="${url}" target="_blank">${url}</a>
        </td>
        <td>
          <button class="btn-copy btn-sm" data-url="${url}">Copiar</button>
          <button class="btn-danger btn-sm" data-token="${r.token}">Eliminar</button>
        </td>
      </tr>`;
  }).join('');

  // Copy buttons
  tbody.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.url);
      btn.textContent = '✓ Copiado';
      setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
    });
  });

  // Delete buttons
  tbody.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar este invitado?')) return;
      const db = getSupabase();
      await db.from('guests').delete().eq('token', btn.dataset.token);
      loadGuests();
    });
  });
}

// ── Create guest token ─────────────────────────────────────────────
async function createGuest(e) {
  e.preventDefault();
  const db = getSupabase();
  if (!db) return;

  const name     = document.getElementById('g-name').value.trim();
  const maxSeats = parseInt(document.getElementById('g-seats').value, 10);

  if (!name || !maxSeats) return;

  const token = generateToken(name);

  const { error } = await db.from('guests').insert([{ token, name, max_seats: maxSeats }]);
  if (error) { alert('Error: ' + error.message); return; }

  e.target.reset();
  loadGuests();
}

function generateToken(name) {
  const slug   = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const random = Math.random().toString(36).slice(2, 8);
  return `${slug}-${random}`;
}

// ── CSV Export ─────────────────────────────────────────────────────
async function exportCSV() {
  const db = getSupabase();
  if (!db) return;

  const { data } = await db.from('rsvps').select('*').order('submitted_at', { ascending: false });
  if (!data?.length) { alert('No hay confirmaciones.'); return; }

  const headers = ['Nombre', '¿Asiste?', 'Personas', 'Restricciones', 'Token', 'Fecha'];
  const rows    = data.map(r => [
    r.guest_name,
    r.attending ? 'Sí' : 'No',
    r.attending ? (r.num_people ?? '') : '',
    r.dietary_restrictions ?? '',
    r.guest_token ?? '',
    formatDate(r.submitted_at),
  ]);

  const csv  = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'rsvps.csv' });
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ───────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' });
}

function showSetupWarning() {
  document.getElementById('setup-warning')?.style.setProperty('display', 'block');
}

// ── Dashboard init ────────────────────────────────────────────────
function loadDashboard() {
  const db = getSupabase();
  if (!db) { showSetupWarning(); return; }

  loadRSVPs();
  loadGuests();
}

// ── Boot ──────────────────────────────────────────────────────────
export function initAdmin() {
  // Already authenticated in this session?
  if (sessionStorage.getItem('admin_auth') === '1') {
    document.getElementById('admin-login').style.display     = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadDashboard();
  }

  document.getElementById('login-btn')?.addEventListener('click', checkPassword);
  document.getElementById('admin-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });

  document.getElementById('refresh-btn')?.addEventListener('click', loadRSVPs);
  document.getElementById('export-btn')?.addEventListener('click', exportCSV);
  document.getElementById('create-guest-form')?.addEventListener('submit', createGuest);
}
