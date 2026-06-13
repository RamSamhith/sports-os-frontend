## SportsOS Data Acquisition (Academy + Coach) — TODO

### Step 1 — Schema updates (non-breaking)
- [ ] Add fields to `sportsOS-nodejs/models/Academy.js`
  - sourceUrl, sourceType, confidenceScore, lastUpdated
  - optional: rawExtraction, extractionNotes
- [ ] Add fields to `sportsOS-nodejs/models/Coach.js`
  - sourceUrl, sourceType, confidenceScore, lastUpdated
  - optional: rawExtraction, extractionNotes

### Step 2 — Dependencies
- [ ] Add `firecrawl-js` and `@google/generative-ai` to `sportsOS-nodejs/package.json`
- [ ] Update `sportsOS-nodejs/package-lock.json`

### Step 3 — New utilities
- [ ] Create `sportsOS-nodejs/utils/slug.js`
- [ ] Create `sportsOS-nodejs/utils/firecrawl.js`
- [ ] Create `sportsOS-nodejs/utils/gemini.js`

### Step 4 — Acquisition scripts
- [ ] Create `sportsOS-nodejs/seeds/acquireAcademiesAndCoaches.js`
  - Supports `MAX_ACADEMIES`
  - Supports `DRY_RUN=true`
  - Uses upsert only; never delete/clear/drop
  - Preserves existing data / avoids overwriting with lower confidence
  - Logs: found/updated/skipped/extraction failed (no API keys)

- [ ] (Optional) Create `sportsOS-nodejs/seeds/validateAcquisitionRun.js`
  - Dry-run validation stats

### Step 5 — Run validation
- [ ] Add/verify `.env` values
  - MONGO_URI, GEMINI_API_KEY, FIRECRAWL_API_KEY
- [ ] Run initial validation: `MAX_ACADEMIES=20 DRY_RUN=true node seeds/acquireAcademiesAndCoaches.js`
- [ ] Run first write: `MAX_ACADEMIES=20 DRY_RUN=false node seeds/acquireAcademiesAndCoaches.js`
