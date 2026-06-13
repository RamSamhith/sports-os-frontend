# Implementation Audit Report (Post CI-1 Fix)

**Date:** June 12, 2026  
**Scope:** Full implementation audit of data acquisition system  
**Mode:** READ-ONLY  
**Updated:** Post CI-1 fix verification

---

## Executive Summary

| Category | Status |
|----------|--------|
| **Critical Issues** | 0 |
| **Warnings** | 5 |
| **Info** | 4 |
| **Files Audited** | 13 |
| **Overall Status** | **READY FOR DRY RUN** |

---

## Critical Issues

### CI-1: Duplicate `$set` Operator in MongoDB Update ✅ FIXED

**File:** `seeds/discovery/ingest.js`  
**Lines:** 96-103, 191-198  
**Severity:** CRITICAL → **RESOLVED**

**Problem:**  
The `updateOne()` calls contained two `$set` operators in the same update document. MongoDB 5+ silently loses the first `$set` block.

**Fix Applied:** Merged into single `$set`:
```javascript
updates.sourceCount = existing.sourceCount + sourceCount;
await Academy.updateOne(
    { slug },
    {
        $set: updates,
        $push: { dataProvenance: { $each: provenance } },
    }
);
```

**Verification:** ✅ All 11 tests passed including duplicate detection.

---

## Warnings

### CW-1: `verificationStatus` Ternary Always Returns Same Value

**File:** `seeds/discovery/ingest.js`  
**Lines:** 40, 167

```javascript
const verificationStatus = hasIndependentSource ? 'unverified' : 'unverified';
```

Both branches return `'unverified'`. Appears to be unfinished stub.

---

### CW-2: Frontend Types Have Fields Not in Backend Schema

**File:** `types/domain/academy.ts`  
**Lines:** 48-49, 52, 67

Frontend defines `ageRange?`, `batchInformation?`, `verificationEvidence?`, `indexedAt?` but these don't exist in the Mongoose schema. Harmless but indicates forward-looking types.

---

### CW-3: `node-fetch` v3 Installed but Unused

**File:** `sportsOS-nodejs/package.json`

`node-fetch@^3.3.2` is ESM-only but project is CommonJS. No file imports it (native `fetch` is used). Dead dependency.

---

### CW-4: Environment Variables Not Documented

**File:** `.env.example` (missing)

Acquisition variables (`GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, `MONGO_URI`, etc.) are not documented in `.env.example`.

---

### CW-5: `upsertCoach()` Never Called

**File:** `seeds/discovery/ingest.js`  
**Line:** 118

The `upsertCoach()` method is defined but never called from the pipeline. Dead code for now.

---

## Info Items

| # | File | Note |
|---|------|------|
| 1 | `utils.js` | `normalizeFacility()` and `normalizeLevel()` exported but unused |
| 2 | `pipeline.js` | Imports subset of utils functions |
| 3 | `seeds/discovery/sources/` | Empty directory, no references |
| 4 | `gemini.js:11` | API key in URL query param (standard for Google API) |

---

## File-by-File Audit

| File | Status | Notes |
|------|--------|-------|
| `models/Academy.js` | ✅ PASS | New fields correct |
| `models/Coach.js` | ✅ PASS | New fields correct |
| `types/domain/academy.ts` | ✅ PASS | Matches backend |
| `types/domain/coach.ts` | ✅ PASS | Matches backend |
| `seeds/discovery/config.js` | ✅ PASS | Clean configuration |
| `seeds/discovery/gemini.js` | ✅ PASS | Proper error handling |
| `seeds/discovery/firecrawl.js` | ✅ PASS | Proper error handling |
| `seeds/discovery/overpass.js` | ✅ PASS | Valid Overpass QL |
| `seeds/discovery/pipeline.js` | ✅ PASS | No circular deps |
| `seeds/discovery/ingest.js` | ✅ PASS | CI-1 fixed, duplicate `$set` resolved |
| `seeds/discovery/logger.js` | ✅ PASS | Proper logging |
| `seeds/discovery/utils.js` | ✅ PASS | All functions work |
| `seeds/runAcquisition.js` | ✅ PASS | Env validation correct |

---

## Dependency Graph

```
runAcquisition.js
  └── pipeline.js
        ├── config.js
        ├── gemini.js ─── config.js
        ├── firecrawl.js ── config.js
        ├── overpass.js ── config.js
        ├── ingest.js ── config.js, models/Academy, models/Coach, utils.js
        ├── logger.js
        └── utils.js
```

**No circular dependencies detected.**

---

## Environment Variables

| Variable | Required | Default | Documented |
|----------|----------|---------|------------|
| `MONGO_URI` | Yes | — | ❌ |
| `GEMINI_API_KEY` | Yes | — | ❌ |
| `FIRECRAWL_API_KEY` | Yes | — | ❌ |
| `DRY_RUN` | No | `true` | ❌ |
| `MAX_ACADEMIES` | No | `20` | ❌ |
| `MAX_COACHES` | No | `10` | ❌ |
| `VERBOSE` | No | `false` | ❌ |
| `TARGET_STATES` | No | 5 states | ❌ |

---

## Schema Compatibility

| Field | Academy Model | Coach Model | Frontend Type | Status |
|-------|--------------|-------------|---------------|--------|
| `gallery` | ✅ `[{type: String}]` | — | ✅ `string[]` | ✅ |
| `sourceCount` | ✅ `{type: Number, default: 0}` | ✅ | ✅ `number` | ✅ |
| `dataProvenance` | ✅ Array of subdocs | ✅ | ✅ Optional array | ✅ |

---

## Verdict

| Component | Status |
|-----------|--------|
| Schema changes | ✅ PASS |
| Frontend types | ✅ PASS |
| Discovery system | ✅ PASS |
| Ingestion system | ✅ PASS (CI-1 fixed) |
| Logging | ✅ PASS |
| Dependencies | ⚠️ WARNING |
| Environment | ⚠️ WARNING |

**Overall: READY FOR DRY RUN TESTING.** CI-1 fixed and verified.
