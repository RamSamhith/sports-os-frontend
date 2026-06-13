# Existing Database Structure

**Date:** June 12, 2026

---

## MongoDB Collections

### 1. users
```
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, stripped from JSON),
  phone: String,
  role: String (enum: athlete|parent|coach|academy_owner|admin, default: athlete),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** unique on email

---

### 2. academies
```
{
  _id: ObjectId,
  slug: String (required, unique, lowercase),
  name: String (required),
  description: String (default: ''),
  location: {
    address: String,
    city: String (required),
    state: String (required),
    country: String (default: 'IN'),
    district: String,
    lat: Number (default: 0),
    lng: Number (default: 0),
    pincode: String,
    geohash: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  sportsOffered: [String],
  facilities: [String] (enum: 9 values),
  trainingLevels: [String] (enum: 4 values),
  certifications: [{
    name: String (required),
    issuer: String (required),
    year: Number (required),
    documentUrl: String
  }],
  verificationStatus: String (enum: unverified|pending|verified|rejected, default: unverified),
  achievementSignals: {
    stateAthletesProduced: Number (default: 0),
    nationalAthletesProduced: Number (default: 0),
    competitionParticipations: [String],
    milestones: [String]
  },
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  coverImage: String,
  status: String (enum: draft|published|suspended, default: published),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** unique on slug

---

### 3. coaches
```
{
  _id: ObjectId,
  slug: String (required, unique, lowercase),
  name: String (required),
  avatar: String,
  certifications: [{
    name: String (required),
    issuer: String (required),
    year: Number (required),
    documentUrl: String
  }],
  experienceYears: Number (default: 0),
  sportsCoached: [String],
  specialization: [String],
  academyId: ObjectId (ref: 'Academy'),
  location: {
    address: String,
    city: String (required),
    state: String (required),
    country: String (default: 'IN'),
    district: String,
    lat: Number (default: 0),
    lng: Number (default: 0),
    pincode: String,
    geohash: String
  },
  contact: {
    phone: String,
    email: String
  },
  verificationStatus: String (enum: unverified|pending|verified|rejected, default: unverified),
  rating: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  status: String (enum: draft|published|suspended, default: published),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** unique on slug

---

### 4. athletes
```
{
  _id: ObjectId,
  name: String (required),
  sport: [String] (required),
  age: Number (required),
  academy: String (required) — plain text, NOT ObjectId ref,
  distanceKm: Number,
  goalType: String (enum: short-term|long-term|both, default: both),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** none

---

### 5. shortlists
```
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  itemType: String (required, enum: academy|coach),
  itemId: ObjectId (required),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** compound unique on (userId, itemType, itemId)

---

### 6. enquiries
```
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', default: null),
  targetType: String (required, enum: academy|coach),
  targetId: ObjectId (required),
  intent: String (enum: contact|callback|trial|enrollment_interest, default: trial),
  parentInfo: {
    name: String (required),
    email: String (required),
    phone: String (required)
  },
  childInfo: {
    name: String,
    age: Number
  },
  sportInterest: String (required),
  message: String,
  status: String (enum: submitted|delivered|failed|bounced, default: submitted),
  deliveryAttempts: Number (default: 0),
  lastDeliveryAt: Date,
  failureReason: String,
  whatsappConfirmationSent: Boolean (default: false),
  whatsappMessageId: String,
  leadId: String,
  ipHash: String,
  userAgentHash: String,
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes:** none

---

## Collection Relationships

```
users ──────────1:N──────────> shortlists (userId)
users ──────────1:N──────────> enquiries (userId, optional)
coaches ────────N:1──────────> academies (academyId)
shortlists ─────polymorphic──> academies | coaches (itemId)
enquiries ──────polymorphic──> academies | coaches (targetId)
athletes ───────string ref───> academies (academy name as text)
```

---

## Seed Data Counts

| Collection | Records | Status |
|------------|---------|--------|
| users | 0 | Must register via API |
| academies | 0 (12 in seed) | Must run seedAcademies.js |
| coaches | 1 (8 in seed) | Must run seedCoaches.js |
| athletes | 0 | Not seeded |
| shortlists | 0 | Created by users |
| enquiries | 0 | Created by users |

---

## Enum Constraints Summary

| Collection | Field | Valid Values |
|------------|-------|-------------|
| users | role | athlete, parent, coach, academy_owner, admin |
| academies | verificationStatus | unverified, pending, verified, rejected |
| academies | status | draft, published, suspended |
| academies | facilities | indoor, outdoor, ground, court, equipment, changing_room, parking, physio, gym |
| academies | trainingLevels | beginner, intermediate, advanced, elite |
| coaches | verificationStatus | unverified, pending, verified, rejected |
| coaches | status | draft, published, suspended |
| athletes | goalType | short-term, long-term, both |
| shortlists | itemType | academy, coach |
| enquiries | targetType | academy, coach |
| enquiries | intent | contact, callback, trial, enrollment_interest |
| enquiries | status | submitted, delivered, failed, bounced |
