#!/usr/bin/env python3
"""Galion console v2 — CPU, GLP, Cloudflare hosts, no frontends, no VRAM."""
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
VERSION = "3.0.0-cpu"

DOMAINS = [
    {"host": "dashboard.galion.studio", "surface": "console", "frontend": False, "zone": "active"},
    {"host": "api.galion.app", "surface": "api", "frontend": False, "zone": "active"},
    {"host": "api.galion.studio", "surface": "api", "frontend": False, "zone": "active"},
    {"host": "api.developer.galion.app", "surface": "api", "frontend": False, "zone": "active"},
    {"host": "status.galion.app", "surface": "status", "frontend": False, "zone": "active"},
    {"host": "docs.galion.studio", "surface": "docs", "frontend": False, "zone": "active"},
    {"host": "galion.studio", "surface": "splash", "frontend": False, "zone": "active"},
    {"host": "galion.app", "surface": "splash", "frontend": False, "zone": "active"},
    {"host": "developer.galion.app", "surface": "splash", "frontend": False, "zone": "active"},
    {"host": "merlinelement.com", "surface": "splash", "frontend": False, "zone": "active"},
    {"host": "sentialink.com", "surface": "splash", "frontend": False, "zone": "active"},
    {"host": "mc.galion.studio", "surface": "held", "frontend": False, "zone": "chill"},
    {"host": "play.galion.studio", "surface": "held", "frontend": False, "zone": "chill"},
    {"host": "ws.galion.app", "surface": "held", "frontend": False, "zone": "chill"},
]

SERVICES = [
    {"id": "console", "name": "Console v2", "zone": "active", "vram": False},
    {"id": "catalog", "name": "Catalog API / GLP", "zone": "active", "vram": False},
    {"id": "status", "name": "Status", "zone": "active", "vram": False},
    {"id": "docs", "name": "API docs (light)", "zone": "active", "vram": False},
    {"id": "cloudflare", "name": "Cloudflare map", "zone": "active", "vram": False},
    {"id": "backend", "name": "galion-backend FastAPI", "zone": "chill", "vram": True},
    {"id": "voice", "name": "Voice / Whisper / TTS", "zone": "chill", "vram": True},
    {"id": "images", "name": "Image gen", "zone": "chill", "vram": True},
    {"id": "agents", "name": "Agents / workforce", "zone": "chill", "vram": True},
    {"id": "frontends", "name": "galion-app / Next sites", "zone": "chill", "vram": False},
]

HELD_PREFIXES = (
    "/api/v3/voice",
    "/api/v1/voice",
    "/api/v5",
    "/api/v3/images",
    "/api/v3/agents",
    "/api/v3/chat",
    "/api/v3/models",
    "/api/v3/video-to-vr",
    "/ws",
    "/voice",
)


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
POD = os.environ.get("RUNPOD_POD_ID", "5zf3tnwexfe021")
PROXY = f"{POD}-8080.proxy.runpod.net"


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
    return {"v": 1, "seq": seq if seq is not None else SEQ, "ts": int(time.time() * 1000), "channel": channel, "type": typ, "data": data}


def health() -> dict:
    return {
        "status": "healthy",
        "service": "galion-console",
        "version": VERSION,
        "mode": "cpu",
        "zeroai": True,
        "models": False,
        "frontends": False,
        "hibernation": False,
        "protocol": "glp",
        "project": 42,
        "pod": POD,
        "proxy": PROXY,
        "ip": IP,
        "ssl": "cloudflare-flexible",
        "uptime": int(time.time() - START),
    }


def cloudflare() -> dict:
    names = ["@", "www", "api", "developer", "status", "docs", "dashboard", "api.developer"]
    studio = ["@", "www", "api", "docs", "dashboard"]
    return {
        "ssl": "flexible",
        "reason": "Origin is HTTP. Full (strict) needs a cert we are not loading.",
        "target": PROXY,
        "type": "CNAME",
        "proxied": True,
        "frontends": False,
        "zones": {
            "galion.app": [{"type": "CNAME", "name": n, "content": PROXY, "proxied": True} for n in names],
            "galion.studio": [{"type": "CNAME", "name": n, "content": PROXY, "proxied": True} for n in studio],
            "merlinelement.com": [
                {"type": "CNAME", "name": "@", "content": PROXY, "proxied": True},
                {"type": "CNAME", "name": "www", "content": PROXY, "proxied": True},
            ],
            "sentialink.com": [
                {"type": "CNAME", "name": "@", "content": PROXY, "proxied": True},
                {"type": "CNAME", "name": "www", "content": PROXY, "proxied": True},
            ],
        },
        "skip": ["ws.galion.app", "mc.galion.studio", "play.galion.studio"],
    }


