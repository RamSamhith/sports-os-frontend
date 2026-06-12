# Database Alignment Report

> Generated: 2026-06-12
> Evidence-based analysis — no assumptions

---

## 1. Three Schema Definitions Compared

There are **three separate schema definitions** for the same entities across the workspace. This report compares them field-by-field.

### 1.1 Schema Sources

| Source | Location | Models Count | Format |
|--------|----------|-------------|--------|
| **Active** | `sportsOS-nodejs/models/*.js` | 5 files | Individual files per model |
| **Canonical** | `sports-os-backend/models/index.js` | 17 models | Single monolithic file |
| **Legacy** | `sports-os-Database/models/*.js` | 4 files | Individual files, minimal |
| **Frontend** | `types/domain/*.ts` | 19 types | TypeScript interfaces |

---

## 2. Model-by-Model Comparison

### 2.1 User Model

| Field | Frontend (`user.ts`) | Canonical (`models/index.js`) | Active (`sportsOS-nodejs/models/User.js`) | Legacy (`sports-os-Database`) |
|-------|---------------------|------------------------------|------------------------------------------|------------------------------|
| `name` | string, required | string, required | string, required | — |
| `email` | string | string, required, unique, lowercase | string, required, unique | — |
| `password` | — (not in type) | string, required | string, required | — |
| `role` | `'athlete'\|'parent'\|'coach'\|'academy_rep'\|'admin'` | `'athlete'\|'parent'\|'coach'\|'academy_owner'\|'admin'` | `'user'\|'admin'` | — |
| `phone` | string, optional | string | Not present | — |
| `phoneVerified` | — | boolean, default false | Not present | — |
| `isVerified` | — | boolean, default false | Not present | — |
| `isActive` | — | boolean, default true | Not present | — |
| `isBanned` | — | boolean, default false | Not present | — |
| `onboardingCompleted` | — | boolean, default false | Not present | — |
| `adminRole` | — | string, default null | Not present | — |
| `avatar` | string, optional | Not present | Not present | — |
| `authProvider` | `'credentials'\|'google'\|'phone'` | Not present | Not present | — |
| `location` | — | GeoJSON Point | Not present | — |
| `city` | — | string | Not present | — |
| `state` | — | string | Not present | — |
| `pincode` | — | string | Not present | — |
| `preferences` | UserPreferences object | Mixed (location, radius, sports) | Not present | — |
| `consent` | ConsentFlags object | `{analytics, marketing, whatsapp}` | Not present | — |
| `themePreference` | enum (5 values) | enum (5 values) | Not present | — |
| `lastLoginAt` | string, optional | Date | Not present | — |
| `timestamps` | createdAt, updatedAt | Yes | Yes | — |

**Discrepancies:**
- Role enum: Frontend has `academy_rep`, canonical has `academy_owner`, active has `user` — **three different values**
- Active model is missing 15 fields present in canonical
- Frontend `authProvider` field not in any backend schema

### 2.2 Academy Model

