# SportsOS — Database Schema Mapping

> **Document generated from frontend codebase**  
> TypeScript domain models → PostgreSQL schema derivation  
> Date: 2026-06-11

---

## Table of Contents

1. [Entity Relationship Overview](#entity-relationship-overview)
2. [Enumerated Types](#enumerated-types)
3. [Table Schemas](#table-schemas)
   - [users](#users)
   - [children](#children)
   - [academies](#academies)
   - [coaches](#coaches)
   - [coach_certifications](#coach_certifications)
   - [academy_certifications](#academy_certifications)
   - [academy_achievement_signals](#academy_achievement_signals)
   - [enquiries](#enquiries)
   - [favorites](#favorites)
   - [user_settings](#user_settings)
   - [otp_codes](#otp_codes)
   - [sessions](#sessions)
   - [sports](#sports)
   - [competitions](#competitions)
   - [leads](#leads)
   - [lead_activities](#lead_activities)
   - [reviews](#reviews)
   - [verification_cases](#verification_cases)
   - [consent_records](#consent_records)
   - [audit_logs](#audit_logs)
   - [media_assets](#media_assets)
   - [admin_users](#admin_users)
   - [location_cache](#location_cache)
4. [Cross-Table Relationships Diagram](#cross-table-relationships-diagram)
5. [Origin Mapping (TypeScript → SQL)](#origin-mapping-typescript--sql)

---

## Entity Relationship Overview

```
users ──1:N── children
users ──1:N── enquiries
users ──1:1── user_settings
users ──1:N── sessions
users ──1:N── favorites
users ──1:N── otp_codes
users ──1:N── reviews
users ──1:1── admin_users (subset)

children ──1:N── enquiries
children ──1:N── favorites (optional context)

academies ──1:N── academy_certifications
academies ──1:1── academy_achievement_signals
academies ──1:N── coaches
academies ──1:N── enquiries (target)
academies ──1:N── favorites

coaches ──1:N── coach_certifications
coaches ──1:N── enquiries (target)
coaches ──1:N── favorites

enquiries ──1:1── leads
leads ──1:N── lead_activities

sports ──1:N── competitions (via sport_slug)
```

---

## Enumerated Types

| Enum Name | Values |
|---|---|
| `user_role` | `'athlete'`, `'parent'`, `'coach'`, `'academy_rep'`, `'admin'` |
| `admin_role` | `'super_admin'`, `'ops_admin'`, `'lead_admin'`, `'analyst'`, `'support'` |
| `auth_provider` | `'credentials'`, `'google'`, `'phone'` |
| `theme_option` | `'midnight-ice'`, `'ember-orange'`, `'graphite-titanium'`, `'alpine-light'`, `'system'` |
| `verification_status` | `'unverified'`, `'pending'`, `'verified'`, `'rejected'` |
| `verification_case_status` | `'queued'`, `'under_review'`, `'needs_info'`, `'verified'`, `'rejected'` |
| `entity_status` | `'draft'`, `'published'`, `'suspended'` |
| `facility` | `'indoor'`, `'outdoor'`, `'ground'`, `'court'`, `'equipment'`, `'changing_room'`, `'parking'`, `'physio'`, `'gym'` |
| `training_level` | `'beginner'`, `'intermediate'`, `'advanced'`, `'elite'` |
| `sport_category` | `'team'`, `'individual'`, `'combat'`, `'racquet'`, `'aquatic'`, `'athletics'`, `'other'` |
| `sport_status` | `'published'`, `'draft'` |
| `competition_level` | `'district'`, `'state'`, `'national'`, `'international'` |
| `enquiry_target_type` | `'academy'`, `'coach'` |
| `enquiry_intent` | `'contact'`, `'callback'`, `'trial'`, `'enrollment_interest'` |
| `enquiry_status` | `'submitted'`, `'delivered'`, `'failed'`, `'bounced'` |
| `shortlist_item_type` | `'academy'`, `'coach'`, `'sport'` |
| `motion_preference` | `'reduced'`, `'full'` |
| `otp_method` | `'email'`, `'sms'`, `'whatsapp'` |
| `lead_source` | `'academy_detail'`, `'coach_detail'`, `'compare'`, `'shortlist'`, `'search'` |
| `lead_status` | `'new'`, `'contacted'`, `'qualified'`, `'trial_scheduled'`, `'converted'`, `'lost'` |
| `lead_actor_type` | `'system'`, `'admin'` |
| `lead_activity_type` | `'note'`, `'status_change'`, `'contact_attempt'`, `'whatsapp_sent'`, `'callback_logged'` |
| `review_target_type` | `'academy'`, `'coach'` |
| `moderation_status` | `'pending'`, `'approved'`, `'rejected'` |
| `consent_category` | `'analytics'`, `'marketing'`, `'whatsapp'` |
| `audit_action` | `'create'`, `'update'`, `'delete'`, `'verify'`, `'reject'`, `'suspend'`, `'restore'`, `'assign'`, `'status_change'` |
| `media_type` | `'image'`, `'document'` |
| `location_source` | `'gps'`, `'manual'`, `'ip'` |

---

## Table Schemas

### users

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `User.id` (`types/domain/user.ts:20`) |
| `role` | `user_role` | `NOT NULL` | — | `User.role: UserRole` (`types/domain/user.ts:3,21`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `User.name` (`types/domain/user.ts:22`) |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | — | `User.email` (`types/domain/user.ts:23`) |
| `phone` | `VARCHAR(20)` | — | — | `User.phone?` (`types/domain/user.ts:24`) |
| `phone_verified` | `BOOLEAN` | — | `false` | Derived from OTP verification flow |
| `email_verified` | `BOOLEAN` | — | `false` | Derived from OTP verification flow |
| `avatar` | `TEXT` | — | — | `User.avatar?` (`types/domain/user.ts:25`) |
| `auth_provider` | `auth_provider` | — | `'credentials'` | `User.authProvider?` (`types/domain/user.ts:26`) |
| `password_hash` | `VARCHAR(255)` | — | — | Derived from registration flow (`lib/api/auth.ts:4-9`) |
| `theme_preference` | `VARCHAR(50)` | — | `'midnight-ice'` | `User.themePreference?` (`types/domain/user.ts:29`) |
| `last_login_at` | `TIMESTAMPTZ` | — | — | `User.lastLoginAt?` (`types/domain/user.ts:27`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `User.createdAt` (`types/domain/user.ts:31`) |
| `updated_at` | `TIMESTAMPTZ` | — | `NOW()` | `User.updatedAt` (`types/domain/user.ts:32`) |

**Indexes:**
- `idx_users_email` ON (`email`)
- `idx_users_role` ON (`role`)

**TypeScript Source:** `types/domain/user.ts` — `User` interface (line 19–33)

---

### children

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Child.id` (`types/domain/user.ts:36`) |
| `parent_id` | `UUID` | `FOREIGN KEY → users(id) ON DELETE CASCADE, NOT NULL` | — | `Child.parentId` (`types/domain/user.ts:37`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Child.name` (`types/domain/user.ts:38`) |
| `age` | `INTEGER` | `NOT NULL, CHECK(age >= 3 AND age <= 18)` | — | `Child.age` (`types/domain/user.ts:39`) |
| `gender` | `ENUM('male','female','other','prefer_not_to_say')` | — | — | `Child.gender?` (`types/domain/user.ts:40`) |
| `sport_interests` | `TEXT[]` | — | — | `Child.sportInterests` (`types/domain/user.ts:41`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Child.createdAt` (`types/domain/user.ts:42`) |
| `updated_at` | `TIMESTAMPTZ` | — | `NOW()` | `Child.updatedAt` (`types/domain/user.ts:43`) |

**Indexes:**
- `idx_children_parent` ON (`parent_id`)

**Foreign Keys:**
- `parent_id` → `users(id)` ON DELETE CASCADE

**TypeScript Source:** `types/domain/user.ts` — `Child` interface (line 35–44)

---

### academies

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Academy.id` (`types/domain/academy.ts:35`) |
| `slug` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | — | `Academy.slug` (`types/domain/academy.ts:36`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Academy.name` (`types/domain/academy.ts:37`) |
| `description` | `TEXT` | — | — | `Academy.description` (`types/domain/academy.ts:38`) |
| `location_city` | `VARCHAR(255)` | `NOT NULL` | — | `Academy.location.city` (`types/domain/location.ts:7`) |
| `location_state` | `VARCHAR(255)` | `NOT NULL` | — | `Academy.location.state` (`types/domain/location.ts:8`) |
| `location_country` | `VARCHAR(255)` | — | `'India'` | `Academy.location.country` (`types/domain/location.ts:9`) |
| `location_address` | `TEXT` | — | — | `Academy.location.address?` (`types/domain/location.ts:6`) |
| `location_district` | `VARCHAR(255)` | — | — | `Academy.location.district?` (`types/domain/location.ts:10`) |
| `location_lat` | `DOUBLE PRECISION` | `NOT NULL` | — | `Academy.location.lat` (`types/domain/location.ts:11`) |
| `location_lng` | `DOUBLE PRECISION` | `NOT NULL` | — | `Academy.location.lng` (`types/domain/location.ts:12`) |
| `location_pincode` | `VARCHAR(20)` | — | — | `Academy.location.pincode?` (`types/domain/location.ts:13`) |
| `location_geohash` | `VARCHAR(20)` | — | — | `Academy.location.geohash?` (`types/domain/location.ts:14`) |
| `contact_phone` | `VARCHAR(20)` | — | — | `Academy.contact.phone?` (`types/domain/academy.ts:41`) |
| `contact_email` | `VARCHAR(255)` | — | — | `Academy.contact.email?` (`types/domain/academy.ts:42`) |
| `contact_website` | `TEXT` | — | — | `Academy.contact.website?` (`types/domain/academy.ts:43`) |
| `sports_offered` | `TEXT[]` | — | — | `Academy.sportsOffered` (`types/domain/academy.ts:45`) |
| `facilities` | `TEXT[]` | — | — | `Academy.facilities: Facility[]` (`types/domain/academy.ts:7-16,46`) |
| `training_levels` | `TEXT[]` | — | — | `Academy.trainingLevels: TrainingLevel[]` (`types/domain/academy.ts:18,47`) |
| `age_range_min` | `INTEGER` | — | — | `Academy.ageRange?.min` (`types/domain/academy.ts:48`) |
| `age_range_max` | `INTEGER` | — | — | `Academy.ageRange?.max` (`types/domain/academy.ts:48`) |
| `batch_information` | `TEXT` | — | — | `Academy.batchInformation?` (`types/domain/academy.ts:49`) |
| `verification_status` | `verification_status` | — | `'unverified'` | `Academy.verificationStatus` (`types/domain/academy.ts:4,51`) |
| `status` | `entity_status` | — | `'published'` | `Academy.status: AcademyStatus` (`types/domain/academy.ts:5,57`) |
| `rating_average` | `DOUBLE PRECISION` | — | `0` | `Academy.rating.average` (`types/domain/common.ts:2`) |
| `rating_count` | `INTEGER` | — | `0` | `Academy.rating.count` (`types/domain/common.ts:3`) |
| `cover_image` | `TEXT` | — | — | `Academy.coverImage?` (`types/domain/academy.ts:55`) |
| `gallery` | `TEXT[]` | — | — | `Academy.gallery` (`types/domain/academy.ts:56`) |
| `last_updated_at` | `TIMESTAMPTZ` | — | — | `Academy.lastUpdatedAt` (`types/domain/academy.ts:58`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Academy.createdAt` (`types/domain/academy.ts:59`) |
| `indexed_at` | `TIMESTAMPTZ` | — | — | `Academy.indexedAt?` (`types/domain/academy.ts:60`) |

**Indexes:**
- `idx_academies_slug` ON (`slug`)
- `idx_academies_city` ON (`location_city`)
- `idx_academies_sport` USING GIN (`sports_offered`)

**TypeScript Source:** `types/domain/academy.ts` — `Academy` interface (line 34–61), `types/domain/location.ts` — `LocationSummary` (line 5–15), `types/domain/common.ts` — `Rating` (line 1–4)

---

### coaches

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Coach.id` (`types/domain/coach.ts:8`) |
| `slug` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | — | `Coach.slug` (`types/domain/coach.ts:9`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Coach.name` (`types/domain/coach.ts:10`) |
| `avatar` | `TEXT` | — | — | `Coach.avatar?` (`types/domain/coach.ts:11`) |
| `experience_years` | `INTEGER` | `NOT NULL` | — | `Coach.experienceYears` (`types/domain/coach.ts:13`) |
| `sports_coached` | `TEXT[]` | — | — | `Coach.sportsCoached` (`types/domain/coach.ts:14`) |
| `specialization` | `TEXT[]` | — | — | `Coach.specialization` (`types/domain/coach.ts:15`) |
| `academy_id` | `UUID` | `FOREIGN KEY → academies(id) ON DELETE SET NULL` | — | `Coach.academyId?` (`types/domain/coach.ts:16`) |
| `location_city` | `VARCHAR(255)` | `NOT NULL` | — | `Coach.location.city` (`types/domain/location.ts:7`) |
| `location_state` | `VARCHAR(255)` | `NOT NULL` | — | `Coach.location.state` (`types/domain/location.ts:8`) |
| `location_country` | `VARCHAR(255)` | — | `'India'` | `Coach.location.country` (`types/domain/location.ts:9`) |
| `location_lat` | `DOUBLE PRECISION` | `NOT NULL` | — | `Coach.location.lat` (`types/domain/location.ts:11`) |
| `location_lng` | `DOUBLE PRECISION` | `NOT NULL` | — | `Coach.location.lng` (`types/domain/location.ts:12`) |
| `contact_phone` | `VARCHAR(20)` | — | — | `Coach.contact.phone?` (`types/domain/coach.ts:19`) |
| `contact_email` | `VARCHAR(255)` | — | — | `Coach.contact.email?` (`types/domain/coach.ts:20`) |
| `verification_status` | `verification_status` | — | `'unverified'` | `Coach.verificationStatus` (`types/domain/academy.ts:4, coach.ts:22`) |
| `status` | `entity_status` | — | `'published'` | `Coach.status: CoachStatus` (`types/domain/coach.ts:5,24`) |
| `rating_average` | `DOUBLE PRECISION` | — | `0` | `Coach.rating.average` (`types/domain/common.ts:2`) |
| `rating_count` | `INTEGER` | — | `0` | `Coach.rating.count` (`types/domain/common.ts:3`) |
| `last_updated_at` | `TIMESTAMPTZ` | — | — | `Coach.lastUpdatedAt` (`types/domain/coach.ts:25`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Coach.createdAt` (`types/domain/coach.ts:26`) |

**Indexes:**
- `idx_coaches_slug` ON (`slug`)
- `idx_coaches_academy` ON (`academy_id`)

**Foreign Keys:**
- `academy_id` → `academies(id)` ON DELETE SET NULL

**TypeScript Source:** `types/domain/coach.ts` — `Coach` interface (line 7–27)

---

### coach_certifications

Normalized from `Coach.certifications: Certification[]`.

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | — |
| `coach_id` | `UUID` | `FOREIGN KEY → coaches(id), NOT NULL` | — | `Coach.certifications[i]` belong to coach |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Certification.name` (`types/domain/academy.ts:21`) |
| `issuer` | `VARCHAR(255)` | `NOT NULL` | — | `Certification.issuer` (`types/domain/academy.ts:22`) |
| `year` | `INTEGER` | `NOT NULL` | — | `Certification.year` (`types/domain/academy.ts:23`) |
| `document_url` | `TEXT` | — | — | `Certification.documentUrl?` (`types/domain/academy.ts:24`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/academy.ts` — `Certification` interface (line 20–25)

---

### academy_certifications

Normalized from `Academy.certifications: Certification[]`.

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | — |
| `academy_id` | `UUID` | `FOREIGN KEY → academies(id), NOT NULL` | — | `Academy.certifications[i]` belong to academy |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Certification.name` (`types/domain/academy.ts:21`) |
| `issuer` | `VARCHAR(255)` | `NOT NULL` | — | `Certification.issuer` (`types/domain/academy.ts:22`) |
| `year` | `INTEGER` | `NOT NULL` | — | `Certification.year` (`types/domain/academy.ts:23`) |
| `document_url` | `TEXT` | — | — | `Certification.documentUrl?` (`types/domain/academy.ts:24`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/academy.ts` — `Certification` interface (line 20–25)

---

### academy_achievement_signals

Normalized from `Academy.achievementSignals: AchievementSignals`.

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | — |
| `academy_id` | `UUID` | `FOREIGN KEY → academies(id), UNIQUE, NOT NULL` | — | — |
| `state_athletes_produced` | `INTEGER` | — | `0` | `AchievementSignals.stateAthletesProduced` (`types/domain/academy.ts:28`) |
| `national_athletes_produced` | `INTEGER` | — | `0` | `AchievementSignals.nationalAthletesProduced` (`types/domain/academy.ts:29`) |
| `competition_participations` | `TEXT[]` | — | — | `AchievementSignals.competitionParticipations` (`types/domain/academy.ts:30`) |
| `milestones` | `TEXT[]` | — | — | `AchievementSignals.milestones` (`types/domain/academy.ts:31`) |
| `updated_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/academy.ts` — `AchievementSignals` interface (line 27–32)

---

### enquiries

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Enquiry.id` (`types/domain/enquiry.ts:12`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id) ON DELETE SET NULL` | — | `Enquiry.userId?` (`types/domain/enquiry.ts:13`) |
| `child_id` | `UUID` | `FOREIGN KEY → children(id) ON DELETE SET NULL` | — | `Enquiry.childId?` (`types/domain/enquiry.ts:14`) |
| `target_type` | `enquiry_target_type` | `NOT NULL` | — | `Enquiry.targetType` (`types/domain/enquiry.ts:1,15`) |
| `target_id` | `UUID` | `NOT NULL` | — | `Enquiry.targetId` (`types/domain/enquiry.ts:16`) |
| `intent` | `enquiry_intent` | `NOT NULL` | — | `Enquiry.intent` (`types/domain/enquiry.ts:3-7,17`) |
| `parent_name` | `VARCHAR(255)` | `NOT NULL` | — | `Enquiry.parentInfo.name` (`types/domain/enquiry.ts:19`) |
| `parent_email` | `VARCHAR(255)` | `NOT NULL` | — | `Enquiry.parentInfo.email` (`types/domain/enquiry.ts:20`) |
| `parent_phone` | `VARCHAR(20)` | `NOT NULL` | — | `Enquiry.parentInfo.phone` (`types/domain/enquiry.ts:21`) |
| `child_name` | `VARCHAR(255)` | — | — | `Enquiry.childInfo?.name` (`types/domain/enquiry.ts:24`) |
| `child_age` | `INTEGER` | — | — | `Enquiry.childInfo?.age` (`types/domain/enquiry.ts:25`) |
| `sport_interest` | `VARCHAR(255)` | `NOT NULL` | — | `Enquiry.sportInterest` (`types/domain/enquiry.ts:27`) |
| `message` | `TEXT` | — | — | `Enquiry.message?` (`types/domain/enquiry.ts:28`) |
| `status` | `enquiry_status` | — | `'submitted'` | `Enquiry.status` (`types/domain/enquiry.ts:9,29`) |
| `delivery_attempts` | `INTEGER` | — | `0` | `Enquiry.deliveryAttempts` (`types/domain/enquiry.ts:30`) |
| `last_delivery_at` | `TIMESTAMPTZ` | — | — | `Enquiry.lastDeliveryAt?` (`types/domain/enquiry.ts:31`) |
| `failure_reason` | `TEXT` | — | — | `Enquiry.failureReason?` (`types/domain/enquiry.ts:32`) |
| `whatsapp_confirmation_sent` | `BOOLEAN` | — | `false` | `Enquiry.whatsappConfirmationSent` (`types/domain/enquiry.ts:33`) |
| `whatsapp_message_id` | `VARCHAR(255)` | — | — | `Enquiry.whatsappMessageId?` (`types/domain/enquiry.ts:34`) |
| `lead_id` | `UUID` | — | — | `Enquiry.leadId?` (`types/domain/enquiry.ts:35`) |
| `ip_hash` | `VARCHAR(64)` | — | — | `Enquiry.ipHash?` (`types/domain/enquiry.ts:36`) |
| `user_agent_hash` | `VARCHAR(64)` | — | — | `Enquiry.userAgentHash?` (`types/domain/enquiry.ts:37`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Enquiry.createdAt` (`types/domain/enquiry.ts:38`) |

**Foreign Keys:**
- `user_id` → `users(id)` ON DELETE SET NULL
- `child_id` → `children(id)` ON DELETE SET NULL

**TypeScript Source:** `types/domain/enquiry.ts` — `Enquiry` interface (line 11–39)

---

### favorites

Maps to frontend `ShortlistItem`.

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `ShortlistItem.id` (`types/domain/shortlist.ts:4`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id), NOT NULL` | — | `ShortlistItem.userId` (`types/domain/shortlist.ts:5`) |
| `context_child_id` | `UUID` | `FOREIGN KEY → children(id)` | — | `ShortlistItem.contextChildId?` (`types/domain/shortlist.ts:6`) |
| `item_type` | `shortlist_item_type` | `NOT NULL` | — | `ShortlistItem.itemType` (`types/domain/shortlist.ts:1,7`) |
| `item_id` | `UUID` | `NOT NULL` | — | `ShortlistItem.itemId` (`types/domain/shortlist.ts:8`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `ShortlistItem.createdAt` (`types/domain/shortlist.ts:9`) |

**Constraints:**
- `UNIQUE(user_id, item_type, item_id, context_child_id)`

**Indexes:**
- `idx_favorites_user` ON (`user_id`)

**TypeScript Source:** `types/domain/shortlist.ts` — `ShortlistItem` interface (line 3–10)

---

### user_settings

Stores all frontend user preferences in JSONB columns.

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | — |
| `user_id` | `UUID` | `FOREIGN KEY → users(id), UNIQUE, NOT NULL` | — | — |
| `preferences` | `JSONB` | — | `'{}'` | `User.preferences?: UserPreferences` (`types/domain/user.ts:28`) |
| `notification_settings` | `JSONB` | — | `'{}'` | Populated by frontend settings UI |
| `privacy_settings` | `JSONB` | — | `'{}'` | Populated by frontend settings UI |
| `motion_preference` | `motion_preference` | — | `'full'` | Frontend accessibility setting |
| `location_radius` | `INTEGER` | — | `5` | `UserPreferences.defaultRadiusKm?: Radius` (`types/domain/user.ts:9`, `types/domain/location.ts:1`) |
| `consent_analytics` | `BOOLEAN` | — | `false` | `ConsentFlags.analytics` (`types/domain/user.ts:14`) |
| `consent_marketing` | `BOOLEAN` | — | `false` | `ConsentFlags.marketing` (`types/domain/user.ts:15`) |
| `consent_whatsapp` | `BOOLEAN` | — | `false` | `ConsentFlags.whatsapp` (`types/domain/user.ts:16`) |
| `updated_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/user.ts` — `UserPreferences` (line 7–11), `ConsentFlags` (line 13–17), `User.consent?` (line 30)

---

### otp_codes

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | — |
| `user_id` | `UUID` | `FOREIGN KEY → users(id)` | — | — |
| `method` | `otp_method` | `NOT NULL` | — | `SendOtpRequest.method` (`lib/api/auth.ts:27`) |
| `destination` | `VARCHAR(255)` | `NOT NULL` | — | `SendOtpRequest.destination` (`lib/api/auth.ts:28`) |
| `code_hash` | `VARCHAR(255)` | `NOT NULL` | — | Hashed from OTP code |
| `attempts` | `INTEGER` | — | `0` | — |
| `max_attempts` | `INTEGER` | — | `5` | — |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | — | `SendOtpResponse.expiresAt` (`lib/api/auth.ts:32`) |
| `verified_at` | `TIMESTAMPTZ` | — | — | Set when `VerifyOtpResponse.verified` is true |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**Indexes:**
- `idx_otp_destination` ON (`destination`)

**TypeScript Source:** `lib/api/auth.ts` — `SendOtpRequest` (line 26–29), `SendOtpResponse` (line 31–34), `VerifyOtpRequest` (line 36–40), `VerifyOtpResponse` (line 42–45)

---

### sessions

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Session.id` (`types/domain/session.ts:2`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id), NOT NULL` | — | `Session.userId` (`types/domain/session.ts:3`) |
| `refresh_token_hash` | `VARCHAR(255)` | — | — | `Session.refreshTokenHash` (`types/domain/session.ts:4`) |
| `device_info` | `TEXT` | — | — | `Session.deviceInfo?` (`types/domain/session.ts:5`) |
| `ip_hash` | `VARCHAR(64)` | — | — | `Session.ipHash?` (`types/domain/session.ts:6`) |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | — | `Session.expiresAt` (`types/domain/session.ts:7`) |
| `revoked_at` | `TIMESTAMPTZ` | — | — | `Session.revokedAt?` (`types/domain/session.ts:8`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Session.createdAt` (`types/domain/session.ts:9`) |

**TypeScript Source:** `types/domain/session.ts` — `Session` interface (line 1–10)

---

### sports

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Sport.id` (`types/domain/sport.ts:27`) |
| `slug` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | — | `Sport.slug` (`types/domain/sport.ts:28`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Sport.name` (`types/domain/sport.ts:29`) |
| `description` | `TEXT` | — | — | `Sport.description` (`types/domain/sport.ts:30`) |
| `icon` | `TEXT` | — | — | `Sport.icon?` (`types/domain/sport.ts:31`) |
| `cover_image` | `TEXT` | — | — | `Sport.coverImage?` (`types/domain/sport.ts:32`) |
| `category` | `sport_category` | `NOT NULL` | — | `Sport.category` (`types/domain/sport.ts:1-8,33`) |
| `status` | `sport_status` | — | `'published'` | `Sport.status` (`types/domain/sport.ts:10,36`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/sport.ts` — `Sport` interface (line 26–37)

**Seed Data:** `data/sports.ts` provides 20 sports (cricket, football, badminton, tennis, table-tennis, swimming, athletics, wrestling, boxing, karate, judo, kabaddi, hockey, chess, skating, archery, shooting, yoga, gymnastics, basketball).

---

### competitions

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Competition.id` (`types/domain/competition.ts:4`) |
| `sport_slug` | `VARCHAR(255)` | `NOT NULL` | — | `Competition.sportSlug` (`types/domain/competition.ts:5`) |
| `name` | `VARCHAR(255)` | `NOT NULL` | — | `Competition.name` (`types/domain/competition.ts:6`) |
| `level` | `competition_level` | `NOT NULL` | — | `Competition.level` (`types/domain/competition.ts:1,7`) |
| `organiser` | `VARCHAR(255)` | `NOT NULL` | — | `Competition.organiser` (`types/domain/competition.ts:8`) |
| `what_is` | `TEXT` | — | — | `Competition.whatIs` (`types/domain/competition.ts:9`) |
| `why_important` | `TEXT` | — | — | `Competition.whyImportant` (`types/domain/competition.ts:10`) |
| `progression` | `TEXT` | — | — | `Competition.progression` (`types/domain/competition.ts:11`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | — |

**TypeScript Source:** `types/domain/competition.ts` — `Competition` interface (line 3–12)

**Seed Data:** `data/competitions.ts` provides competitions across all sports.

---

### leads

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Lead.id` (`types/domain/lead.ts:28`) |
| `enquiry_id` | `UUID` | `FOREIGN KEY → enquiries(id), NOT NULL` | — | `Lead.enquiryId` (`types/domain/lead.ts:29`) |
| `source` | `lead_source` | `NOT NULL` | — | `Lead.source` (`types/domain/lead.ts:1-6,30`) |
| `owner_type` | `lead_owner_type` | `NOT NULL` | — | `Lead.ownerType` (`types/domain/lead.ts:16,31`) |
| `owner_id` | `UUID` | `NOT NULL` | — | `Lead.ownerId` (`types/domain/lead.ts:32`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id)` | — | `Lead.userId?` (`types/domain/lead.ts:33`) |
| `child_id` | `UUID` | `FOREIGN KEY → children(id)` | — | `Lead.childId?` (`types/domain/lead.ts:34`) |
| `status` | `lead_status` | `NOT NULL` | — | `Lead.status` (`types/domain/lead.ts:8-14,35`) |
| `assigned_to` | `UUID` | — | — | `Lead.assignedTo?` (`types/domain/lead.ts:36`) |
| `last_activity_at` | `TIMESTAMPTZ` | — | — | `Lead.lastActivityAt` (`types/domain/lead.ts:37`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Lead.createdAt` (`types/domain/lead.ts:38`) |
| `updated_at` | `TIMESTAMPTZ` | — | `NOW()` | `Lead.updatedAt` (`types/domain/lead.ts:39`) |

**TypeScript Source:** `types/domain/lead.ts` — `Lead` interface (line 27–40)

---

### lead_activities

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `LeadActivity.id` (`types/domain/lead.ts:43`) |
| `lead_id` | `UUID` | `FOREIGN KEY → leads(id), NOT NULL` | — | `LeadActivity.leadId` (`types/domain/lead.ts:44`) |
| `actor_type` | `lead_actor_type` | `NOT NULL` | — | `LeadActivity.actorType` (`types/domain/lead.ts:18,45`) |
| `actor_id` | `UUID` | — | — | `LeadActivity.actorId?` (`types/domain/lead.ts:46`) |
| `type` | `lead_activity_type` | `NOT NULL` | — | `LeadActivity.type` (`types/domain/lead.ts:19-25,47`) |
| `payload` | `JSONB` | — | — | `LeadActivity.payload` (`types/domain/lead.ts:48`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `LeadActivity.createdAt` (`types/domain/lead.ts:49`) |

**TypeScript Source:** `types/domain/lead.ts` — `LeadActivity` interface (line 42–50)

---

### reviews

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `Review.id` (`types/domain/review.ts:6`) |
| `target_type` | `review_target_type` | `NOT NULL` | — | `Review.targetType` (`types/domain/review.ts:1,7`) |
| `target_id` | `UUID` | `NOT NULL` | — | `Review.targetId` (`types/domain/review.ts:8`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id), NOT NULL` | — | `Review.userId` (`types/domain/review.ts:9`) |
| `rating` | `SMALLINT` | `CHECK(rating >= 1 AND rating <= 5)` | — | `Review.rating` (`types/domain/review.ts:10`) |
| `text` | `TEXT` | `NOT NULL` | — | `Review.text` (`types/domain/review.ts:11`) |
| `moderation_status` | `moderation_status` | — | `'pending'` | `Review.moderationStatus` (`types/domain/review.ts:3,13`) |
| `moderator_id` | `UUID` | — | — | `Review.moderatorId?` (`types/domain/review.ts:14`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `Review.createdAt` (`types/domain/review.ts:12`) |

**TypeScript Source:** `types/domain/review.ts` — `Review` interface (line 5–15)

---

### verification_cases

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `VerificationCase.id` (`types/domain/verification.ts:12`) |
| `target_type` | `ENUM('academy','coach')` | `NOT NULL` | — | `VerificationCase.targetType` (`types/domain/verification.ts:13`) |
| `target_id` | `UUID` | `NOT NULL` | — | `VerificationCase.targetId` (`types/domain/verification.ts:14`) |
| `status` | `verification_case_status` | — | `'queued'` | `VerificationCase.status` (`types/domain/verification.ts:4-9,15`) |
| `submitted_at` | `TIMESTAMPTZ` | — | — | `VerificationCase.submittedAt` (`types/domain/verification.ts:16`) |
| `assigned_to` | `UUID` | — | — | `VerificationCase.assignedTo?` (`types/domain/verification.ts:17`) |
| `decided_at` | `TIMESTAMPTZ` | — | — | `VerificationCase.decidedAt?` (`types/domain/verification.ts:18`) |
| `reviewer_notes` | `TEXT` | — | — | `VerificationCase.reviewerNotes?` (`types/domain/verification.ts:20`) |
| `decision_reason` | `TEXT` | — | — | `VerificationCase.decisionReason?` (`types/domain/verification.ts:21`) |
| `audit_log_id` | `UUID` | — | — | `VerificationCase.auditLogId?` (`types/domain/verification.ts:22`) |

**TypeScript Source:** `types/domain/verification.ts` — `VerificationCase` interface (line 11–23)

---

### consent_records

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `ConsentRecord.id` (`types/domain/consent.ts:4`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id)` | — | `ConsentRecord.userId?` (`types/domain/consent.ts:5`) |
| `session_id` | `UUID` | `FOREIGN KEY → sessions(id)` | — | `ConsentRecord.sessionId?` (`types/domain/consent.ts:6`) |
| `category` | `consent_category` | `NOT NULL` | — | `ConsentRecord.category` (`types/domain/consent.ts:1,7`) |
| `granted` | `BOOLEAN` | `NOT NULL` | — | `ConsentRecord.granted` (`types/domain/consent.ts:8`) |
| `version` | `VARCHAR(50)` | `NOT NULL` | — | `ConsentRecord.version` (`types/domain/consent.ts:9`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `ConsentRecord.createdAt` (`types/domain/consent.ts:10`) |

**TypeScript Source:** `types/domain/consent.ts` — `ConsentRecord` interface (line 3–11)

---

### audit_logs

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `AuditLog.id` (`types/domain/audit.ts:13`) |
| `actor_id` | `UUID` | `NOT NULL` | — | `AuditLog.actorId` (`types/domain/audit.ts:14`) |
| `actor_role` | `VARCHAR(50)` | `NOT NULL` | — | `AuditLog.actorRole` (`types/domain/audit.ts:15`) |
| `entity_type` | `VARCHAR(50)` | `NOT NULL` | — | `AuditLog.entityType` (`types/domain/audit.ts:16`) |
| `entity_id` | `UUID` | `NOT NULL` | — | `AuditLog.entityId` (`types/domain/audit.ts:17`) |
| `action` | `audit_action` | `NOT NULL` | — | `AuditLog.action` (`types/domain/audit.ts:1-10,18`) |
| `diff` | `JSONB` | — | — | `AuditLog.diff?` (`types/domain/audit.ts:19-22`) |
| `ip` | `VARCHAR(45)` | — | — | `AuditLog.ip?` (`types/domain/audit.ts:23`) |
| `user_agent` | `TEXT` | — | — | `AuditLog.userAgent?` (`types/domain/audit.ts:24`) |
| `reason` | `TEXT` | — | — | `AuditLog.reason?` (`types/domain/audit.ts:25`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `AuditLog.createdAt` (`types/domain/audit.ts:26`) |

**TypeScript Source:** `types/domain/audit.ts` — `AuditLog` interface (line 12–27)

---

### media_assets

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `MediaAsset.id` (`types/domain/media.ts:4`) |
| `owner_type` | `VARCHAR(50)` | `NOT NULL` | — | `MediaAsset.ownerType` (`types/domain/media.ts:5`) |
| `owner_id` | `UUID` | `NOT NULL` | — | `MediaAsset.ownerId` (`types/domain/media.ts:6`) |
| `type` | `media_type` | `NOT NULL` | — | `MediaAsset.type` (`types/domain/media.ts:3,7`) |
| `url` | `TEXT` | `NOT NULL` | — | `MediaAsset.url` (`types/domain/media.ts:8`) |
| `mime` | `VARCHAR(127)` | `NOT NULL` | — | `MediaAsset.mime` (`types/domain/media.ts:9`) |
| `size` | `INTEGER` | `NOT NULL` | — | `MediaAsset.size` (`types/domain/media.ts:10`) |
| `width` | `INTEGER` | — | — | `MediaAsset.width?` (`types/domain/media.ts:11`) |
| `height` | `INTEGER` | — | — | `MediaAsset.height?` (`types/domain/media.ts:12`) |
| `alt_text` | `TEXT` | — | — | `MediaAsset.altText?` (`types/domain/media.ts:13`) |
| `checksum` | `VARCHAR(64)` | `NOT NULL` | — | `MediaAsset.checksum` (`types/domain/media.ts:14`) |
| `created_at` | `TIMESTAMPTZ` | — | `NOW()` | `MediaAsset.createdAt` (`types/domain/media.ts:15`) |

**TypeScript Source:** `types/domain/media.ts` — `MediaAsset` interface (line 3–16)

---

### admin_users

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | — | `AdminUser.id` (`types/domain/user.ts:47`) |
| `user_id` | `UUID` | `FOREIGN KEY → users(id), NOT NULL` | — | `AdminUser.userId` (`types/domain/user.ts:48`) |
| `role` | `admin_role` | `NOT NULL` | — | `AdminUser.role` (`types/domain/user.ts:5,49`) |
| `scopes` | `TEXT[]` | — | — | `AdminUser.scopes?` (`types/domain/user.ts:50`) |
| `is_active` | `BOOLEAN` | — | `true` | `AdminUser.isActive` (`types/domain/user.ts:51`) |
| `last_active_at` | `TIMESTAMPTZ` | — | — | `AdminUser.lastActiveAt?` (`types/domain/user.ts:52`) |

**TypeScript Source:** `types/domain/user.ts` — `AdminUser` interface (line 46–53)

---

### location_cache

| Column | Type | Constraints | Default | Frontend Origin |
|---|---|---|---|---|
| `user_id` | `UUID` | `PRIMARY KEY, FOREIGN KEY → users(id)` | — | `LocationCache.userId` (`types/domain/location.ts:18`) |
| `lat` | `DOUBLE PRECISION` | `NOT NULL` | — | `LocationCache.lat` (`types/domain/location.ts:19`) |
| `lng` | `DOUBLE PRECISION` | `NOT NULL` | — | `LocationCache.lng` (`types/domain/location.ts:20`) |
| `city` | `VARCHAR(255)` | `NOT NULL` | — | `LocationCache.city` (`types/domain/location.ts:21`) |
| `state` | `VARCHAR(255)` | `NOT NULL` | — | `LocationCache.state` (`types/domain/location.ts:22`) |
| `source` | `location_source` | `NOT NULL` | — | `LocationCache.source` (`types/domain/location.ts:23`) |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL` | — | `LocationCache.updatedAt` (`types/domain/location.ts:24`) |

**TypeScript Source:** `types/domain/location.ts` — `LocationCache` interface (line 17–25)

---

## Cross-Table Relationships Diagram

```
┌───────────────────┐          ┌──────────────────────┐
│      users        │1──1──────│    user_settings     │
│                   │1──1──────│   admin_users        │
│                   │1──1──────│   location_cache      │
│                   │1──N──────│   children            │
│                   │1──N──────│   sessions            │
│                   │1──N──────│   otp_codes           │
│                   │1──N──────│   enquiries           │
│                   │1──N──────│   favorites           │
│                   │1──N──────│   reviews             │
│                   │1──N──────│   consent_records     │
└───────────────────┘          └──────────────────────┘
        │
        │ 1:N
        ▼
┌───────────────────┐          ┌──────────────────────────┐
│    children       │1──N──────│     enquiries             │
│                   │1──N──────│     favorites              │
└───────────────────┘          └──────────────────────────┘

┌───────────────────┐          ┌──────────────────────────────┐
│    academies      │1──N──────│   academy_certifications      │
│                   │1──1──────│   academy_achievement_signals  │
│                   │1──N──────│   coaches                     │
│                   │1──N──────│   favorites (item_type='academy') │
│                   │1──N──────│   enquiries (target_type='academy') │
└───────────────────┘          └──────────────────────────────┘

┌───────────────────┐          ┌──────────────────────────┐
│     coaches       │1──N──────│   coach_certifications   │
│                   │1──N──────│   favorites (item_type='coach') │
│                   │1──N──────│   enquiries (target_type='coach') │
└───────────────────┘          └──────────────────────────┘

┌───────────────────┐          ┌──────────────────────┐
│    enquiries      │1──1──────│       leads            │
└───────────────────┘          └──────────────────────┘

┌───────────────────┐          ┌───────────────────────────┐
│      leads        │1──N──────│     lead_activities        │
└───────────────────┘          └───────────────────────────┘

┌───────────────────┐          ┌──────────────────────┐
│     sports        │1──N──────│    competitions        │
│                   │ (via     │                        │
│                   │ sport_slug)                      │
└───────────────────┘          └──────────────────────┘
```

---

## Origin Mapping (TypeScript → SQL)

### Domain Models

| Domain File | Exported Types | SQL Tables Mapped |
|---|---|---|
| `types/domain/user.ts` | `User`, `Child`, `AdminUser`, `UserPreferences`, `ConsentFlags` | `users`, `children`, `admin_users`, `user_settings` |
| `types/domain/academy.ts` | `Academy`, `Certification`, `AchievementSignals`, `Facility`, `TrainingLevel`, `VerificationStatus`, `VerificationEvidence` | `academies`, `academy_certifications`, `academy_achievement_signals` |
| `types/domain/coach.ts` | `Coach` | `coaches`, `coach_certifications` |
| `types/domain/sport.ts` | `Sport`, `CompetitionPathway`, `ExplorationGuidance` | `sports` |
| `types/domain/competition.ts` | `Competition` | `competitions` |
| `types/domain/enquiry.ts` | `Enquiry` | `enquiries` |
| `types/domain/shortlist.ts` | `ShortlistItem` | `favorites` |
| `types/domain/session.ts` | `Session` | `sessions` |
| `types/domain/location.ts` | `LocationSummary`, `LocationCache` | Embedded in `academies`, `coaches`; `location_cache` |
| `types/domain/common.ts` | `Rating`, `Pagination`, `SortOption` | Embedded as `rating_average`/`rating_count` in `academies`, `coaches` |
| `types/domain/lead.ts` | `Lead`, `LeadActivity` | `leads`, `lead_activities` |
| `types/domain/review.ts` | `Review` | `reviews` |
| `types/domain/verification.ts` | `VerificationCase` | `verification_cases` |
| `types/domain/consent.ts` | `ConsentRecord` | `consent_records` |
| `types/domain/audit.ts` | `AuditLog` | `audit_logs` |
| `types/domain/media.ts` | `MediaAsset` | `media_assets` |
| `types/domain/onboarding.ts` | `OnboardingState`, `AthleteOnboardingData`, `ParentOnboardingData` | Transient (not persisted to DB) |

### API Layer

| API File | Exported Types | Relevant Tables |
|---|---|---|
| `lib/api/auth.ts` | `RegisterRequest/Response`, `LoginRequest/Response`, `SendOtpRequest/Response`, `VerifyOtpRequest/Response` | `users`, `sessions`, `otp_codes` |

### Seed Data

| Data File | Entity Count | Target Table |
|---|---|---|
| `data/sports.ts` | 20 sports | `sports` |
| `data/competitions.ts` | ~75 competitions across all sports | `competitions` |
| `data/academies.ts` | 12 academies | `academies`, `academy_certifications`, `academy_achievement_signals` |
| `data/coaches.ts` | 8 coaches | `coaches`, `coach_certifications` |

### Enum Flow

```
UserRole ('athlete'|'parent'|'coach'|'academy_rep'|'admin')
  → users.role ENUM

AuthProvider ('credentials'|'google'|'phone')
  → users.auth_provider ENUM

VerificationStatus ('unverified'|'pending'|'verified'|'rejected')
  → academies.verification_status
  → coaches.verification_status
  (shared type re-exported from academy.ts:4)

Facility ('indoor'|'outdoor'|'ground'|'court'|'equipment'|'changing_room'|'parking'|'physio'|'gym')
  → academies.facilities TEXT[] (domain-type-checked at application layer)

TrainingLevel ('beginner'|'intermediate'|'advanced'|'elite')
  → academies.training_levels TEXT[]

SportCategory ('team'|'individual'|'combat'|'racquet'|'aquatic'|'athletics'|'other')
  → sports.category ENUM

CompetitionLevel ('district'|'state'|'national'|'international')
  → competitions.level ENUM

EnquiryIntent ('contact'|'callback'|'trial'|'enrollment_interest')
  → enquiries.intent ENUM

EnquiryStatus ('submitted'|'delivered'|'failed'|'bounced')
  → enquiries.status ENUM

ShortlistItemType ('academy'|'coach'|'sport')
  → favorites.item_type ENUM

ConsentCategory ('analytics'|'marketing'|'whatsapp')
  → consent_records.category ENUM

AuditAction ('create'|'update'|'delete'|'verify'|'reject'|'suspend'|'restore'|'assign'|'status_change')
  → audit_logs.action ENUM
```

### JSONB Usage

| Table | Column | Stored Shape | Source |
|---|---|---|---|
| `user_settings` | `preferences` | `UserPreferences { location?: LocationSummary, defaultRadiusKm?: Radius, defaultSportInterests?: string[] }` | `types/domain/user.ts:7-11` |
| `user_settings` | `notification_settings` | Free-form notification preferences | Frontend settings UI |
| `user_settings` | `privacy_settings` | Free-form privacy preferences | Frontend settings UI |
| `lead_activities` | `payload` | `Record<string, unknown>` | `types/domain/lead.ts:48` |
| `audit_logs` | `diff` | `{ before: Record<string, unknown>, after: Record<string, unknown> }` | `types/domain/audit.ts:19-22` |

### Array Columns

| Table | Column | Element Type | Cardinality Hint |
|---|---|---|---|
| `children` | `sport_interests` | sport slugs | ~1-5 per child |
| `academies` | `sports_offered` | sport slugs | ~1-3 per academy |
| `academies` | `facilities` | facility enum values | ~3-9 per academy |
| `academies` | `training_levels` | training level enum | ~1-4 per academy |
| `academies` | `gallery` | image URLs | ~0-10 per academy |
| `academies` | `competition_participations` | competition names | ~0-20 per academy |
| `academies` | `milestones` | milestone strings | ~0-10 per academy |
| `coaches` | `sports_coached` | sport slugs | ~1-3 per coach |
| `coaches` | `specialization` | specialization strings | ~2-5 per coach |
| `admin_users` | `scopes` | scope strings | ~0-20 per admin |

---

## Summary

**Total tables:** 23  
**Total views/enums:** 22 enumerated types  
**Total foreign key relationships:** 20+  
**Total indexed columns:** 8 defined indexes (more implicit via PK/UNIQUE)

| Category | Count |
|---|---|
| Core domain tables | 14 (`users`, `children`, `academies`, `coaches`, `sports`, `competitions`, `enquiries`, `favorites`, `user_settings`, `otp_codes`, `sessions`, `reviews`, `leads`, `lead_activities`) |
| Normalized sub-tables | 4 (`coach_certifications`, `academy_certifications`, `academy_achievement_signals`, `consent_records`) |
| Infrastructure tables | 5 (`verification_cases`, `audit_logs`, `media_assets`, `admin_users`, `location_cache`) |
| Seed data tables | 4 (`sports`, `competitions`, `academies` + children, `coaches` + children) |
| Transient (no DB) | 1 (`onboarding` — used only during registration flow) |
