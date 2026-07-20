// OG card renderer for andrewcbancroft.com — faithful port of the design
// handoff (design_handoff_og_images/generate-og.mjs + README.md).
//
// This module owns the actual drawing. The CLI (generate-og.mjs) and the
// content walker (build-og.mjs) both call renderCard() so the pixels are
// identical no matter how a card is requested.
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

// --- Fonts ----------------------------------------------------------------
// Register Instrument Sans (brand font, SIL OFL 1.1) from fonts/ next to this
// module. The card uses weights 500 (domain) and 700 (kicker + title); those
// are shipped as static instances (InstrumentSans-Medium/Bold.ttf) because
// @napi-rs/canvas does not select a weight axis from the variable master.
const FAMILY = 'Instrument Sans';
let fontsRegistered = false;
export function registerFonts() {
  if (fontsRegistered) return true;
  const fontDir = join(here, 'fonts');
  if (existsSync(fontDir)) {
    const ttfs = readdirSync(fontDir).filter((f) => /\.(ttf|otf)$/i.test(f));
    ttfs.forEach((f) => GlobalFonts.registerFromPath(join(fontDir, f), FAMILY));
    fontsRegistered = ttfs.length > 0;
  }
  if (!fontsRegistered) {
    // Missing fonts are a build error: the render silently falls back to
    // system fonts and the metrics drift off-brand.
    throw new Error(
      `No Instrument Sans TTFs found in ${fontDir}. Expected the static ` +
        `Medium/Bold instances. Cannot render on-brand OG cards.`
    );
  }
  return fontsRegistered;
}

const FONT = `"${FAMILY}", Arial, sans-serif`;

// --- Layout constants (final, from the handoff) ---------------------------
const W = 1200, H = 630, PAD_X = 80, PAD_Y = 70, MARK = 200, GAP = 56, COL_GAP = 18;
const TITLE_SIZE = 58, TITLE_LH = Math.round(58 * 1.16), TITLE_LS = -1;
const KICK_SIZE = 23, KICK_LS = 3.5;
const COL_W = W - PAD_X * 2 - MARK - GAP;

export function palette(mode) {
  return mode === 'light'
    ? { bg: '#FFFFFF', fg: '#1F2937', accent: '#0891B2', dot: '#0891B2', sub: '#1668A8', bracket: '#1668A8', bracketW: 6 }
    : { bg: '#0C447C', fg: '#FFFFFF', accent: '#9CC4E6', dot: '#9CC4E6', sub: '#FFFFFF', bracket: '#FFFFFF', bracketW: 5.5 };
}

export function drawMark(ctx, C, x, y, size) {
  const s = size / 64;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = C.bracket;
  ctx.lineWidth = C.bracketW;
  ctx.beginPath(); ctx.moveTo(25, 10); ctx.lineTo(7, 32); ctx.lineTo(25, 54); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(39, 10); ctx.lineTo(57, 32); ctx.lineTo(39, 54); ctx.stroke();
  ctx.fillStyle = '#06B6D4';
  ctx.beginPath(); ctx.roundRect(21, 21, 22, 22, 5.5); ctx.fill();
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.4; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(25.8, 40.2); ctx.lineTo(32, 26.7); ctx.lineTo(38.2, 40.2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(23.9, 35.5); ctx.lineTo(36, 34.8); ctx.stroke();
  ctx.restore();
}

function wrap(ctx, text, font, letterSpacing, maxW) {
  ctx.font = font;
  ctx.letterSpacing = `${letterSpacing}px`;
  const words = text.split(/\s+/), lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else { line = t; }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Render one OG card to a PNG buffer.
 * @param {object} opts
 * @param {string} opts.title   Post title (required).
 * @param {string} [opts.kicker] Kicker/eyebrow; empty string hides it.
 * @param {'dark'|'light'} [opts.mode='dark']
 * @returns {Buffer} PNG bytes (1200x630).
 */
export function renderCard({ title, kicker = '', mode = 'dark' } = {}) {
  if (!title) throw new Error('renderCard: title is required');
  registerFonts();
  mode = mode === 'light' ? 'light' : 'dark';
  kicker = (kicker || '').trim();
  const C = palette(mode);

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Measure text block
  const titleFont = `700 ${TITLE_SIZE}px ${FONT}`;
  const lines = wrap(ctx, title, titleFont, TITLE_LS, COL_W);
  const kickerH = kicker ? KICK_SIZE : 0;
  const textH = (kicker ? kickerH + COL_GAP : 0) + lines.length * TITLE_LH;
  const blockH = Math.max(MARK, textH);

  // Domain row: 27px text ≈ 34px tall; row bottom sits at H - PAD_Y
  const domainRowH = 34;
  const areaTop = PAD_Y, areaBottom = H - PAD_Y - domainRowH;
  const blockY = areaTop + (areaBottom - areaTop - blockH) / 2;

  // Mark, vertically centered against the text block
  drawMark(ctx, C, PAD_X, blockY + (blockH - MARK) / 2, MARK);

  // Text column
  const textX = PAD_X + MARK + GAP;
  let y = blockY + (blockH - textH) / 2;
  if (kicker) {
    ctx.font = `700 ${KICK_SIZE}px ${FONT}`; ctx.letterSpacing = `${KICK_LS}px`;
    ctx.fillStyle = C.accent; ctx.textBaseline = 'top';
    ctx.fillText(kicker.toUpperCase(), textX, y + 1);
    y += kickerH + COL_GAP;
  }
  ctx.font = titleFont; ctx.letterSpacing = `${TITLE_LS}px`;
  ctx.fillStyle = C.fg; ctx.textBaseline = 'top';
  for (const line of lines) {
    ctx.fillText(line, textX, y + (TITLE_LH - TITLE_SIZE) / 2);
    y += TITLE_LH;
  }
  ctx.letterSpacing = '0px';

  // Domain row
  const dotY = H - PAD_Y - domainRowH / 2;
  ctx.fillStyle = C.dot;
  ctx.beginPath(); ctx.roundRect(PAD_X, dotY - 7, 14, 14, 4); ctx.fill();
  ctx.font = `500 27px ${FONT}`; ctx.fillStyle = C.sub; ctx.textBaseline = 'middle';
  ctx.fillText('andrewcbancroft.com', PAD_X + 14 + 14, dotY + 1);

  return canvas.toBuffer('image/png');
}

export const CARD = { W, H };
