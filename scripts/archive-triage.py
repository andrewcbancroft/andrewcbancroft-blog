#!/usr/bin/env python3
"""Generate project-docs/archive-triage.md: the Commit 8 archive inventory.

Classifies every published blog post by era, topic status, traffic tier,
and code-block count. Re-run after adding posts or changing front matter:

    python3 scripts/archive-triage.py
"""
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT = ROOT / "content" / "blog"
OUT = ROOT / "project-docs" / "archive-triage.md"

# Traffic tiers come from the GA analysis in CLAUDE.md. Reader pages carry
# newsletter_variant: reader in front matter (Commit 2); whales are pinned
# here by path because the SSIS whale intentionally has no whale capture.
WHALE_PATHS = {
    "musings/make-bash-script-executable.md",
    "data/sql-server/SSIS-flat-file-destination-cannot-open-the-datafile.md",
}


def front_matter(text):
    m = re.match(r"(?s)\A---\n(.*?)\n---\n?", text)
    if not m:
        return {}, text
    fm, body = m.group(1), text[m.end():]
    fields = {}
    for line in fm.splitlines():
        kv = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if kv:
            fields[kv.group(1)] = kv.group(2).strip().strip("'\"")
    return fields, body


def era_for(track, year):
    if track == "ios":
        if year <= 2013: return "pre-Swift (Obj-C)"
        if year == 2014: return "Swift 1"
        if year == 2015: return "Swift 2"
        if year == 2016: return "Swift 3"
        if year == 2017: return "Swift 4"
        if year <= 2019: return "Swift 4.2–5.0"
        if year <= 2022: return "Swift 5.x / SwiftUI 1–3"
        return "Swift 5.9+ / SwiftData"
    if track == "data-azure": return f"{year}-era Azure"
    if track == "dotnet": return f"{year}-era .NET"
    return str(year)


def classify(rel, fields, year):
    if rel.startswith("ios-development/"): track = "ios"
    elif rel.startswith("data/azure/"): track = "data-azure"
    elif rel.startswith("data/"): track = "data"
    elif rel.startswith("dot-net-development/"): track = "dotnet"
    else: track = "general"

    if fields.get("dead_tech") == "true":
        status = "**dead-tech**"
    elif track in ("ios", "dotnet"):
        status = "syntax-shifted" if year < 2021 else "alive"
    elif track == "data-azure":
        status = "fast-aging"
    else:  # slow-aging data topics, musings
        status = "alive"
    return track, status


def code_blocks(body):
    fences = body.count("```") // 2
    pres = len(re.findall(r"<pre\b", body))
    highlights = len(re.findall(r"\{\{<\s*highlight", body))
    return fences + pres + highlights


rows = []
for p in sorted(CONTENT.rglob("*.md")):
    rel = p.relative_to(CONTENT).as_posix()
    if rel.startswith("drafts/"):
        continue
    fields, body = front_matter(p.read_text())
    if fields.get("draft") == "true":
        continue
    ym = re.match(r"(\d{4})-(\d{2})-(\d{2})", fields.get("date", ""))
    year = int(ym.group(1)) if ym else 0
    track, status = classify(rel, fields, year)
    if rel in WHALE_PATHS:
        tier = "**whale**"
    elif fields.get("newsletter_variant") == "reader":
        tier = "reader"
    else:
        tier = "tail"
    rows.append({
        "title": fields.get("title", rel).replace("|", "\\|"),
        "path": rel,
        "year": year or "?",
        "era": era_for(track, year),
        "status": status,
        "tier": tier,
        "code": code_blocks(body),
    })

rows.sort(key=lambda r: (str(r["year"]), r["path"]))

counts = {}
for r in rows:
    counts[r["status"]] = counts.get(r["status"], 0) + 1
tiers = {}
for r in rows:
    tiers[r["tier"]] = tiers.get(r["tier"], 0) + 1

