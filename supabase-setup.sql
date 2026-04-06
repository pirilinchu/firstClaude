-- ══════════════════════════════════════════════════════════════════
--  SUPABASE SETUP — Run this once in the Supabase SQL Editor
--  Project → SQL Editor → New Query → paste → Run
-- ══════════════════════════════════════════════════════════════════


-- ── GUESTS TABLE ─────────────────────────────────────────────────
-- One row per invitation. Each row generates a unique invite link.
CREATE TABLE IF NOT EXISTS guests (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  token      text        UNIQUE NOT NULL,         -- used in ?invite=TOKEN
  name       text        NOT NULL,                -- pre-fills the RSVP form
  max_seats  int         NOT NULL DEFAULT 2,      -- 1 | 2 | 3
  created_at timestamptz DEFAULT now()
);

-- ── RSVPS TABLE ──────────────────────────────────────────────────
-- One row per submitted RSVP.
CREATE TABLE IF NOT EXISTS rsvps (
  id                   uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_token          text        REFERENCES guests(token) ON DELETE SET NULL,
  guest_name           text        NOT NULL,
  attending            boolean     NOT NULL,
  num_people           int,
  dietary_restrictions text,
  submitted_at         timestamptz DEFAULT now()
);


-- ── ROW LEVEL SECURITY ───────────────────────────────────────────
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps  ENABLE ROW LEVEL SECURITY;

-- Anyone can look up a guest record by token (needed to load the invite page)
CREATE POLICY "guests_select" ON guests
  FOR SELECT USING (true);

-- Anyone can submit an RSVP
CREATE POLICY "rsvps_insert" ON rsvps
  FOR INSERT WITH CHECK (true);

-- Anyone can read RSVPs (the admin.html password gates the UI)
-- To restrict further, remove this policy and use Supabase Auth.
CREATE POLICY "rsvps_select" ON rsvps
  FOR SELECT USING (true);
