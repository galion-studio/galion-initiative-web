#!/bin/bash
# Flash Galion light origin + original Cloudflare tunnels onto this pod.
# DNS is not changed. Tokens are the ones already in nexuslang-v2 docker-compose.cloudflare.yml.
set -euo pipefail
ROOT=/workspace/galion-light
mkdir -p "$ROOT"
curl -fsSL https://raw.githubusercontent.com/galion-studio/galion-initiative-web/cpu-light/galion-light/origin.py -o "$ROOT/origin.py"

pkill -9 -f /workspace/galion-light/origin.py 2>/dev/null || true
pkill -9 -f "python3 .*origin.py" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
for p in 8080 3000 3100 3200 4000 8000 8100 8200; do
  fuser -k ${p}/tcp 2>/dev/null || true
done
sleep 2

nohup python3 "$ROOT/origin.py" >/tmp/galion-light.log 2>&1 &
sleep 1

if [ ! -x /usr/local/bin/cloudflared ]; then
  curl -fsSL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
  chmod +x /usr/local/bin/cloudflared
fi

# Original galion.studio tunnel (zone 2ff5c10a…)
STUDIO='eyJ6b25lSUQiOiIyZmY1YzEwYTExZDhhOTUyNzZkMGI4NGFhZjUzZGYxYiIsImFjY291bnRJRCI6IjU3MTNmNGZjZGUxOGJkNDhhNDU2YWZiYjFiODE1NWVkIiwic2VydmljZUtleSI6InYxLjAtNTZlNDFlMzA1ZDRjYWZlYjQ4MDQ0YmExLWU3OTNiMDhmZDQ2N2VkMWUyYzkzODM1NWJiMjk0ZTg0YWI3YWIzZDRmYWYwZGI1NGNlMGVhZTg0MmNjMTM1OTY3MTg3ZTUzZDRhYzEzMWUyYWEzMjBkYTdlYzFiYjlkZGVkMzEzNjBiZDc5ZmQ2NjUyOTMyN2FkYzUxZWI4MGZlNmUzZDcxZTc4YmVhN2Q4YmU4OWY4OGYyZmExOWUxMWIiLCJhcGlUb2tlbiI6IndrazRIdEVrbG5naG4zNlZxQzdmcmVVMERPeTVZRUJpdmxlZnoxR08ifQ=='
# Original galion.app tunnel (zone 022651c7…)
APP='eyJ6b25lSUQiOiIwMjI2NTFjN2RmZGVhNDhlMzc2YzQ4NzlmZmVkOTA0YiIsImFjY291bnRJRCI6IjU3MTNmNGZjZGUxOGJkNDhhNDU2YWZiYjFiODE1NWVkIiwic2VydmljZUtleSI6InYxLjAtNGU0MmU1MDA1MDgxYjZjMmI4ZjVmN2Q5LTc3ZTZmMmRkMWVjNDJiYmM2ZDkxMWRhZjdhMzBiZWRkYzIzYWRiZGIwYjFlMzA3N2ZmMTc2MTNiZGFhM2I3MDdmNGRmY2IzMjVmNjBlZGNhOTcxYTUzOTIzYTJlM2U2MzIzZDNjYmQzNzk4NzkxYWE4NTc5ZTdiZGViZGFhYjY4MTE2ZmNkYzk3Y2U1YzU2MzMzNDMxYTQwOWNhM2Y5NGUiLCJhcGlUb2tlbiI6Ikt1Z2RBYVRXZ2tncTFnVmVpenh3OFgyZ2ZHU19QOTNkcWhvUTVieHoifQ=='

nohup /usr/local/bin/cloudflared tunnel --no-autoupdate run --token "$STUDIO" >/tmp/cf-studio.log 2>&1 &
nohup /usr/local/bin/cloudflared tunnel --no-autoupdate run --token "$APP" >/tmp/cf-app.log 2>&1 &
sleep 3
echo "=== origin ==="
curl -sS http://127.0.0.1:8080/api/v1/health || curl -sS http://127.0.0.1:3200/api/v1/health || true
echo
echo "=== listening ==="
ss -lptn | grep -E ':(80|8080|3100|3200|8100|8200)\b' || netstat -lptn 2>/dev/null | grep -E ':(80|8080|3100|3200)' || true
echo "=== cloudflared ==="
pgrep -a cloudflared || true
tail -8 /tmp/cf-studio.log /tmp/cf-app.log 2>/dev/null || true
echo "flash ok"
