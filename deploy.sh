#!/bin/bash

# Generate/refresh build-time OG images (idempotent: only new/changed posts
# render; orphans are pruned). Must run before hugo so the cards exist in
# static/og/ when templates emit their og:image tags.
node scripts/og/build-og.mjs

# Favicons from the same brand mark (deterministic output, so no churn unless
# the mark changes). Keeps the tab icon in sync with the OG cards.
node scripts/og/build-favicon.mjs

hugo

python3 scripts/generate-null-redirect-stubs.py

git add .

git commit -m "Updates"

git push