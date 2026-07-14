#!/usr/bin/env python3
"""Generate <page>/null/ redirect stubs in the built site.

Why: a pre-2019 Jekyll-era search widget emitted relative href="null"
links, so Google's index and old bots still request /<post-path>/null.
GitHub Pages cannot issue server-side redirects, so we publish a tiny
noindex + canonical + meta-refresh stub at every post's /null child
path, pointing back at the clean parent. Google treats an instant meta
refresh as a redirect and drops the /null variants over time.

Run after `hugo` (deploy.sh does this). Idempotent.
"""
import os
import sys

DOCS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
BASE = "https://www.andrewcbancroft.com"

STUB = """<!DOCTYPE html>
<html><head><title>{url}</title>
<link rel="canonical" href="{url}"/>
<meta name="robots" content="noindex">
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="0; url={url}"/>
</head></html>
"""


def main():
    count = 0
    for root, dirs, files in os.walk(DOCS):
        dirs[:] = [d for d in dirs if d != "null"]
        if "index.html" not in files:
            continue
        rel = os.path.relpath(root, DOCS)
        if rel == ".":
            continue
        # only content pages (posts live under dated paths or /blog/, plus
        # top-level alias stubs); skip feeds/tags/assets directories
        parts = rel.split(os.sep)
        if parts[0] in ("tags", "css", "images", "wp-content", "datasets"):
            continue
        url = f"{BASE}/{rel.replace(os.sep, '/')}/"
        null_dir = os.path.join(root, "null")
        os.makedirs(null_dir, exist_ok=True)
        with open(os.path.join(null_dir, "index.html"), "w") as f:
            f.write(STUB.format(url=url))
        count += 1
    print(f"generated {count} /null redirect stubs under {DOCS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
