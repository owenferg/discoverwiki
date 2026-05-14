from __future__ import annotations

import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import Request, urlopen


# server config
ROOT = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "4173"))
WIKIRANK_URL = "https://api.wikirank.net/api.php"


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
                "User-Agent": "discoverWiki/1.0",
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

    # json response
    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

# server entry
def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), DiscoverWikiHandler)
    print(f"discoverWiki server running at http://127.0.0.1:{PORT}")
    print("WikiRank quality requests are proxied through /api/wikirank")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down discoverWiki server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
