#!/usr/bin/env python3
"""Galion CPU console — GLP v1. No models. No hibernation."""
from __future__ import annotations

import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

START = time.time()
SEQ = 41
MARKERS: list[dict] = []

DOMAINS = [
    {"host": "galion.studio", "brand": "Studio", "role": "Primary studio surface", "zone": "active"},
    {"host": "galion.app", "brand": "App", "role": "Workplace surface", "zone": "active"},
    {"host": "developer.galion.app", "brand": "NexusLang", "role": "Developer console", "zone": "active"},
    {"host": "dashboard.galion.studio", "brand": "Ops", "role": "Operator console", "zone": "active"},
    {"host": "docs.galion.studio", "brand": "Studio", "role": "Documentation", "zone": "active"},
    {"host": "status.galion.app", "brand": "Ops", "role": "Public status", "zone": "active"},
    {"host": "api.galion.app", "brand": "App", "role": "Catalog API", "zone": "active"},
    {"host": "api.galion.studio", "brand": "Studio", "role": "Studio catalog", "zone": "active"},
    {"host": "merlinelement.com", "brand": "Merlin Element", "role": "Design brand", "zone": "active"},
    {"host": "mc.galion.studio", "brand": "Play", "role": "Game presence (held)", "zone": "chill"},
    {"host": "play.galion.studio", "brand": "Play", "role": "Play portal (held)", "zone": "chill"},
    {"host": "sentialink.com", "brand": "SentiaLink", "role": "Splash", "zone": "active"},
    {"host": "api.developer.galion.app", "brand": "NexusLang", "role": "Developer API", "zone": "active"},
]

SERVICES = [
    {"id": "console", "name": "Galion console", "weight": "light", "port": 8080, "zone": "active", "on": True},
    {"id": "catalog", "name": "Catalog API", "weight": "light", "port": 8080, "zone": "active", "on": True},
    {"id": "status", "name": "Status", "weight": "light", "port": 8080, "zone": "active", "on": True},
    {"id": "docs", "name": "API docs / GLP", "weight": "light", "port": 8080, "zone": "active", "on": True},
    {"id": "backend", "name": "galion-backend", "weight": "heavy", "port": 8000, "zone": "chill", "on": False},
    {"id": "voice", "name": "Voice pipeline", "weight": "heavy", "port": 0, "zone": "chill", "on": False},
    {"id": "workforce", "name": "Workforce", "weight": "heavy", "port": 0, "zone": "chill", "on": False},
    {"id": "guardian", "name": "Guardian", "weight": "heavy", "port": 0, "zone": "chill", "on": False},
]

REPOS = [
    {"name": "galion-console", "visibility": "private", "zone": "active"},
    {"name": "galion-api-docs", "visibility": "private", "zone": "active"},
    {"name": "galion-docs", "visibility": "private", "zone": "active"},
    {"name": "galion-backend", "visibility": "private", "zone": "chill"},
    {"name": "galion-app", "visibility": "private", "zone": "chill"},
    {"name": "nexuslang-v2", "visibility": "public", "zone": "chill"},
]


def public_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("1.1.1.1", 80))
        return s.getsockname()[0]
    except Exception:
        return "0.0.0.0"
    finally:
        s.close()


IP = public_ip()
POD = os.environ.get("RUNPOD_POD_ID", "runpod")


def emit(kind: str, note: str, zone: str = "active") -> dict:
    global SEQ
    SEQ += 1
    m = {"seq": SEQ, "t": int(time.time() * 1000), "kind": kind, "note": note, "zone": zone, "source": "origin"}
    if kind != "heartbeat":
        MARKERS.append(m)
        if len(MARKERS) > 42:
            MARKERS.pop(0)
    return m


def frame(channel: str, typ: str, data, seq: int | None = None) -> dict:
    return {
        "v": 1,
        "seq": seq if seq is not None else SEQ,
        "ts": int(time.time() * 1000),
        "channel": channel,
        "type": typ,
        "data": data,
    }


def health() -> dict:
    return {
        "status": "healthy",
        "service": "galion-console",
        "mode": "cpu",
        "zeroai": True,
        "models": False,
        "hibernation": False,
        "protocol": "glp",
        "version": 1,
        "project": 42,
        "pod": POD,
        "ip": IP,
        "uptime": int(time.time() - START),
    }


