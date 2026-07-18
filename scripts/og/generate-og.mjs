#!/usr/bin/env node
// Single-card CLI for andrewcbancroft.com OG images — see design_handoff_og_images/README.md
//
//   node scripts/og/generate-og.mjs --title "A Clear Guide to SwiftUI State Management" \
//     --kicker "Swift & iOS" --slug a-clear-guide-to-swiftui-state-management \
//     --mode dark --out static/og/
//
// Writes static/og/og-<slug>.png. --kicker "" hides the kicker.
// The drawing itself lives in render.mjs (shared with build-og.mjs).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderCard } from './render.mjs';

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    args[argv[i].slice(2)] = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : '';
  }
}

const title = args.title;
if (!title) { console.error('required: --title "Post title"'); process.exit(1); }
const kicker = (args.kicker ?? 'Swift & iOS').trim();
const mode = args.mode === 'light' ? 'light' : 'dark';
const outDir = args.out ?? '.';
const slug =
  args.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'og-card';

const png = renderCard({ title, kicker, mode });
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `og-${slug}.png`);
writeFileSync(outPath, png);
console.log(`wrote ${outPath} (1200x630, ${mode})`);