def held(path: str) -> dict:
    return {
        "ok": False,
        "error": {"code": "held", "message": "VRAM / frontend held in chill. Console v2 is CPU-only.", "path": path},
        "zone": "chill",
    }


HTML = r"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Galion Console v3</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--bg:#08090b;--surf:#111317;--fg:#e8eaee;--mut:#8b919c;--sub:#5c6370;--line:#252830;--ok:#6fbf8a;--hold:#6b8ca8}
*{box-sizing:border-box}html,body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 "IBM Plex Sans",system-ui,sans-serif}
header{display:flex;flex-wrap:wrap;gap:.75rem 1.5rem;align-items:center;justify-content:space-between;padding:1.25rem 1.618rem;border-bottom:1px solid var(--line)}
.k{font:11px/1 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:var(--sub)}
nav{display:flex;flex-wrap:wrap;gap:.25rem}
nav button{min-height:44px;padding:0 .9rem;border:0;background:transparent;color:var(--mut);font:inherit;cursor:pointer;border-radius:8px}
nav button.on{color:var(--fg);background:#181b21}
main{max-width:67.86rem;margin:0 auto;padding:2.5rem 1.618rem 4rem}
h1{font-weight:500;letter-spacing:-.03em;font-size:2rem;margin:.4rem 0 1rem}p{color:var(--mut)}
.grid{display:grid;gap:1rem}@media(min-width:720px){.grid.two{grid-template-columns:1.618fr 1fr}}
.card{background:var(--surf);border:1px solid var(--line);border-radius:20px;padding:1.25rem}
ul.rows{list-style:none;margin:0;padding:0}
ul.rows li{display:flex;justify-content:space-between;gap:1rem;padding:.75rem 0;border-bottom:1px solid var(--line);font-size:.9rem}
ul.rows li:last-child{border:0}
.ok{color:var(--ok)}.hold{color:var(--hold)}
code,pre{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px}
pre{overflow:auto;background:#08090b;border:1px solid var(--line);border-radius:12px;padding:1rem;color:var(--mut);max-height:24rem}
</style>
<body>
<header>
  <div><p class="k">Galion console v3 · ZeroAI · CPU</p><strong>Talk · catalog · no VRAM</strong></div>
  <nav id="nav">
    <button data-view="fleet" class="on">Fleet</button>
    <button data-view="domains">Domains</button>
    <button data-view="cloudflare">Cloudflare</button>
    <button data-view="talk">Talk</button>
    <button data-view="docs">API</button>
    <button data-view="status">Status</button>
  </nav>
</header>
<main id="app">Loading…</main>
<script>
const app = document.querySelector("#app");
let G = {};
const rows = (items, L, R, t) => `<ul class="rows">${items.map(i=>`<li><span>${L(i)}</span><span class="${t?t(i):""}">${R(i)}</span></li>`).join("")}</ul>`;
function go(view){
  location.hash = view;
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on", b.dataset.view===view));
  const h=G.health||{}, sv=(G.services&&G.services.items)||[], dm=(G.domains&&G.domains.items)||[];
  if(view==="domains"){
    app.innerHTML=`<p class="k">Hosts · no Next apps</p><h1>Domains</h1>
      <div class="card">${rows(dm,d=>d.host,d=>d.surface+" · "+d.zone,d=>d.zone==="chill"?"hold":"ok")}</div>`;
    return;
  }
  if(view==="cloudflare"){
    app.innerHTML=`<p class="k">Flexible SSL · CNAME</p><h1>Cloudflare</h1>
      <p>Point light hosts at <code>${(G.cf&&G.cf.target)||""}</code>. Skip ws / mc / play. Frontends off.</p>
      <div class="card"><pre id="cf">…</pre></div>`;
    fetch("/api/v1/cloudflare").then(r=>r.json()).then(j=>document.querySelector("#cf").textContent=JSON.stringify(j,null,2));
    return;
  }
  if(view==="talk"){
    app.innerHTML=`<p class="k">No model</p><h1>Talk</h1>
      <p>ping · health · domains · services · boot · cloudflare · catalog · help</p>
      <div class="card"><form id="talk"><input name="cmd" value="ping" style="width:100%;min-height:44px;background:#08090b;color:#e8eaee;border:1px solid #252830;border-radius:8px;padding:0 12px;font:14px/1 IBM Plex Mono,monospace"><button type="submit" style="margin-top:8px;min-height:44px;padding:0 16px">Send</button></form><pre id="out">…</pre></div>`;
    document.querySelector("#talk").onsubmit=async (e)=>{
      e.preventDefault();
      const cmd=e.target.cmd.value;
      const r=await fetch("/api/v1/command",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({cmd})});
      document.querySelector("#out").textContent=JSON.stringify(await r.json(),null,2);
    };
    return;
  }
  if(view==="docs"){
    app.innerHTML=`<p class="k">GLP + light catalog</p><h1>API</h1>
      <p>Live: <code>/api/v1/*</code>. Held: voice, images, agents, v5, websockets.</p>
      <div class="card"><pre id="spec">…</pre></div>`;
    fetch("/api/v1/protocol").then(r=>r.json()).then(j=>document.querySelector("#spec").textContent=JSON.stringify(j,null,2));
    return;
  }
  if(view==="status"){
    app.innerHTML=`<p class="k">Public</p><h1>Status</h1>
      <div class="card"><p class="ok">Origin v${h.version||"2"} · ${h.uptime||0}s</p>
      ${rows(sv.filter(s=>s.zone==="active"),s=>s.name,()=>"up",()=>"ok")}</div>`;
    return;
  }
  app.innerHTML=`<p class="k">Project 42 · ${h.pod||""}</p><h1>Console v3</h1>
    <p>CPU catalog and domains only. galion-app, Whisper, vLLM stay sealed.</p>
    <div class="grid two">
      <div class="card"><strong>Active</strong>${rows(sv.filter(s=>s.zone==="active"),s=>s.name,()=>"up",()=>"ok")}</div>
      <div class="card"><strong>Fridge</strong>${rows(sv.filter(s=>s.zone==="chill"),s=>s.name,s=>s.vram?"VRAM":"held",()=>"hold")}</div>
    </div>`;
}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>go(b.dataset.view));
window.onhashchange=()=>go(location.hash.slice(1)||"fleet");
Promise.all([
  fetch("/api/v1/protocol/snapshot").then(r=>r.json()),
  fetch("/api/v1/cloudflare").then(r=>r.json())
]).then(([snap, cf])=>{
  const data={}; for(const f of snap.frames) data[f.channel]=f.data; data.cf=cf; G=data; go(location.hash.slice(1)||"fleet");
});
</script>
</body></html>
"""

SPLASH = """<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Galion</title>
<style>body{margin:0;background:#08090b;color:#e8eaee;font:16px/1.5 "IBM Plex Sans",system-ui,sans-serif;padding:4.2rem 1.618rem}p{color:#8b919c}code{font-family:ui-monospace,monospace;color:#c5ccd6}.k{font:11px/1 ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:#5c6370}</style>
<body><p class="k">Galion · CPU origin · frontend held</p><h1>{host}</h1>
<p>This host is on the light origin. The Next.js frontend is not loaded.</p>
<p><code>/api/v1/health</code></p></body></html>
"""


def page_for(host: str, path: str) -> str:
    h = (host or "").split(":")[0].lower()
    if path.startswith("/api/"):
        return ""
    if h.startswith("dashboard.") or path in ("/console", "/"):
        if h.startswith("api."):
            return ""
        if h.startswith("status."):
            return HTML.replace("Loading…", "").join  # noqa: dummy
    if h.startswith("dashboard.") or path.startswith("/console"):
        return HTML
    if h.startswith("status."):
        return HTML
    if h.startswith("docs."):
        return HTML
    if h.startswith("api."):
        return ""
    return SPLASH.replace("{host}", h or "galion")


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

    def command(self, raw: str) -> dict:
        cmd = (raw or "help").strip().lower().split()[0]
        table = {
            "ping": health(),
            "health": health(),
            "domains": {"items": DOMAINS},
            "services": {"items": SERVICES},
            "boot": {"ok": True, "mode": "cpu"},
            "cloudflare": cloudflare(),
            "catalog": {"talk": ["ping", "health", "domains", "services", "boot", "help"]},
            "help": {"talk": ["ping", "health", "domains", "services", "boot", "cloudflare", "catalog", "help"]},
        }
        return {"ok": cmd in table, "cmd": cmd, "data": table.get(cmd, table["help"])}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("access-control-allow-origin", "*")
        self.send_header("access-control-allow-methods", "GET,POST,OPTIONS")
        self.send_header("access-control-allow-headers", "content-type")
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        if any(path.startswith(p) for p in HELD_PREFIXES):
            self.send_json(held(path), 503)
            return
        if path == "/api/v1/boot":
            emit("boot", "console v3")
            self.send_json({"ok": True, "mode": "cpu", "version": VERSION})
            return
        if path == "/api/v1/command":
            length = int(self.headers.get("content-length") or 0)
            raw = self.rfile.read(length).decode() if length else "{}"
            try:
                cmd = json.loads(raw).get("cmd", "help")
            except Exception:
                cmd = "help"
            self.send_json(self.command(cmd))
            return
        if path == "/api/v1/markers":
            emit("event", "marker")
            self.send_json({"ok": True, "seq": SEQ})
            return
        self.send_json({"error": "not found"}, 404)

    def do_GET(self):
        path = urlparse(self.path).path
        host = self.headers.get("Host", "")
        if any(path.startswith(p) for p in HELD_PREFIXES):
            self.send_json(held(path), 503)
            return
        if path in ("/api/v1/health", "/health", "/api/v3/health", "/health/v2"):
            self.send_json(health())
            return
        if path == "/api/v1/domains":
            self.send_json({"count": len(DOMAINS), "items": DOMAINS})
            return
        if path in ("/api/v1/services", "/api/admin/services"):
            self.send_json({"count": len(SERVICES), "items": SERVICES})
            return
        if path == "/api/v1/repos":
            self.send_json(
                {
                    "items": [
                        {"name": "galion-console", "zone": "active"},
                        {"name": "galion-docs", "zone": "active"},
                        {"name": "galion-backend", "zone": "chill"},
                        {"name": "galion-app", "zone": "chill"},
                    ]
                }
            )
            return
        if path == "/api/v1/markers":
            self.send_json({"count": len(MARKERS), "cap": 42, "items": MARKERS})
            return
        if path == "/api/v1/cloudflare":
            self.send_json(cloudflare())
            return
        if path == "/api/v1/protocol":
            self.send_json(
                {
                    "name": "glp",
                    "version": 1,
                    "console": VERSION,
                    "auth": "none",
                    "zeroai": True,
                    "models": False,
                    "frontends": False,
                    "live": [
                        "GET /api/v1/health",
                        "GET /api/v1/domains",
                        "GET /api/v1/services",
                        "GET /api/v1/cloudflare",
                        "GET /api/v1/protocol",
                        "GET /api/admin/services",
                    ],
                    "held": list(HELD_PREFIXES),
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
                        frame("boot", "snapshot", {"ok": True, "mode": "cpu", "version": VERSION}, seq),
                        frame("markers", "snapshot", {"items": MARKERS}, seq),
                    ],
                }
            )
            return
        if path == "/api/v1/docs":
            self.send_json({"openapi": "3.0.3", "info": {"title": "Galion console v3", "version": VERSION}})
            return
        if path == "/api/v1/catalog":
            self.send_json(
                {
                    "version": VERSION,
                    "live": [e["path"] for e in SERVICES if e["zone"] == "active"],
                    "held": list(HELD_PREFIXES),
                    "talk": ["ping", "health", "domains", "services", "boot", "cloudflare", "catalog", "help"],
                }
            )
            return
        if path.startswith("/api/"):
            self.send_json({"error": "not found", "hint": "light catalog is /api/v1/*"}, 404)
            return
        h = host.split(":")[0].lower()
        if h.startswith("api.") and path in ("/", ""):
            self.send_json({"service": "galion-console", "version": VERSION, "docs": "/api/v1/protocol"})
            return
        if h.startswith("dashboard.") or h.startswith("status.") or h.startswith("docs.") or path in ("/", "/console", "/status", "/docs"):
            self.send_html(HTML)
            return
        self.send_html(SPLASH.replace("{host}", h or "galion"))


def serve(port: int) -> None:
    try:
        httpd = ThreadingHTTPServer(("0.0.0.0", port), Handler)
        print("galion-console", VERSION, port, flush=True)
        httpd.serve_forever()
    except OSError as e:
        print("skip", port, e, flush=True)


def main() -> None:
    emit("origin", "console v2 start")
    threading.Thread(target=serve, args=(80,), daemon=True).start()
    threading.Thread(target=serve, args=(8080,), daemon=True).start()
    print("galion-console", VERSION, IP, PROXY, flush=True)
    time.sleep(1e9)


if __name__ == "__main__":
    main()
