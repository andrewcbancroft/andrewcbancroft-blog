#!/bin/bash
# Create a new weekly-unit post from the archetype.
# Usage: ./scripts/new-weekly-unit.sh <track: swift|data|ai|other> <slug>
# Example: ./scripts/new-weekly-unit.sh swift what-optionals-actually-are
set -euo pipefail

TRACK="${1:?usage: new-weekly-unit.sh <swift|data|ai|other> <slug>}"
SLUG="${2:?usage: new-weekly-unit.sh <swift|data|ai|other> <slug>}"

case "$TRACK" in
  swift) DIR="blog/ios-development/weekly" ;;
  data)  DIR="blog/data/weekly" ;;
  ai)    DIR="blog/ai/weekly" ;;
  other) DIR="blog/musings/weekly" ;;
  *) echo "unknown track: $TRACK (want swift|data|ai|other)"; exit 1 ;;
esac

hugo new --kind weekly-unit "content/${DIR}/${SLUG}.md"
# stamp the chosen track into the front matter
sed -i '' "s/^topic_track: \"swift\"/topic_track: \"${TRACK}\"/" "content/${DIR}/${SLUG}.md"
echo "created content/${DIR}/${SLUG}.md (topic_track: ${TRACK})"
