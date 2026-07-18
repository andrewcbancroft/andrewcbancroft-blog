#!/usr/bin/env node
// Build-time OG image walker for andrewcbancroft.com (Hugo).
// See design_handoff_og_images/README.md for the design + integration spec.
//
// Scans content/blog/**/*.md, derives {title, kicker, slug, mode} from front
// matter, and renders static/og/og-<slug>.png for each post.
//
//   node scripts/og/build-og.mjs           # idempotent: only (re)builds changed/new/missing
//   node scripts/og/build-og.mjs --force   # full refresh: rebuild every card
//
// Idempotency: a manifest (static/og/.og-manifest.json) records a content hash
// per slug. A card is rebuilt when its hash changes, its PNG is missing, or the
// render version bumps. Orphaned og-*.png files (post deleted/renamed) are
// pruned so the output directory always mirrors the current content set.
//
// The `slug` is the post's filename base, which equals both the final segment
// of every post URL and Hugo's `.File.ContentBaseName` — so the head-meta
// template can predict the image path without any extra front matter.
import {
  readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync, unlinkSync,
} from 'node:fs';
import { join, dirname, basename, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import matter from 'gray-matter';
import { renderCard } from './render.mjs';

// Bump when the design/draw code changes so `build-og.mjs` (no --force)
// rebuilds every card on the next run.
const RENDER_VERSION = 1;

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');
const contentRoot = join(repoRoot, 'content', 'blog');
const outDir = join(repoRoot, 'static', 'og');
const manifestPath = join(outDir, '.og-manifest.json');

const FORCE = process.argv.includes('--force');

// Section (top-level dir under content/blog) → kicker. Falls back to a
// title-cased section name for anything unmapped.
const KICKER_BY_SECTION = {
  'ios-development': 'Swift & iOS',
  'data': 'Data',
  'dot-net-development': '.NET',
  'musings': 'Musings',
  'LAMP-stack': 'Web Dev',
};

function titleCaseSection(s) {
  return s.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// Recursively collect *.md files, skipping section/bundle index files.
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && entry.name.endsWith('.md') &&
             entry.name !== '_index.md' && entry.name !== 'index.md') {
      out.push(p);
    }
  }
  return out;
}

function sectionOf(filePath) {
  const rel = relative(contentRoot, filePath);
  const parts = rel.split(sep);
  return parts.length > 1 ? parts[0] : '';
}

function hashOf({ title, kicker, mode }) {
  return createHash('sha256')
    .update(JSON.stringify({ title, kicker, mode, v: RENDER_VERSION }))
    .digest('hex')
    .slice(0, 16);
}

function loadManifest() {
  if (!FORCE && existsSync(manifestPath)) {
    try { return JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { /* rebuild all */ }
  }
  return {};
}

// --- Main -----------------------------------------------------------------
mkdirSync(outDir, { recursive: true });
const manifest = loadManifest();
const nextManifest = {};

const files = walk(contentRoot);
let built = 0, skipped = 0, dropped = 0;
const seenSlugs = new Map();

for (const file of files) {
  let fm;
  try {
    fm = matter(readFileSync(file, 'utf8')).data;
  } catch (e) {
    console.warn(`skip (front matter parse failed): ${relative(repoRoot, file)} — ${e.message}`);
    dropped++;
    continue;
  }

  const title = typeof fm.title === 'string' ? fm.title.trim() : '';
  if (!title) { dropped++; continue; }            // untitled stubs (all drafts)
  if (fm.draft === true) { dropped++; continue; } // unpublished

  const slug = basename(file, '.md');
  if (seenSlugs.has(slug)) {
    // Filename bases are unique across the corpus today; guard the invariant
    // rather than silently overwrite one card with another.
    console.warn(`WARN duplicate slug "${slug}": ${relative(repoRoot, file)} vs ${relative(repoRoot, seenSlugs.get(slug))}`);
  }
  seenSlugs.set(slug, file);

  const section = sectionOf(file);
  const kicker = typeof fm.ogKicker === 'string'
    ? fm.ogKicker.trim()
    : (KICKER_BY_SECTION[section] ?? (section ? titleCaseSection(section) : ''));
  const mode = fm.ogMode === 'light' ? 'light' : 'dark';

  const spec = { title, kicker, mode };
  const hash = hashOf(spec);
  const outPath = join(outDir, `og-${slug}.png`);
  nextManifest[slug] = hash;

  if (!FORCE && manifest[slug] === hash && existsSync(outPath)) {
    skipped++;
    continue;
  }

  try {
    writeFileSync(outPath, renderCard(spec));
    built++;
  } catch (e) {
    console.error(`ERROR rendering ${slug}: ${e.message}`);
    process.exitCode = 1;
  }
}

// Prune orphaned cards: og-*.png in static/og with no corresponding post.
for (const name of readdirSync(outDir)) {
  const m = /^og-(.+)\.png$/.exec(name);
  if (m && !seenSlugs.has(m[1])) {
    unlinkSync(join(outDir, name));
    dropped++;
  }
}

writeFileSync(manifestPath, JSON.stringify(nextManifest, null, 2) + '\n');

console.log(
  `OG images: ${built} built, ${skipped} unchanged, ${dropped} skipped/pruned ` +
  `(${seenSlugs.size} posts, ${FORCE ? 'full refresh' : 'incremental'}).`
);
