# DiscoverWiki

This is a location-based Wikipedia discovery prototype with unlockable nearby articles, a persistent collection, and WikiRank-powered quality scores.

## Run

Run the local proxy server:

```bash
python server.py
```

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

## Notes

- The app tries to use your current location and falls back to New York if location access is unavailable.
- WikiRank blocks direct browser CORS requests, so article quality is fetched through `server.py` at `/api/wikirank`.
- The Mapbox token is currently embedded directly in `app.js` for the prototype.