| Field | Frontend (`academy.ts`) | Canonical (`models/index.js`) | Active (`sportsOS-nodejs/models/Academy.js`) | Legacy (`sports-os-Database/models/Academy.js`) |
|-------|------------------------|------------------------------|---------------------------------------------|-----------------------------------------------|
| `id` | string | — (uses `_id`) | — (uses `_id`) | — |
| `slug` | string, required | string, required, unique | Not present | — |
| `name` | string | string, required | string, required | string |
| `description` | string | string | Not present | — |
| `location` | LocationSummary (object) | GeoJSON Point | string (required) | string |
| `city` | — (in location) | string | Not present | — |
| `state` | — (in location) | string | Not present | — |
| `address` | — (in location) | string | Not present | — |
| `contact` | `{phone?, email?, website?}` | `{phone, email, website}` + separate `phone`, `website` | Not present | — |
| `sportsOffered` | string[] | [String] | `sport: [String]` (different name) | `sport: String` (different name, not array) |
| `facilities` | Facility[] (enum array) | enum array | Not present | — |
| `trainingLevels` | TrainingLevel[] (enum array) | enum array | Not present | `trainingLevel: String` |
| `ageRange` | `{min?, max?}` | — (in explorationGuidance) | Not present | — |
| `batchInformation` | string | string | Not present | `batchSchedule: String` |
| `certifications` | Certification[] | `{name, issuer, year, documentUrl}[]` | Not present | — |
| `achievementSignals` | object | object | Not present | — |
| `verificationStatus` | enum (4 values) | enum (4 values) | `verified: Boolean` | `verified: Boolean` |
| `isVerified` | — | boolean | — | — |
| `status` | AcademyStatus enum | enum (3 values) | Not present | — |
| `isFeatured` | — | boolean | Not present | — |
| `rating` | `{average, count}` | Not present (separate fields: `avgRating`, `reviewCount`) | Not present | — |
| `avgRating` | — | number | Not present | — |
| `reviewCount` | — | number | Not present | — |
| `shortlistCount` | — | number | Not present | — |
| `rankScore` | — | number | Not present | — |
| `coverImage` | string | string | Not present | — |
| `gallery` | string[] | [String] | Not present | — |
| `ownerId` | — | ObjectId ref User | Not present | — |
| `feeRange` | — | `{min, max, currency}` | Not present | `monthlyFee: Number` |
| `location` (GeoJSON) | — | GeoJSON Point with index | Not present | — |
| `lastUpdatedAt` | string | Date | Not present | — |
| `indexedAt` | string | Date | Not present | — |

**Discrepancies:**
- Field name `sportsOffered` (frontend/canonical) vs `sport` (active) vs `sport` (legacy)
- `sport` is `[String]` in active but `String` in legacy
- `location` is a complex object (frontend), GeoJSON (canonical), or plain string (active/legacy)
- `verificationStatus` is an enum in frontend/canonical but a boolean in active/legacy
- Active model has 7 fields; canonical has 30+; frontend has 20+
- `feeRange` object (canonical) vs `monthlyFee` number (legacy)

### 2.3 Coach Model

| Field | Frontend (`coach.ts`) | Canonical (`models/index.js`) | Active (`sportsOS-nodejs/models/Coach.js`) | Legacy (`sports-os-Database/models/Coach.js`) |
|-------|----------------------|------------------------------|-------------------------------------------|-----------------------------------------------|
| `id` | string | — | — | — |
| `slug` | string, required | string, required, unique | Not present | — |
| `name` | string | string, required | string, required | string |
| `avatar` | string | string | Not present | — |
| `bio` | — | string | Not present | — |
| `sportsCoached` | string[] | [String] | `sport: String` (different name) | `sport: String` |
| `specialization` | string[] | [String] | Not present | — |
| `experienceYears` | number | number + `experience` (backward compat) | Not present | `experienceYears: Number` |
| `location` | LocationSummary | GeoJSON Point | Not present | — |
| `city` | — | string | Not present | — |
| `state` | — | string | Not present | — |
| `academyId` | string, optional | ObjectId ref Academy | ObjectId ref Academy (required) | `academyId: Number` (no ref) |
| `userId` | — | ObjectId ref User | Not present | — |
| `contact` | `{phone?, email?}` | `{phone, email}` | Not present | — |
| `feeRange` | — | `{min, max, currency}` | Not present | — |
| `certifications` | Certification[] | `{name, issuer, year, documentUrl}[]` | Not present | `certification: String` |
| `isVerified` | — | boolean | Not present | — |
| `verificationStatus` | enum | enum | Not present | — |
| `status` | CoachStatus enum | enum | Not present | `level: String` |
| `isFeatured` | — | boolean | Not present | — |
| `rating` | `{average, count}` | Not present (separate: `avgRating`, `reviewCount`) | Not present | — |
| `avgRating` | — | number | Not present | — |
| `reviewCount` | — | number | Not present | — |
| `rankScore` | — | number | Not present | — |
| `location` (GeoJSON) | — | GeoJSON Point with index | Not present | — |
| `lastUpdatedAt` | string | Date | Not present | — |