HTML = r"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Galion Console</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{--bg:#08090b;--surf:#111317;--fg:#e8eaee;--mut:#8b919c;--sub:#5c6370;--line:#252830;--ok:#6fbf8a;--hold:#6b8ca8}
  *{box-sizing:border-box}
  html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 "IBM Plex Sans",system-ui,sans-serif}
  a{color:inherit;text-decoration:none}
  header{display:flex;flex-wrap:wrap;gap:.75rem 1.5rem;align-items:center;justify-content:space-between;padding:1.25rem 1.618rem;border-bottom:1px solid var(--line)}
  .k{font:11px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--sub)}
  nav{display:flex;flex-wrap:wrap;gap:.25rem}
  nav button{min-height:44px;padding:0 .9rem;border:0;background:transparent;color:var(--mut);font:inherit;cursor:pointer;border-radius:8px}
  nav button.on{color:var(--fg);background:#181b21}
  main{max-width:67.86rem;margin:0 auto;padding:2.5rem 1.618rem 4rem}
  h1{font-weight:500;letter-spacing:-.03em;font-size:2rem;margin:.4rem 0 1rem}
  p{color:var(--mut)}
  .grid{display:grid;gap:1rem}
  @media(min-width:720px){.grid.two{grid-template-columns:1.618fr 1fr}}
  .card{background:var(--surf);border:1px solid var(--line);border-radius:20px;padding:1.25rem}
  ul.rows{list-style:none;margin:0;padding:0}
  ul.rows li{display:flex;justify-content:space-between;gap:1rem;padding:.75rem 0;border-bottom:1px solid var(--line);font-size:.9rem}
  ul.rows li:last-child{border:0}
  .ok{color:var(--ok)} .hold{color:var(--hold)}
  code,pre{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px}
  pre{overflow:auto;background:#08090b;border:1px solid var(--line);border-radius:12px;padding:1rem;color:var(--mut)}
  .dot{width:8px;height:8px;border-radius:99px;background:var(--ok);display:inline-block;margin-right:.5rem}
</style>
<body>
<header>
  <div>
    <p class="k">Galion · ZeroAI · CPU · GLP v1</p>
    <strong>Console</strong>
  </div>
  <nav id="nav">
    <button data-view="fleet" class="on">Fleet</button>
    <button data-view="domains">Domains</button>
    <button data-view="docs">Docs</button>
    <button data-view="status">Status</button>
  </nav>
</header>
<main id="app">Loading…</main>
<script>
const $ = (s) => document.querySelector(s);
const app = $("#app");
let snap = null;
async function load(){
  const r = await fetch("/api/v1/protocol/snapshot");
  snap = await r.json();
  const data = {};
  for (const f of snap.frames) data[f.channel] = f.data;
  window.__g = data;
  render(location.hash.slice(1) || "fleet");
}
function go(view){
  location.hash = view;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.view===view));
  render(view);
}
document.querySelectorAll("nav button").forEach(b => b.onclick = () => go(b.dataset.view));
function rows(items, left, right, tone){
  return `<ul class="rows">${items.map(i => `<li><span>${left(i)}</span><span class="${tone?tone(i):""}">${right(i)}</span></li>`).join("")}</ul>`;
}
function render(view){
  const g = window.__g || {};
  const h = g.health || {};
  const sv = (g.services&&g.services.items)||[];
  const dm = (g.domains&&g.domains.items)||[];
  if(view==="domains"){
    app.innerHTML = `<p class="k">Thirteen hosts</p><h1>Domains</h1>
      <div class="card">${rows(dm, d=>d.host, d=>d.zone, d=>d.zone==="chill"?"hold":"ok")}</div>`;
    return;
  }
  if(view==="docs"){
    app.innerHTML = `<p class="k">Galion Light Protocol</p><h1>Docs</h1>
      <p>Envelope <code>{ v, seq, ts, channel, type, data }</code>. Auth none. Models off.</p>
      <div class="card"><pre id="spec">…</pre></div>`;
    fetch("/api/v1/protocol").then(r=>r.json()).then(j=>$("#spec").textContent=JSON.stringify(j,null,2));
    return;
  }
  if(view==="status"){
    app.innerHTML = `<p class="k">Public</p><h1>Status</h1>
      <div class="card"><p><span class="dot"></span>Origin healthy · ${h.uptime||0}s · ${h.pod||""}</p>
      ${rows(sv.filter(s=>s.zone==="active"), s=>s.name, s=>s.zone, ()=>"ok")}</div>`;
    return;
  }
  app.innerHTML = `<p class="k">Project 42 · ${h.pod||""}</p>
    <h1>Galion console</h1>
    <p>CPU only. No models. Hibernation not loaded. Origin on :80 and :8080.</p>
    <div class="grid two">
      <div class="card"><strong>Active</strong>${rows(sv.filter(s=>s.zone==="active"), s=>s.name, s=>"up", ()=>"ok")}</div>
      <div class="card"><strong>Fridge</strong>${rows(sv.filter(s=>s.zone==="chill"), s=>s.name, s=>"held", ()=>"hold")}</div>
    </div>`;
}
window.onhashchange = () => go(location.hash.slice(1) || "fleet");
load();
</script>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        return

    def send_json(self, obj, code=200):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("content-type", "application/json")
        self.send_header("access-control-allow-origin", "*")
        self.send_header("cache-control", "no-store")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, html: str):
        body = html.encode()
        self.send_response(200)
        self.send_header("content-type", "text/html; charset=utf-8")
        self.send_header("content-length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-methods", "GET,POST,OPTIONS")
        self.send_header("access-control-allow-headers", "content-type")
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        if path == "/api/v1/boot":
            emit("boot", "active zone opened")
            self.send_json({"ok": True, "mode": "cpu", "zone": "active"})
            return
        if path == "/api/v1/markers":
            emit("event", "marker")
            self.send_json({"ok": True, "seq": SEQ})
            return
        self.send_json({"error": "not found"}, 404)

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/api/v1/health", "/health"):
            self.send_json(health())
            return
        if path == "/api/v1/domains":
            self.send_json({"count": len(DOMAINS), "items": DOMAINS})
            return
        if path == "/api/v1/services":
            self.send_json({"count": len(SERVICES), "items": SERVICES})
            return
        if path == "/api/v1/repos":
            self.send_json({"count": len(REPOS), "items": REPOS})
            return
        if path == "/api/v1/markers":
            self.send_json({"count": len(MARKERS), "cap": 42, "items": MARKERS})
            return
        if path == "/api/v1/protocol":
            self.send_json(
                {
                    "name": "glp",
                    "version": 1,
                    "auth": "none",
                    "zeroai": True,
                    "models": False,
                    "channels": {
                        "light": ["health", "services", "domains", "boot", "markers"],
                        "held": ["guardian", "workforce", "neural", "voice"],
                    },
                }
            )
            return
        if path == "/api/v1/protocol/snapshot":
            seq = SEQ
            self.send_json(
                {
                    "v": 1,
                    "ts": int(time.time() * 1000),
                    "frames": [
                        frame("health", "snapshot", health(), seq),
                        frame("services", "snapshot", {"items": SERVICES}, seq),
                        frame("domains", "snapshot", {"items": DOMAINS}, seq),
                        frame("boot", "snapshot", {"ok": True, "mode": "cpu"}, seq),
                        frame("markers", "snapshot", {"items": MARKERS}, seq),
                    ],
                }
            )
            return
        if path == "/api/v1/docs":
            self.send_json({"openapi": "3.0.3", "info": {"title": "Galion console", "version": "cpu"}})
            return
        self.send_html(HTML)


def serve(port: int) -> None:
    try:
        httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
        print("galion-console", port, flush=True)
        httpd.serve_forever()
    except OSError as e:
        print("skip", port, e, flush=True)


def main() -> None:
    emit("origin", "cpu console start")
    threading.Thread(target=serve, args=(80,), daemon=True).start()
    threading.Thread(target=serve, args=(8080,), daemon=True).start()
    print("galion-console", IP, "cpu", "glp", flush=True)
    time.sleep(1e9)


if __name__ == "__main__":
    main()
