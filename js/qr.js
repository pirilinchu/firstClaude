/**
 * Generates a visually convincing QR-code-like SVG placeholder.
 * Uses the standard 21×21 (Version 1) structure with the three
 * finder patterns and seeded pseudo-random data modules.
 */
export function renderQR(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const SIZE  = 21;
  const CELL  = 8;
  const QUIET = 10;
  const TOTAL = SIZE * CELL + QUIET * 2;

  // Build empty grid
  const g = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));

  // Standard QR finder pattern (7×7)
  const FP = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];

  function placeFinder(row, col) {
    FP.forEach((r, ri) => r.forEach((v, ci) => { g[row + ri][col + ci] = v; }));
  }

  placeFinder(0, 0);           // top-left
  placeFinder(0, SIZE - 7);    // top-right
  placeFinder(SIZE - 7, 0);    // bottom-left

  // Timing patterns
  for (let i = 8; i < SIZE - 8; i++) {
    g[6][i] = i % 2 === 0 ? 1 : 0;
    g[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Seeded XOR-shift random for reproducible data modules
  let seed = 0x12A4F7C3;
  function rand() {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 0xFFFFFFFF;
  }

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (r < 8  && c < 8)         continue; // top-left finder zone
      if (r < 8  && c >= SIZE - 8) continue; // top-right finder zone
      if (r >= SIZE - 8 && c < 8)  continue; // bottom-left finder zone
      if (r === 6 || c === 6)       continue; // timing rows/cols
      if (r === 7 || c === 7)       continue; // separators
      if (r === SIZE - 8)           continue; // bottom separator
      g[r][c] = rand() > 0.48 ? 1 : 0;
    }
  }

  // Build SVG
  const rects = g.flatMap((row, r) =>
    row.map((v, c) => v
      ? `<rect x="${c * CELL + QUIET}" y="${r * CELL + QUIET}" width="${CELL}" height="${CELL}" fill="#1a1a1a"/>`
      : ''
    )
  ).join('');

  container.innerHTML =
    `<svg viewBox="0 0 ${TOTAL} ${TOTAL}" xmlns="http://www.w3.org/2000/svg"
       style="width:170px;height:170px;display:block;border-radius:4px;border:1px solid #eee;">
      <rect width="${TOTAL}" height="${TOTAL}" fill="white"/>
      ${rects}
    </svg>`;
}