**Discrepancies:**
- `sportsCoached` array (frontend) vs `sport` string (active) vs `sport` string (legacy)
- `academyId` is optional ref (canonical), required ref (active), plain Number (legacy)
- `certifications` is array of objects (frontend/canonical) vs single string (legacy)
- `verificationStatus` enum missing from active and legacy
- Active model has 3 fields; canonical has 25+; frontend has 13

### 2.4 Shortlist Model

| Field | Frontend (`shortlist.ts`) | Canonical (`models/index.js`) | Active (`sportsOS-nodejs/models/Shortlist.js`) | Legacy (`sports-os-Database/models/Shortlist.js`) |
|-------|--------------------------|------------------------------|-----------------------------------------------|--------------------------------------------------|
| `id` | string | — | — | — |
| `userId` | string | ObjectId ref User, required | Not present | — |
| `contextChildId` | string, optional | ObjectId ref Child, default null | Not present | — |
| `itemId` | string | ObjectId, required | Not present | — |
| `itemType` | `'academy'\|'coach'\|'sport'` | enum, required | Not present | — |
| `athleteId` | — | — | ObjectId ref Athlete, required | `athleteId: Number` |
| `academyId` | — | — | ObjectId ref Academy, required | `academyId: Number` |
| `academyName` | — | — | — | `academyName: String` |
| `sport` | — | — | — | `sport: String` |
| `note` | — | — | — | `note: String` |

**Discrepancies:**
- Active/legacy use `athleteId→academyId` model (athlete bookmarks an academy)
- Frontend/canonical use `userId→itemId+itemType` model (user bookmarks any entity type)
- These are **completely different data models** with different semantics
- Legacy has `academyName`, `sport`, `note` fields not in any other version

### 2.5 Sport Model

| Field | Frontend (`sport.ts`) | Canonical (`models/index.js`) | Active | Legacy |
|-------|----------------------|------------------------------|--------|--------|
| `id` | string | — | — | — |
| `slug` | string, required | string, required, unique | — | — |
| `name` | string | string, required, unique | — | — |
| `description` | string | string | — | — |
| `icon` | string | string | — | — |
| `coverImage` | string | string | — | — |
| `category` | SportCategory enum | enum | — | — |
| `competitionPathway` | object | `{levels: [{key, label, description}]}` | — | — |
| `explorationGuidance` | object | `{ageSuitability, physicalRequirements, notes}` | — | — |
| `status` | SportStatus enum | enum | — | — |
| `difficulty` | — | enum | — | — |
| `ageRange` | — | `{min, max}` | — | — |
| `careerOpportunities` | — | [String] | — | — |

**No active or legacy model exists.** Sport only exists in canonical schema and frontend types.

### 2.6 Additional Models (Canonical Only)

| Model | Fields | Present in Active? | Present in Legacy? |
|-------|--------|-------------------|-------------------|
| Role | name, permissions[], scopes[] | No | No |
| OTP | userId, otp, type, expiresAt (TTL) | No | No |
| AcademyImage | academyId, url, isPrimary | No | No |
| AcademyFacility | academyId, name | No | No |
| CoachCertificate | coachId, title, issuedBy, issuedYear, documentUrl | No | No |
| Enquiry | userId, childId, targetType, targetId, intent, parentInfo, childInfo, status, leadId | No | No |
| Lead | enquiryId, source, ownerType, ownerId, userId, childId, status, assignedTo | No | No |
| LeadActivity | leadId, actorType, actorId, type, payload | No | No |
| Child | parentId, name, age, dob, gender, sportInterests[], skillLevel, medicalNotes | No | No |
| Review | userId, targetId, targetType, rating, text, moderationStatus | No | No |
| Analytics | event, userId, data | No | No |
| VerificationCase | targetType, targetId, status, evidence[], reviewerNotes | No | No |

---

## 3. Index Comparison

