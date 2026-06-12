# ACADEMY SCHEMA ALIGNMENT

**Source of Truth:** `types/domain/academy.ts` (frontend)

---

## Field-by-Field Analysis

| Field | Frontend Type | Backend Current | Gap | MVP? | Action |
|-------|--------------|-----------------|-----|------|--------|
| `id` | `string` | `_id` (ObjectId) | ✅ Fixed Phase 1 | ✅ | toJSON transform |
| `slug` | `string` | ❌ Missing | 🔴 CRITICAL | ✅ | Add to schema + seed |
| `name` | `string` | `String, required` | ✅ Exists | ✅ | Keep |
| `description` | `string` | ❌ Missing | 🔴 CRITICAL | ✅ | Add to schema |
| `location` | `LocationSummary` | `String` | 🟡 Type mismatch | ✅ | Replace with subdoc |
| `contact` | `{phone?, email?, website?}` | ❌ Missing | 🔴 CRITICAL | ✅ | Add subdoc |
| `sportsOffered` | `string[]` | `sport: [String]` | 🟡 Name mismatch | ✅ | Rename to `sportsOffered` |
| `facilities` | `Facility[]` | ❌ Missing | 🟡 Medium | ✅ | Add array |
| `trainingLevels` | `TrainingLevel[]` | ❌ Missing | 🟡 Medium | ✅ | Add array |
| `ageRange` | `{min?, max?}` | ❌ Missing | ⚪ Low | ❌ | Skip — future |
| `batchInformation` | `string` | ❌ Missing | ⚪ Low | ❌ | Skip — future |
| `certifications` | `Certification[]` | ❌ Missing | 🟡 Medium | ✅ | Add array |
| `verificationStatus` | enum 4 values | `verified: Boolean` | 🔴 CRITICAL | ✅ | Replace field |
| `verificationEvidence` | `VerificationEvidence[]` | ❌ Missing | ⚪ Low | ❌ | Skip — future |
| `achievementSignals` | `AchievementSignals` | ❌ Missing | 🟡 Medium | ✅ | Add subdoc |
| `rating` | `{average, count}` | ❌ Missing | 🔴 CRITICAL | ✅ | Add subdoc |
| `coverImage` | `string?` | ❌ Missing | 🟡 Medium | ✅ | Add field |
| `gallery` | `string[]` | ❌ Missing | ⚪ Low | ❌ | Skip — future |
| `status` | `AcademyStatus` | ❌ Missing | 🟡 Medium | ✅ | Add enum |
| `lastUpdatedAt` | `string` | ❌ Missing | 🟡 Medium | ✅ | Use `updatedAt` |
| `createdAt` | `string` | ✅ timestamps | ✅ Exists | ✅ | Keep |
| `indexedAt` | `string?` | ❌ Missing | ⚪ Low | ❌ | Skip — future |
| `distanceKm` | `number?` | `Number` | ✅ Exists | ❌ | Remove — computed |
| `verified` | `boolean` | `Boolean` | 🟡 Replaced | ✅ | Remove — use verificationStatus |
| `goalType` | `string` | `String enum` | ⚪ Not in type | ❌ | Remove — not in frontend |

---

## Mongoose Schema (Expanded)

```javascript
const academySchema = new mongoose.Schema({
    slug:               { type: String, required: true, unique: true, lowercase: true },
    name:               { type: String, required: true },
    description:        { type: String, default: '' },
    location: {
        address:        { type: String },
        city:           { type: String, required: true },
        state:          { type: String, required: true },
        country:        { type: String, default: 'IN' },
        district:       { type: String },
        lat:            { type: Number, default: 0 },
        lng:            { type: Number, default: 0 },
        pincode:        { type: String },
        geohash:        { type: String },
    },
    contact: {
        phone:          { type: String },
        email:          { type: String },
        website:        { type: String },
    },
    sportsOffered:      [{ type: String }],
    facilities:         [{ type: String, enum: ['indoor','outdoor','ground','court','equipment','changing_room','parking','physio','gym'] }],
    trainingLevels:     [{ type: String, enum: ['beginner','intermediate','advanced','elite'] }],
    certifications:     [{
        name:           { type: String, required: true },
        issuer:         { type: String, required: true },
        year:           { type: Number, required: true },
        documentUrl:    { type: String },
    }],
    verificationStatus: { type: String, enum: ['unverified','pending','verified','rejected'], default: 'unverified' },
    achievementSignals: {
        stateAthletesProduced:    { type: Number, default: 0 },
        nationalAthletesProduced: { type: Number, default: 0 },
        competitionParticipations:[{ type: String }],
        milestones:               [{ type: String }],
    },
    rating: {
        average:        { type: Number, default: 0 },
        count:          { type: Number, default: 0 },
    },
    coverImage:         { type: String },
    status:             { type: String, enum: ['draft','published','suspended'], default: 'published' },
}, { timestamps: true });
```

---

## Removed Fields (backward-compat via migration)

| Old Field | Migration |
|-----------|-----------|
| `sport` | Rename → `sportsOffered` |
| `location` (string) | Convert → `location.city` |
| `distanceKm` | Drop — computed on frontend |
| `verified` (boolean) | Map → `verificationStatus` |
| `goalType` | Drop — not in frontend type |
