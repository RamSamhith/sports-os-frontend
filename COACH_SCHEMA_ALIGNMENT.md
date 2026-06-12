# COACH SCHEMA ALIGNMENT

**Source of Truth:** `types/domain/coach.ts` (frontend)

---

## Field-by-Field Analysis

| Field | Frontend Type | Backend Current | Gap | MVP? | Action |
|-------|--------------|-----------------|-----|------|--------|
| `id` | `string` | `_id` (ObjectId) | ✅ Fixed Phase 1 | ✅ | toJSON transform |
| `slug` | `string` | ❌ Missing | 🔴 CRITICAL | ✅ | Add to schema + seed |
| `name` | `string` | `String, required` | ✅ Exists | ✅ | Keep |
| `avatar` | `string?` | ❌ Missing | 🟡 Medium | ✅ | Add field |
| `certifications` | `Certification[]` | ❌ Missing | 🟡 Medium | ✅ | Add array |
| `experienceYears` | `number` | ❌ Missing | 🔴 CRITICAL | ✅ | Add field |
| `sportsCoached` | `string[]` | `sport: String` | 🔴 CRITICAL | ✅ | Rename + array |
| `specialization` | `string[]` | ❌ Missing | 🟡 Medium | ✅ | Add array |
| `academyId` | `string?` | `ObjectId, required` | 🟡 Required → Optional | ✅ | Make optional |
| `location` | `LocationSummary` | ❌ Missing | 🔴 CRITICAL | ✅ | Add subdoc |
| `contact` | `{phone?, email?}` | ❌ Missing | 🔴 CRITICAL | ✅ | Add subdoc |
| `verificationStatus` | enum 4 values | ❌ Missing | 🔴 CRITICAL | ✅ | Add enum |
| `rating` | `{average, count}` | ❌ Missing | 🔴 CRITICAL | ✅ | Add subdoc |
| `status` | `CoachStatus` | ❌ Missing | 🟡 Medium | ✅ | Add enum |
| `lastUpdatedAt` | `string` | ❌ Missing | 🟡 Medium | ✅ | Use `updatedAt` |
| `createdAt` | `string` | ✅ timestamps | ✅ Exists | ✅ | Keep |

---

## Mongoose Schema (Expanded)

```javascript
const coachSchema = new mongoose.Schema({
    slug:               { type: String, required: true, unique: true, lowercase: true },
    name:               { type: String, required: true },
    avatar:             { type: String },
    certifications:     [{
        name:           { type: String, required: true },
        issuer:         { type: String, required: true },
        year:           { type: Number, required: true },
        documentUrl:    { type: String },
    }],
    experienceYears:    { type: Number, default: 0 },
    sportsCoached:      [{ type: String }],
    specialization:     [{ type: String }],
    academyId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Academy' },
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
    },
    verificationStatus: { type: String, enum: ['unverified','pending','verified','rejected'], default: 'unverified' },
    rating: {
        average:        { type: Number, default: 0 },
        count:          { type: Number, default: 0 },
    },
    status:             { type: String, enum: ['draft','published','suspended'], default: 'published' },
}, { timestamps: true });
```

---

## Removed Fields (backward-compat via migration)

| Old Field | Migration |
|-----------|-----------|
| `sport` (String) | Rename → `sportsCoached` (Array) |
| `academyId` (required) | Make optional |