SHORTLIST = """\
## Top-10 re-teach shortlist

Posts that are (a) reader-tier or high-traffic AND (b) materially misleading
today. Each re-teach ships as a **new weekly unit** (Andrew in the loop; see
`archetypes/weekly-unit.md`), and the old post's era banner gains a
`modern_equivalent` link forward once the new post exists. The old posts are
never edited in place.

| # | Post | Why it qualifies | Suggested modern angle |
|---|------|------------------|------------------------|
| 1 | What is Delegation? (2015, reader) | Top-dwell reader page; every sample is Swift 2 syntax | "Delegation in the async/await era: when to delegate, when to hand back a closure, when to await" |
| 2 | How Delegation Works (2015, reader) | Companion reader page, same drift | Build one delegate relationship in modern Swift: protocol, weak reference, and the mistakes Xcode no longer forgives |
| 3 | Strong, Weak, and Unowned (2015, reader) | ARC concepts hold, but examples predate capture lists in closures/Tasks people actually write now | "ARC in the age of Tasks: strong, weak, unowned through closure capture lists" |
| 4 | Sharing a Core Data Model with a Swift Framework (2015, reader) | Workflow is pre-SPM and pre-NSPersistentContainer; following it today misleads | Share a model via a Swift package target (SwiftData and Core Data variants) |
| 5 | Fundamentals of NSNotificationCenter in Swift (2014) | Heavy legacy traffic (the /null-bug page); stringly-typed API replaced by Notification.Name + async sequences | "NotificationCenter today: typed names, async streams, and when NOT to use it" |
| 6 | Implement NSManagedObject Subclass in Swift (2014) | Xcode auto-generates subclasses now; manual steps actively mislead | "Model classes in 2026: what Xcode generates for you, and the SwiftData @Model equivalent" |
| 7 | Getting Started [with] Unit Testing [in] Swift (2015) | Entry-point testing post; Swift Testing (2024) replaced the XCTest idioms shown | Same lesson rebuilt on Swift Testing's #expect / @Test |
| 8 | How to Create Mocks and Stubs in Swift (2014) | High-traffic testing evergreen; protocol-witness/dependency patterns have matured | Mocks and stubs with protocols + dependency injection, modern-concurrency safe |
| 9 | Swift How-To: Setting Up a Table View (2015) | Classic entry page; UIKit table-view boilerplate vs today's SwiftUI List | "The 2026 table view: SwiftUI List first, UITableView when you must" |
| 10 | Local Receipt Validation series (2017, dead-tech, 9 posts) | Biggest dead-tech cluster; StoreKit 2 makes the whole OpenSSL approach obsolete | One unit: "Verify purchases with StoreKit 2 in an afternoon (what 9 posts of OpenSSL became)" |
"""

METHOD = """\
## Method notes

- **Era** is inferred from publish year per track: iOS posts map to Swift
  toolchain eras (2012–13 pre-Swift · 2014 Swift 1 · 2015 Swift 2 · 2016
  Swift 3 · 2017 Swift 4 · 2018–19 Swift 4.2–5.0 · 2020–22 Swift 5.x/SwiftUI
  1–3 · 2023+ Swift 5.9+/SwiftData). Data posts split slow-aging
  (SQL/pandas/concepts: labeled by year, status `alive`) from fast-aging
  (Azure services). The same mapping drives the on-page era banners
  (`layouts/partials/era-label.html`).
- **Topic status**: `alive` (concepts and syntax current, or slow-aging),
  `syntax-shifted` (concepts apply, code samples predate 2021 Swift),
  `dead-tech` (platform/API retired: Parse, U-SQL/ADLA, OpenSSL receipt
  validation, Carthage workflows; flagged via `dead_tech: true` front
  matter, which also triggers the stronger banner variant).
- **Traffic tier** comes from the GA analysis in the project brief: 2
  whales, 9 designated reader pages (tagged `newsletter_variant: reader`
  in Commit 2), everything else tail.
- **Code-block count** = fenced blocks + `<pre>` blocks + highlight
  shortcodes in the markdown source.
- **Compile enrichment was not run.** Most blocks are teaching fragments
  that won't compile in isolation by design, and pre-2016 Swift won't
  compile on any modern toolchain regardless, so pass/fail would restate
  the era column at real cost. Revisit per-post if a re-teach needs it;
  per the brief, a compile failure would be an inventory data point only,
  never a license to auto-fix.
- Drafts (`content/blog/drafts/`) and non-post pages are excluded.
- Hard rule honored: no code inside existing posts was rewritten.
"""

lines = [
    "# Archive triage: full-corpus inventory (Commit 8)",
    "",
    f"Generated by `scripts/archive-triage.py` on {date.today().isoformat()}. Regenerate after front-matter changes.",
    "",
    f"**{len(rows)} published posts.** Status: "
    + " · ".join(f"{v} {k}" for k, v in sorted(counts.items()))
    + ". Tier: " + " · ".join(f"{v} {k}" for k, v in sorted(tiers.items())) + ".",
    "",
    SHORTLIST,
    METHOD,
    "## Inventory",
    "",
    "| Title | Path | Year | Era | Status | Tier | Code blocks |",
    "|---|---|---|---|---|---|---|",
]
for r in rows:
    lines.append(
        f"| {r['title']} | `{r['path']}` | {r['year']} | {r['era']} | {r['status']} | {r['tier']} | {r['code']} |"
    )
OUT.write_text("\n".join(lines) + "\n")
print(f"wrote {OUT} ({len(rows)} posts)")