| Index | Canonical | Active | Legacy |
|-------|----------|--------|--------|
| User: 2dsphere on location | Yes | No | No |
| OTP: TTL on expiresAt | Yes | No | No |
| Academy: 2dsphere on location | Yes | No | No |
| Academy: text on name/description/city | Yes | No | No |
| Coach: 2dsphere on location | Yes | No | No |
| Coach: text on name/bio/city | Yes | No | No |
| Shortlist: compound unique (userId, itemId, itemType) | Yes | No (different schema) | No |
| Review: compound unique (userId, targetId, targetType) | Yes | N/A | N/A |
| Analytics: compound (event, createdAt) | Yes | N/A | N/A |
| LeadActivity: compound (leadId, createdAt) | Yes | N/A | N/A |
| VerificationCase: compound (targetType, targetId, status) | Yes | N/A | N/A |

---

## 4. services/index.js Import Pattern

The canonical `models/index.js` exports all 17 models as named exports:
```javascript
module.exports = {
  User, Role, OTP, Academy, AcademyImage, AcademyFacility,
  Coach, CoachCertificate, Sport, Shortlist, Enquiry, Lead,
  LeadActivity, Child, Review, Analytics, VerificationCase
};
```

The services in both sportsOS-nodejs and sports-os-backend import individual models:
```javascript
const Academy = require('../models/Academy');  // expects separate file
```

**This means the services expect the sportsOS-nodejs file-per-model structure, not the monolithic index.js from sports-os-backend.** The canonical models/index.js is never actually imported by anything — it's a reference document.

---

## 5. sports-os-Database: Obsolete or Required?

### Evidence it is obsolete:

1. **Git history:** Single commit "Database Layer Implementation" — never updated
2. **Schema simplicity:** 4 models with minimal fields, no required fields (except Athlete.name)
3. **Numeric IDs:** `academyId: Number` in Coach and Shortlist — not ObjectId refs (will crash with Mongoose refs)
4. **No middleware:** No `express.json()`, no CORS, no body parsing in `server.js`
5. **No routes:** Express app has zero route definitions
6. **Hardcoded seed:** `Athlete.create({name: "Rahul Sharma"...})` runs on every server start
7. **Port conflict:** Hardcoded port 8095, while sportsOS-nodejs uses port 3000
8. **Entry point mismatch:** `package.json` says `"main": "index.js"` but file is `server.js`
9. **Schema superseded:** Every model in this repo has a more complete version in sportsOS-nodejs
10. **Different Mongoose version:** Uses Mongoose 9.7.0 vs sportsOS-nodejs's 7.8.9

### Evidence it might still be required:

1. It has a `package.json` (sports-os-backend does not)
2. It has a working `server.js` entry point (sportsOS-nodejs also has one)
3. The `config/db.js` pattern is the same as sportsOS-nodejs

### Verdict:

**sports-os-Database is obsolete.** Its models are a strict subset of sportsOS-nodejs models. Its server.js has no routes. Its schema definitions use numeric IDs that are incompatible with the rest of the system. It appears to be the original prototype that was superseded by sportsOS-nodejs.

---

## 6. Migration Path Analysis

To align all three schema versions, the following would need to happen:

| Action | From | To | Fields Affected |
|--------|------|-----|----------------|
| User.role enum expansion | `'user'\|'admin'` | `'athlete'\|'parent'\|'coach'\|'academy_owner'\|'admin'` | User |
| User field additions | — | phone, phoneVerified, isVerified, isActive, isBanned, onboardingCompleted, preferences, consent, themePreference | User |
| Academy field additions | 7 fields | 30+ fields | Academy |
| Academy.sport rename | `sport` | `sportsOffered` | Academy |
| Academy.location type change | String | GeoJSON Point | Academy |
| Academy.verified → verificationStatus | Boolean | Enum | Academy |
| Coach field additions | 3 fields | 25+ fields | Coach |
| Coach.sport rename | `sport` (String) | `sportsCoached` ([String]) | Coach |
| Shortlist schema replacement | athleteId→academyId | userId→itemId+itemType | Shortlist |
| 12 new model files | — | Role, OTP, AcademyImage, AcademyFacility, CoachCertificate, Sport, Enquiry, Lead, LeadActivity, Child, Review, Analytics, VerificationCase | All |
| Index additions | None | 2dsphere, text, TTL, compound unique | All |
| sports-os-Database deletion | 4 models, no routes | — | — |
