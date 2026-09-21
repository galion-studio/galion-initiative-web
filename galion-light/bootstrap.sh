#!/bin/bash
# Clone light Galion repos onto the volume. Fridge stays closed.
set -euo pipefail
ROOT=/workspace/galion-src
mkdir -p "$ROOT" /workspace/galion-light
cd "$ROOT"
clone_light() {
  local repo="$1"
  if [ -d "$repo/.git" ]; then
    git -C "$repo" fetch --depth 1 && git -C "$repo" reset --hard origin/HEAD || true
  else
    git clone --depth 1 "git@github.com:galion-studio/${repo}.git" "$repo" || \
      git clone --depth 1 "https://github.com/galion-studio/${repo}.git" "$repo" || true
  fi
}
clone_light galion-console
clone_light galion-api-docs
clone_light galion-docs
clone_light galion-universal-downloader
# Fridge (listed, not started): galion-backend galion-app nexuslang
pkill -f /workspace/galion-light/origin.py 2>/dev/null || true
nohup python3 /workspace/galion-light/origin.py >/tmp/galion-light.log 2>&1 &
sleep 1
cat /tmp/galion-light.log
curl -sS http://127.0.0.1:8080/api/v1/health || true
echo
echo "console on :80 and :8080"
