from __future__ import annotations

import json
import os
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Condition, Thread
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen


# server config
ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "4173"))
WIKIRANK_URL = "https://api.wikirank.net/api.php"
WATCH_INTERVAL_SECONDS = 0.5
WATCH_IGNORED_DIRS = {
    ".git",
    ".idea",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",
    ".venv",
    ".vscode",
    "__pycache__",
    "node_modules",
}
LIVE_RELOAD_EVENT_PATH = "/__live-reload/events"
LIVE_RELOAD_SCRIPT_PATH = "/__live-reload/client.js"
LIVE_RELOAD_SNIPPET = f'<script src="{LIVE_RELOAD_SCRIPT_PATH}" defer></script>'
LIVE_RELOAD_CLIENT = f"""
(() => {{
    const events = new EventSource("{LIVE_RELOAD_EVENT_PATH}");
    events.addEventListener("reload", () => {{
        window.location.reload();
    }});
}})();
""".strip()


# live reload state
class LiveReloadState:
    def __init__(self):
        self.version = 0
        self.condition = Condition()

    def notify_changed(self):
        with self.condition:
            self.version += 1
            self.condition.notify_all()

    def wait_for_change(self, last_seen_version):
        with self.condition:
            # timeout sends keep alive
            self.condition.wait_for(lambda: self.version != last_seen_version, timeout=30)
            return self.version


LIVE_RELOAD_STATE = LiveReloadState()


# request handler
class DiscoverWikiHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_OPTIONS(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/wikirank":
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return

        super().do_OPTIONS()

    def do_GET(self):
        parsed = urlparse(self.path)
        # api route stays separate from static files
        if parsed.path == "/api/wikirank":
            self.handle_wikirank(parsed)
            return

        if parsed.path == LIVE_RELOAD_SCRIPT_PATH:
            self.handle_live_reload_client()
            return

        if parsed.path == LIVE_RELOAD_EVENT_PATH:
            self.handle_live_reload_events(parsed)
            return

        if self.maybe_send_html_with_live_reload(parsed):
            return

        super().do_GET()

    # wikirank proxy
    def handle_wikirank(self, parsed):
        params = parse_qs(parsed.query, keep_blank_values=False)
        article_name = (params.get("name") or [""])[0].strip()
        language_code = (params.get("lang") or ["en"])[0].strip() or "en"

        if not article_name:
            self.send_json({"error": "Missing required query parameter: name"}, status=400)
            return

        upstream_query = urlencode({"name": article_name, "lang": language_code})
        # upstream requires a server request
        request = Request(
            f"{WIKIRANK_URL}?{upstream_query}",
            headers={
                "Accept": "application/json",
                "User-Agent": "DiscoverWiki/1.0",
            },
        )

        try:
            with urlopen(request, timeout=15) as response:
                payload = response.read()
                status = response.getcode()
                content_type = response.headers.get("Content-Type", "application/json; charset=utf-8")
        except HTTPError as error:
            payload = error.read() or json.dumps({"error": f"WikiRank returned HTTP {error.code}"}).encode("utf-8")
            status = error.code
            content_type = error.headers.get("Content-Type", "application/json; charset=utf-8") if error.headers else "application/json; charset=utf-8"
        except URLError as error:
            self.send_json(
                {"error": "Failed to reach WikiRank", "details": str(error.reason)},
                status=502,
            )
            return

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "public, max-age=3600")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(payload)

    # reload client
    def handle_live_reload_client(self):
        body = LIVE_RELOAD_CLIENT.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/javascript; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    # reload stream
    def handle_live_reload_events(self, parsed):
        params = parse_qs(parsed.query)
        last_seen_version = int((params.get("version") or [LIVE_RELOAD_STATE.version])[0])

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "keep-alive")
        self.end_headers()

        try:
            while True:
                # block until a save or heartbeat
                next_version = LIVE_RELOAD_STATE.wait_for_change(last_seen_version)
                if next_version == last_seen_version:
                    self.wfile.write(b": keep-alive\n\n")
                else:
                    last_seen_version = next_version
                    self.wfile.write(f"event: reload\ndata: {next_version}\n\n".encode("utf-8"))
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            return

    # html injection
    def maybe_send_html_with_live_reload(self, parsed):
        requested_path = Path(self.translate_path(parsed.path))
        if requested_path.is_dir():
            requested_path = requested_path / "index.html"

        if requested_path.suffix.lower() not in {".html", ".htm"} or not requested_path.is_file():
            return False

        try:
            requested_path.relative_to(ROOT)
        except ValueError:
            self.send_error(404, "File not found")
            return True

        content = requested_path.read_text(encoding="utf-8")
        if LIVE_RELOAD_SNIPPET not in content:
            # inject without editing html files
            if "</body>" in content:
                content = content.replace("</body>", f"    {LIVE_RELOAD_SNIPPET}\n</body>", 1)
            else:
                content = f"{content}\n{LIVE_RELOAD_SNIPPET}\n"

        body = content.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)
        return True

    # json response
    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)


# watch files
def iter_watch_files():
    for current_root, dirnames, filenames in os.walk(ROOT):
        # prune noisy folders in place
        dirnames[:] = [name for name in dirnames if name not in WATCH_IGNORED_DIRS]
        current_path = Path(current_root)
        for filename in filenames:
            path = current_path / filename
            if path.name.startswith("."):
                continue
            yield path


def snapshot_file_mtimes():
    mtimes = {}
    for path in iter_watch_files():
        try:
            # nanoseconds catch quick saves
            mtimes[path] = path.stat().st_mtime_ns
        except OSError:
            continue
    return mtimes


# change loop
def watch_for_file_changes():
    previous_mtimes = snapshot_file_mtimes()

    while True:
        time.sleep(WATCH_INTERVAL_SECONDS)
        current_mtimes = snapshot_file_mtimes()
        if current_mtimes != previous_mtimes:
            # notify all open browsers
            LIVE_RELOAD_STATE.notify_changed()
            previous_mtimes = current_mtimes


# server entry
def main():
    watcher = Thread(target=watch_for_file_changes, daemon=True)
    watcher.start()

    server = ThreadingHTTPServer(("127.0.0.1", PORT), DiscoverWikiHandler)
    print(f"DiscoverWiki server running at http://127.0.0.1:{PORT}")
    print("WikiRank quality requests are proxied through /api/wikirank")
    print("Live reload is enabled for saved repo files")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down DiscoverWiki server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
