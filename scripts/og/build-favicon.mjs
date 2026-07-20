// Build favicons from the pixel-leg [A] brand mark (the same drawMark used for
// OG cards, so the tab icon and the share cards can never drift apart).
//
//   node scripts/og/build-favicon.mjs
//
// Writes into static/: favicon.ico (16+32, PNG-embedded), favicon-16.png,
// favicon-32.png, apple-touch-icon.png (180). favicon.svg is authored by hand
// (scalable, checked in separately) so modern browsers get a crisp vector.
//
// The mark sits on a Deep Blue (#0C447C) tile in dark-mode colors (white
// brackets + A, cyan bit block) so it reads on both light and dark browser
// chrome, and so Apple's auto-rounded touch icon has a filled background.

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { drawMark, palette } from './render.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const STATIC = join(here, '..', '..', 'static');
const C = palette('light'); // { bg:#FFFFFF, bracket:#1668A8, bracketW:6, ... }
const ZOOM = 1.12;         // enlarge the mark within the tile for small-size legibility

function renderTile(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, size, size);
  // Center the 64-unit mark (centered on 32,32) in the tile, zoomed slightly.
  const s = (size * ZOOM) / 64;
  const t = size / 2 - 32 * s;
  drawMark(ctx, C, t, t, size * ZOOM);
  return canvas.toBuffer('image/png');
}

// Minimal PNG-embedded ICO container (supported by all modern browsers).
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // type: icon
  header.writeUInt16LE(pngs.length, 4); // image count
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 == 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2);                      // palette colors
    e.writeUInt8(0, 3);                      // reserved
    e.writeUInt16LE(1, 4);                   // color planes
    e.writeUInt16LE(32, 6);                  // bits per pixel
    e.writeUInt32LE(buf.length, 8);          // image size
    e.writeUInt32LE(offset, 12);             // image offset
    offset += buf.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

mkdirSync(STATIC, { recursive: true });

const png16 = renderTile(16);
const png32 = renderTile(32);
const png180 = renderTile(180);

writeFileSync(join(STATIC, 'favicon-16.png'), png16);
writeFileSync(join(STATIC, 'favicon-32.png'), png32);
writeFileSync(join(STATIC, 'apple-touch-icon.png'), png180);
writeFileSync(join(STATIC, 'favicon.ico'), buildIco([
  { size: 16, buf: png16 },
  { size: 32, buf: png32 },
]));

console.log('favicons written to static/: favicon.ico, favicon-16.png, favicon-32.png, apple-touch-icon.png');
