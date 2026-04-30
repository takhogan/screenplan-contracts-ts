#!/usr/bin/env bash
# Refresh the @screenplan/contracts-schemas dep from github, regenerate types,
# build + test, then commit + push any changes.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
cd "$HERE"

npm install --no-audit --no-fund --prefer-online @screenplan/contracts-schemas
npm test  # runs prebuild (codegen) → tsc → validate

git add -A
if git diff --cached --quiet; then
  echo "[ts] no changes to commit"
else
  git commit -m "npm run deploy commit $(date '+%Y-%m-%d %H:%M:%S')"
fi
git push origin main
