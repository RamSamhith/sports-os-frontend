# Dry Run Simulation Report

**Date:** June 12, 2026  
**Configuration:** `DRY_RUN=true MAX_ACADEMIES=20`

---

## Pipeline Flow

```
State 1: Andhra Pradesh (only state processed)
  ├── Gemini Search: 3 cities × ~8 academies = ~24 raw
  ├── Overpass API: ~40 raw
  ├── Combined: ~64 raw
  ├── After dedup: ~50 unique
  ├── Limit: min(50, 20) = 20 processed
  └── academiesProcessed: 20 → STOP

State 2-5: SKIPPED (limit reached)
```

---

## Expected Counts

| Metric | Count | Notes |
|--------|-------|-------|
| **Discovered** | 18 | Academies reaching upsertAcademy |
| **Verified** | 0 | Never incremented (legacy stat) |
| **Inserted** | 0 | DRY_RUN prevents DB writes |
| **Updated** | 0 | DRY_RUN prevents DB writes |
| **Skipped** | 2 | Missing name or city after processing |
| **Duplicates** | 0 | Fresh database, no pre-existing records |
| **Failed** | 0-1 | Uncaught exceptions |

**Total processed:** 20 academies enter processing  
**Total output:** 18 discovered, 2 skipped

---

## API Call Budget (DRY_RUN=true)

Even in dry run, external API calls are made:

| Service | Calls | Notes |
|---------|-------|-------|
| Gemini search | 3 | 1 per city in AP |
| Gemini enrichment | ~19 | 1 per academy |
| Gemini normalization | 20 | 1 per academy |
| Firecrawl extract | ~7 | ~35% have websites |
| Firecrawl search | ~3 | Fallback for Gemini-only |
| Overpass | 1 | 1 per state |
| MongoDB reads | ~18 | findDuplicate per academy |
| MongoDB writes | 0 | DRY_RUN |
| **Total external** | **~53** | |

---

## Per-Academy Processing

| Step | Count | Notes |
|------|-------|-------|
| Enter processAcademy | 20 | After dedup |
| Firecrawl URL extraction attempted | ~7 | ~35% have websites |
| Firecrawl URL extraction succeeded | ~5 | 70% success rate |
| Firecrawl fallback search | ~3 | Gemini-only sources |
| Gemini enrichment calls | ~19 | All but ~1 |
| Gemini normalization calls | 20 | All academies |
| Validation passed | ~18 | |
| Validation skipped | ~2 | Missing name/city |
| Reached upsertAcademy | ~18 | In dry run |

---

## Timing Estimate

| Step | Time | Notes |
|------|------|-------|
| Gemini search (3 cities) | ~6s | 2s per city + 500ms sleep |
| Overpass query | ~3s | Single query |
| Per academy (×20) | ~60s | ~3s avg per academy |
| **Total** | **~70s** | For 20 academies |

---

## Bottlenecks

| Bottleneck | Impact | Mitigation |
|------------|--------|------------|
| Sequential API calls | 3s per academy | Add concurrency |
| No retry logic | Transient failures permanent | Add retry with backoff |
| Overpass rate limiting | 429 errors | Add delay between states |
| Gemini quota | Cascading failures | Monitor usage |

---

## Failure Points

| Point | Probability | Impact |
|-------|-------------|--------|
| Gemini API timeout | Medium | Academy skipped |
| Firecrawl extraction fail | Medium | No website data |
| Overpass timeout | Low | No OSM data |
| MongoDB connection fail | Low | Pipeline abort |
| API key expired | Low | All calls fail |

---

## Data Quality Estimate

| Field | Expected Coverage |
|-------|-------------------|
| Name | 100% |
| City | 100% |
| State | 100% |
| Sports | 80-90% |
| Description | 60-70% |
| Phone | 50-60% |
| Email | 40-50% |
| Website | 50-60% |
| Coordinates | 60-70% |
| Facilities | 30-40% |
| Training Levels | 20-30% |

---

## Recommendation

**Run with `DRY_RUN=true` first to validate API connectivity and data quality before enabling database writes.**
