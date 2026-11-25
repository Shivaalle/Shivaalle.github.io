#!/usr/bin/env bash
# Regenerates public/Shiva-Teja-Alle-Resume.pdf from the HTML source using headless Chrome.
set -euo pipefail

cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="public/Shiva-Teja-Alle-Resume.pdf"
SRC="file://$PWD/resume/Shiva-Teja-Alle-Resume.html"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --user-data-dir="${TMPDIR:-/tmp}/chrome-resume-profile" \
  --virtual-time-budget=3000 \
  --print-to-pdf="$OUT" \
  "$SRC"

echo "Wrote $OUT"
