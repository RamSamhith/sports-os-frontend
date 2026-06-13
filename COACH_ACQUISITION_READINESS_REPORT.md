# Coach Acquisition Readiness Report

**Date:** June 12, 2026  
**Scope:** Coach discovery, extraction, and ingestion pipeline  
**Status:** NOT READY — requires implementation

---

## Executive Summary

| Component | Status |
|-----------|--------|
| **Academy Discovery** | ✅ READY |
| **Coach Discovery** | ❌ NOT IMPLEMENTED |
| **Coach Extraction** | ⚠️ PARTIAL (Gemini only) |
| **Coach Ingestion** | ✅ READY (`upsertCoach()`) |
| **Pipeline Integration** | ❌ NOT IMPLEMENTED |
| **Overall Readiness** | **NOT READY** |

---

## What Exists

### ✅ Coach Ingestion (`ingest.js:119-213`)
- `upsertCoach(data, academySlug, sources)` — fully implemented
- Handles new coach insertion and existing coach updates
- Supports `sourceCount`, `dataProvenance` tracking
- Validates `academySlug` linkage (warns if academy not found)

### ✅ Coach Search (`gemini.js:195-225`)
- `searchCoaches(academyName, city, state)` — Gemini API integration
- Returns coach list with: name, experience, certifications, sports
- Proper error handling and fallback

### ✅ Coach Schema (`models/Coach.js`)
- All required fields defined
- Supports `sourceCount`, `dataProvenance`
- `academyId` reference to Academy model

---

## What's Missing

### ❌ Pipeline Integration (`pipeline.js`)
**Gap:** No coach discovery logic in pipeline.

**Current pipeline flow:**
```
State → Gemini search → Overpass → Extract → Normalize → Ingest academy
```

**Required pipeline flow:**
```
State → Gemini search → Overpass → Extract → Normalize → Ingest academy
                                                    ↓
                                              For each academy:
                                                Gemini search coaches
                                                Extract coach data
                                                Ingest coach (link to academy)
```

### ❌ Coach Discovery Sources
**Gap:** No coach-specific data sources configured.

**Available sources:**
- Gemini search (API ready)
- Website extraction (Firecrawl ready)
- Google Maps (simulated via Gemini)

**Missing sources:**
- Khelo India coach directory
- SAI (Sports Authority of India) database
- National sports federation databases

### ❌ Coach Deduplication
**Gap:** No deduplication logic for coaches.

**Risk:** Same coach may be discovered multiple times from different academies.

**Solution:** Deduplicate by name + academy + sport combination.

---

## Implementation Plan

### Phase 1: Basic Coach Extraction (30 min)
1. Add `processCoaches()` method to pipeline
2. After each academy is processed, call `gemini.searchCoaches()`
3. For each coach found, call `ingestor.upsertCoach()`
4. Link coach to academy via `academySlug`

### Phase 2: Coach Deduplication (15 min)
1. Add `findDuplicateCoach(name, academySlug)` to ingestor
2. Check for existing coach before insert
3. Update existing coach if duplicate found

### Phase 3: Dry Run Integration (10 min)
1. Add simulated coach data to dry-run mode
2. Test coach ingestion without API calls

---

## Code Changes Required

### 1. `pipeline.js` — Add coach processing
```javascript
async processCoaches(academyName, city, state, academySlug) {
    try {
        const result = await this.gemini.searchCoaches(academyName, city, state);
        if (result.coaches) {
            for (const coach of result.coaches) {
                const sources = [
                    { sourceType: 'gemini_search', confidenceScore: 25 },
                ];
                await this.ingestor.upsertCoach(coach, academySlug, sources);
            }
        }
    } catch (error) {
        console.log(`  Coach extraction failed: ${error.message}`);
    }
}
```

### 2. `pipeline.js` — Call after academy processing
```javascript
// After line 257 in processAcademy()
await this.processCoaches(extractedData.name, extractedData.city, state, result.slug);
```

### 3. `ingest.js` — Add coach deduplication
```javascript
async findDuplicateCoach(name, academySlug) {
    const slug = generateSlug(name);
    return await Coach.findOne({ slug, academySlug });
}
```

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Coach name collisions | Medium | Deduplicate by name + academy |
| Missing academy linkage | Low | Warn and insert without link |
| Gemini search limits | Medium | Cache results, batch queries |
| Duplicate coach records | High | Deduplication before insert |

---

## Readiness Checklist

- [ ] `processCoaches()` method added to pipeline
- [ ] Coach extraction called after each academy
- [ ] Coach deduplication implemented
- [ ] Dry-run mode includes coach simulation
- [ ] Coach ingestion tested with real data
- [ ] Coach-academy linkage verified

---

## Verdict

| Component | Status |
|-----------|--------|
| Academy acquisition | ✅ READY |
| Coach acquisition | ❌ NOT READY |

**Overall: NOT READY for coach data acquisition.** Academy pipeline is ready; coach pipeline requires ~55 minutes of implementation work.

---

## Next Steps

1. **Approve implementation plan** — 3 phases, ~55 minutes total
2. **Implement Phase 1** — Basic coach extraction
3. **Test with dry-run** — Verify coach ingestion
4. **Implement Phase 2** — Deduplication
5. **Implement Phase 3** — Dry-run integration
6. **Full validation** — Run `DRY_RUN=true MAX_ACADEMIES=5`
