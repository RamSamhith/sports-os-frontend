# SportsOS — Entity Relationship Document

> Generated from `types/domain/` type definitions and `lib/utils/validators.ts`.
> All relationships are logical (not enforced by a database schema at the type level).

---

## 1. Entity List with Attributes

### 1.1 User
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `role` | `UserRole` | `'athlete' \| 'parent' \| 'coach' \| 'academy_rep' \| 'admin'` |
| `name` | `string` | |
| `email` | `string` | |
| `phone` | `string?` | |
| `avatar` | `string?` | |
| `authProvider` | `'credentials' \| 'google' \| 'phone'?` | |
| `lastLoginAt` | `string?` | ISO timestamp |
| `preferences` | `UserPreferences?` | `{ location, defaultRadiusKm, defaultSportInterests }` |
| `themePreference` | `string?` | `'midnight-ice' \| 'ember-orange' \| 'graphite-titanium' \| 'alpine-light' \| 'system'` |
| `consent` | `ConsentFlags?` | `{ analytics, marketing, whatsapp }` |
| `createdAt` | `string` | |
| `updatedAt` | `string` | |

### 1.2 AdminUser
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `userId` | `string` | FK → User.id |
| `role` | `AdminRole` | `'super_admin' \| 'ops_admin' \| 'lead_admin' \| 'analyst' \| 'support'` |
| `scopes` | `string[]?` | |
| `isActive` | `boolean` | |
| `lastActiveAt` | `string?` | |

### 1.3 Child
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `parentId` | `string` | FK → User.id |
| `name` | `string` | |
| `age` | `number` | |
| `gender` | `'male' \| 'female' \| 'other' \| 'prefer_not_to_say'?` | |
| `sportInterests` | `string[]` | Sport slugs |
| `createdAt` | `string` | |
| `updatedAt` | `string` | |

### 1.4 Academy
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `slug` | `string` | Unique, URL-safe |
| `name` | `string` | |
| `description` | `string` | |
| `location` | `LocationSummary` | `{ address?, city, state, country, district?, lat, lng, pincode?, geohash? }` |
| `contact` | `object` | `{ phone?, email?, website? }` |
| `sportsOffered` | `string[]` | Sport slugs |
| `facilities` | `Facility[]` | Enum values |
| `trainingLevels` | `TrainingLevel[]` | `'beginner' \| 'intermediate' \| 'advanced' \| 'elite'` |
| `ageRange` | `{ min?, max? }?` | |
| `batchInformation` | `string?` | |
| `certifications` | `Certification[]` | Embedded array |
| `verificationStatus` | `VerificationStatus` | `'unverified' \| 'pending' \| 'verified' \| 'rejected'` |
| `verificationEvidence` | `VerificationEvidence[]?` | |
| `achievementSignals` | `AchievementSignals` | `{ stateAthletesProduced, nationalAthletesProduced, competitionParticipations, milestones }` |
| `rating` | `Rating` | `{ average, count }` |
| `coverImage` | `string?` | |
| `gallery` | `string[]` | Image URLs |
| `status` | `AcademyStatus` | `'draft' \| 'published' \| 'suspended'` |
| `lastUpdatedAt` | `string` | |
| `createdAt` | `string` | |
| `indexedAt` | `string?` | Search index timestamp |

### 1.5 Coach
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `slug` | `string` | Unique, URL-safe |
| `name` | `string` | |
| `avatar` | `string?` | |
| `certifications` | `Certification[]` | Embedded array |
| `experienceYears` | `number` | |
| `sportsCoached` | `string[]` | Sport slugs |
| `specialization` | `string[]` | |
| `academyId` | `string?` | FK → Academy.id |
| `location` | `LocationSummary` | |
| `contact` | `object` | `{ phone?, email? }` |
| `verificationStatus` | `VerificationStatus` | |
| `rating` | `Rating` | |
| `status` | `CoachStatus` | `'draft' \| 'published' \| 'suspended'` |
| `lastUpdatedAt` | `string` | |
| `createdAt` | `string` | |

### 1.6 Enquiry
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `userId` | `string?` | FK → User.id |
| `childId` | `string?` | FK → Child.id |
| `targetType` | `EnquiryTargetType` | `'academy' \| 'coach'` |
| `targetId` | `string` | Polymorphic FK |
| `intent` | `EnquiryIntent` | `'contact' \| 'callback' \| 'trial' \| 'enrollment_interest'` |
| `parentInfo` | `object` | `{ name, email, phone }` |
| `childInfo` | `{ name, age }?` | |
| `sportInterest` | `string` | Sport slug |
| `message` | `string?` | Max 1000 chars |
| `status` | `EnquiryStatus` | `'submitted' \| 'delivered' \| 'failed' \| 'bounced'` |
| `deliveryAttempts` | `number` | |
| `lastDeliveryAt` | `string?` | |
| `failureReason` | `string?` | |
| `whatsappConfirmationSent` | `boolean` | |
| `whatsappMessageId` | `string?` | |
| `leadId` | `string?` | FK → Lead.id |
| `ipHash` | `string?` | |
| `userAgentHash` | `string?` | |
| `createdAt` | `string` | |

### 1.7 ShortlistItem (Favorite)
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `userId` | `string` | FK → User.id |
| `contextChildId` | `string?` | FK → Child.id |
| `itemType` | `ShortlistItemType` | `'academy' \| 'coach' \| 'sport'` |
| `itemId` | `string` | Polymorphic FK |
| `createdAt` | `string` | |

### 1.8 Session
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `userId` | `string` | FK → User.id |
| `refreshTokenHash` | `string` | |
| `deviceInfo` | `string?` | |
| `ipHash` | `string?` | |
| `expiresAt` | `string` | |
| `revokedAt` | `string?` | |
| `createdAt` | `string` | |

### 1.9 Lead
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `enquiryId` | `string` | FK → Enquiry.id |
| `source` | `LeadSource` | `'academy_detail' \| 'coach_detail' \| 'compare' \| 'shortlist' \| 'search'` |
| `ownerType` | `LeadOwnerType` | `'academy' \| 'coach'` |
| `ownerId` | `string` | Polymorphic FK |
| `userId` | `string?` | FK → User.id (denormalised) |
| `childId` | `string?` | FK → Child.id (denormalised) |
| `status` | `LeadStatus` | `'new' \| 'contacted' \| 'qualified' \| 'trial_scheduled' \| 'converted' \| 'lost'` |
| `assignedTo` | `string?` | AdminUser.id |
| `lastActivityAt` | `string` | |
| `createdAt` | `string` | |
| `updatedAt` | `string` | |

### 1.10 LeadActivity
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `leadId` | `string` | FK → Lead.id |
| `actorType` | `LeadActorType` | `'system' \| 'admin'` |
| `actorId` | `string?` | |
| `type` | `LeadActivityType` | `'note' \| 'status_change' \| 'contact_attempt' \| 'whatsapp_sent' \| 'callback_logged'` |
| `payload` | `Record<string, unknown>` | |
| `createdAt` | `string` | |

### 1.11 Competition
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `sportSlug` | `string` | FK → Sport.slug |
| `name` | `string` | |
| `level` | `CompetitionLevel` | `'district' \| 'state' \| 'national' \| 'international'` |
| `organiser` | `string` | |
| `whatIs` | `string` | Description |
| `whyImportant` | `string` | |
| `progression` | `string` | |

### 1.12 Sport
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `slug` | `string` | Unique, URL-safe |
| `name` | `string` | |
| `description` | `string` | |
| `icon` | `string?` | |
| `coverImage` | `string?` | |
| `category` | `SportCategory` | `'team' \| 'individual' \| 'combat' \| 'racquet' \| 'aquatic' \| 'athletics' \| 'other'` |
| `competitionPathway` | `CompetitionPathway` | `{ levels: [{ key, label, description? }] }` |
| `explorationGuidance` | `ExplorationGuidance?` | `{ ageSuitability?, physicalRequirements?, notes? }` |
| `status` | `SportStatus` | `'published' \| 'draft'` |

### 1.13 Certification (Embedded)
| Attribute | Type | Notes |
|---|---|---|
| `name` | `string` | |
| `issuer` | `string` | |
| `year` | `number` | |
| `documentUrl` | `string?` | |

### 1.14 Review
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `targetType` | `ReviewTargetType` | `'academy' \| 'coach'` |
| `targetId` | `string` | Polymorphic FK |
| `userId` | `string` | FK → User.id |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | |
| `text` | `string` | |
| `createdAt` | `string` | |
| `moderationStatus` | `ModerationStatus` | `'pending' \| 'approved' \| 'rejected'` |
| `moderatorId` | `string?` | AdminUser.id |

### 1.15 MediaAsset
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `ownerType` | `string` | Polymorphic |
| `ownerId` | `string` | Polymorphic FK |
| `type` | `MediaType` | `'image' \| 'document'` |
| `url` | `string` | |
| `mime` | `string` | |
| `size` | `number` | Bytes |
| `width` | `number?` | |
| `height` | `number?` | |
| `altText` | `string?` | |
| `checksum` | `string` | |
| `createdAt` | `string` | |

### 1.16 ConsentRecord
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `userId` | `string?` | FK → User.id |
| `sessionId` | `string?` | FK → Session.id |
| `category` | `ConsentCategory` | `'analytics' \| 'marketing' \| 'whatsapp'` |
| `granted` | `boolean` | |
| `version` | `string` | |
| `createdAt` | `string` | |

### 1.17 AuditLog
| Attribute | Type | Notes |
|---|---|---|
| `id` | `string` | PK |
| `actorId` | `string` | |
| `actorRole` | `string` | |
| `entityType` | `string` | |
| `entityId` | `string` | |
| `action` | `AuditAction` | `'create' \| 'update' \| 'delete' \| 'verify' \| 'reject' \| 'suspend' \| 'restore' \| 'assign' \| 'status_change'` |
| `diff` | `{ before, after }?` | |
| `ip` | `string?` | |
| `userAgent` | `string?` | |
| `reason` | `string?` | |
| `createdAt` | `string` | |

### 1.18 AnalyticsEvent (Log)
| Attribute | Type | Notes |
|---|---|---|
| `schemaVersion` | `string` | |
| `name` | `AnalyticsEventName` | 37+ event names |
| `occurredAt` | `string` | |
| `route` | `string?` | |
| `referrer` | `string?` | |
| `consentFlags` | `Partial<Record<ConsentCategory, boolean>>?` | |
| `properties` | `Record<string, unknown>` | Varies by event name |

### 1.19 AthleteOnboardingData / ParentOnboardingData
| Attribute | Type | Notes |
|---|---|---|
| `age` / `childAge` | `number` | |
| `gender` | `enum?` | Athlete only |
| `location` | `string` | |
| `sportInterests` | `string[]` | |
| `skillLevel` | `SkillLevel` | `'beginner' \| 'intermediate' \| 'advanced' \| 'competitive'` |
| `goals` / `childName` | `string` | Varies by role |

---

## 2. Relationship Matrix

| Entity | User | Child | Academy | Coach | Enquiry | Shortlist | Session | Lead | Comp | Sport | Review | Media | Consent | Audit |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **User** | — | 1\:* | — | — | 1\:* | 1\:* | 1\:* | *:1 | — | — | 1\:* | — | 1\:* | 1\:* |
| **Child** | *:1 | — | — | — | *:1 | *:1 | — | *:1 | — | — | — | — | — | — |
| **Academy** | — | — | — | 1\:* | *:1 | *:1 | — | *:1 | — | *:* | *:1 | *:1 | — | *:1 |
| **Coach** | — | — | *:1 | — | *:1 | *:1 | — | *:1 | — | *:* | *:1 | *:1 | — | *:1 |
| **Enquiry** | *:1 | *:1 | *:1 | *:1 | — | — | — | 1:1 | — | — | — | — | — | — |
| **Shortlist** | *:1 | *:1 | *:1 | *:1 | — | — | — | — | — | *:1 | — | — | — | — |
| **Session** | *:1 | — | — | — | — | — | — | — | — | — | — | — | *:1 | — |
| **Lead** | *:1 | *:1 | *:1 | *:1 | 1:1 | — | — | — | — | — | — | — | — | *:1 |
| **Competition** | — | — | — | — | — | — | — | — | — | *:1 | — | — | — | — |
| **Sport** | — | — | *:* | *:* | — | *:1 | — | — | 1\:* | — | — | — | — | — |
| **Review** | *:1 | — | *:1 | *:1 | — | — | — | — | — | — | — | — | — | — |
| **MediaAsset** | — | — | *:1 | *:1 | — | — | — | — | — | — | — | — | — | — |
| **Consent** | *:1 | — | — | — | — | — | *:1 | — | — | — | — | — | — | — |
| **AuditLog** | *:1 | — | *:1 | *:1 | — | — | — | *:1 | — | — | — | — | — | — |

---

## 3. Cardinality Descriptions

### Core User Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 1 | **User** | **Child** | 1 : * | `Child.parentId` | A parent user may register multiple children |
| 2 | **User** | **Enquiry** | 1 : * | `Enquiry.userId` | A user may submit many enquiries |
| 3 | **User** | **Session** | 1 : * | `Session.userId` | Multiple device / login sessions |
| 4 | **User** | **ShortlistItem** | 1 : * | `ShortlistItem.userId` | Per-user shortlist/favorites |
| 5 | **User** | **AdminUser** | 1 : 0..1 | `AdminUser.userId` | Extended admin profile |
| 6 | **User** | **ConsentRecord** | 1 : * | `ConsentRecord.userId` | Consent audit trail per user |
| 7 | **User** | **Review** | 1 : * | `Review.userId` | User can review academies/coaches |
| 8 | **User** | **AuditLog** | 1 : * | `AuditLog.actorId` | User actions logged |

### Child Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 9 | **Child** | **Enquiry** | 1 : * | `Enquiry.childId` | An enquiry may be for a specific child |
| 10 | **Child** | **ShortlistItem** | 1 : * | `ShortlistItem.contextChildId` | Shortlists can be child-scoped |
| 11 | **Child** | **Lead** | 1 : * | `Lead.childId` | Denormalised onto leads for filtering |

### Academy Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 12 | **Academy** | **Coach** | 1 : * | `Coach.academyId` | An academy employs multiple coaches |
| 13 | **Academy** | **Enquiry** | 1 : * | `Enquiry.targetType='academy'` | Enquiries directed at an academy |
| 14 | **Academy** | **ShortlistItem** | 1 : * | `ShortlistItem.itemType='academy'` | Users can shortlist academies |
| 15 | **Academy** | **Lead** | 1 : * | `Lead.ownerType='academy'` | Leads owned by academy |
| 16 | **Academy** | **Review** | 1 : * | `Review.targetType='academy'` | Reviews for an academy |
| 17 | **Academy** | **MediaAsset** | 1 : * | `MediaAsset.ownerType='academy'` | Gallery / cover images |
| 18 | **Academy** | **AuditLog** | 1 : * | `AuditLog.entityType='academy'` | Moderation & status changes |

### Coach Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 19 | **Coach** | **Academy** | * : 1 | `Coach.academyId` | A coach may belong to one academy (optional) |
| 20 | **Coach** | **Enquiry** | 1 : * | `Enquiry.targetType='coach'` | Enquiries directed at a coach |
| 21 | **Coach** | **ShortlistItem** | 1 : * | `ShortlistItem.itemType='coach'` | Users can shortlist coaches |
| 22 | **Coach** | **Lead** | 1 : * | `Lead.ownerType='coach'` | Leads owned by coach |
| 23 | **Coach** | **Review** | 1 : * | `Review.targetType='coach'` | Reviews for a coach |
| 24 | **Coach** | **MediaAsset** | 1 : * | `MediaAsset.ownerType='coach'` | Coach avatar / documents |
| 25 | **Coach** | **AuditLog** | 1 : * | `AuditLog.entityType='coach'` | Moderation & status changes |

### Enquiry Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 26 | **Enquiry** | **Lead** | 1 : 1 | `Lead.enquiryId` | Each enquiry spawns exactly one lead |

### Lead Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 27 | **Lead** | **LeadActivity** | 1 : * | `LeadActivity.leadId` | Activity timeline for each lead |
| 28 | **Lead** | **AuditLog** | 1 : * | `AuditLog.entityType='lead'` | Lead status changes logged |

### Sport Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 29 | **Sport** | **Competition** | 1 : * | `Competition.sportSlug` | Each sport has a competition pathway |
| 30 | **Sport** | **Academy** | * : * | `Academy.sportsOffered` | Many-to-many via embedded slug array |
| 31 | **Sport** | **Coach** | * : * | `Coach.sportsCoached` | Many-to-many via embedded slug array |
| 32 | **Sport** | **ShortlistItem** | 1 : * | `ShortlistItem.itemType='sport'` | Users can shortlist sports |

### Session Relationships

| # | Source | Target | Cardinality | Key | Notes |
|---|---|---|---|---|---|
| 33 | **Session** | **ConsentRecord** | 1 : * | `ConsentRecord.sessionId` | Consent given during a session |

### Polymorphic Relationships

The following entities reference multiple target types through a `(targetType, targetId)` or `(ownerType, ownerId)` pattern:

| Entity | Polymorphic Column | Target Entities |
|---|---|---|
| Enquiry | `(targetType, targetId)` | Academy, Coach |
| ShortlistItem | `(itemType, itemId)` | Academy, Coach, Sport |
| Lead | `(ownerType, ownerId)` | Academy, Coach |
| Review | `(targetType, targetId)` | Academy, Coach |
| MediaAsset | `(ownerType, ownerId)` | Academy, Coach, User, etc. |

---

## 4. Text-Based ER Diagram

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                              ENTITY RELATIONSHIPS                           │
 └─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────┐
                                    │  SPORT   │
                                    ├──────────┤
                                    │ id (PK)  │
                                    │ slug     │──┐
                                    │ name     │  │ (sportsOffered[])
                                    │ category │  │
                                    │ status   │  │
                                    └──────────┘  │
                                         │        │
                                   1  *  │        │  *  *
                              ┌──────────┘        │  ┌──────────┐
                              ▼                    │  │ ACADEMY  │
                    ┌─────────────────┐            ├──┤──────────┤
                    │  COMPETITION    │            │  │ id (PK)  │
                    ├─────────────────┤            │  │ slug     │
                    │ id (PK)         │            │  │ name     │──┐
                    │ sportSlug (FK)──┘            │  │ location │  │
                    │ name            │            │  │ sports[] │  │ (sportsCoached[])
                    │ level           │            │  │ certs[]  │  │
                    │ organiser       │            │  │ verify   │  │
                    └─────────────────┘            │  │ status   │  │
                                                    │  └──────────┘  │
                                                    │       │        │
                                                    │  1    │  *     │  *  *
                                                    │       │        │
                                                    │  ┌────▼─────┐  │
                                                    │  │  COACH   │◄─┘
                                                    │  ├──────────┤
                                                    │  │ id (PK)  │
                                                    │  │ slug     │
                                                    │  │ academy  │──┘
                                                    │  │ sports[] │
                                                    │  │ certs[]  │
                                                    │  │ verify   │
                                                    │  │ rating   │
                                                    │  └──────────┘
                                                    │
                          ┌──────────────────────────────────────────────────────────┐
                          │                    USER & FAMILY                         │
                          ├──────────────────────────────────────────────────────────┤
                          │                                                          │
                          │  ┌──────────┐    1    *  ┌──────────┐                    │
                          │  │   USER   │───────────▶│  CHILD   │                    │
                          │  ├──────────┤            ├──────────┤                    │
                          │  │ id (PK)  │            │ id (PK)  │                    │
                          │  │ role     │            │parentId   │                    │
                          │  │ name     │            │ name      │                    │
                          │  │ email    │            │ age       │                    │
                          │  │ phone    │            │ gender    │                    │
                          │  │ prefs    │            │ sports[]  │                    │
                          │  │ consent  │            └──────────┘                    │
                          │  └────┬─────┘                 │                         │
                          │       │                       │                         │
                          │       │ 1                   1 │                         │
                          │       │                       │                         │
                          │       │  *                    │ *                        │
                          │  ┌────▼────────┐    ┌─────────▼─────────┐               │
                          │  │   SESSION   │    │    ENQUIRY        │               │
                          │  ├─────────────┤    ├───────────────────┤               │
                          │  │ id (PK)     │    │ id (PK)           │               │
                          │  │ userId (FK)─┘    │ userId (FK)───────┘               │
                          │  │ tokenHash   │    │ childId (FK)──────┘               │
                          │  │ deviceInfo  │    │ targetType         │               │
                          │  │ expiresAt   │    │ targetId           │               │
                          │  │ revokedAt   │    │ intent             │               │
                          │  └─────────────┘    │ parentInfo         │               │
                          │                     │ childInfo          │               │
                          │  ┌──────────────┐   │ status             │               │
                          │  │ SHORTLIST    │   └────────┬───────────┘               │
                          │  ├──────────────┤            │                          │
                          │  │ id (PK)      │            │ 1                         │
                          │  │ userId (FK)──┘            │                          │
                          │  │ childId (FK)──┘           │                          │
                          │  │ itemType      │            │ 1                         │
                          │  │ itemId        │   ┌────────▼───────────┐               │
                          │  └──────────────┘   │       LEAD         │               │
                          │                     ├────────────────────┤               │
                          │  ┌──────────────┐   │ id (PK)            │               │
                          │  │   REVIEW     │   │ enquiryId (FK)─────┘               │
                          │  ├──────────────┤   │ ownerType           │               │
                          │  │ id (PK)      │   │ ownerId             │               │
                          │  │ userId (FK)──┘   │ userId (denorm)     │               │
                          │  │ targetType   │   │ status              │               │
                          │  │ targetId     │   │ assignedTo          │               │
                          │  │ rating       │   └────────┬───────────┘               │
                          │  │ text         │            │                          │
                          │  └──────────────┘            │ 1                         │
                          │                              │                          │
                          │                     ┌────────▼───────────┐               │
                          │                     │   LEAD_ACTIVITY    │               │
                          │                     ├────────────────────┤               │
                          │                     │ leadId (FK)────────┘               │
                          │                     │ actorType           │               │
                          │                     │ type                │               │
                          │                     │ payload             │               │
                          │                     └────────────────────┘               │
                          └──────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────────┐
 │                    CROSS-CUTTING                             │
 ├─────────────────────────────────────────────────────────────┤
 │                                                              │
 │  ┌──────────────┐    ┌────────────────┐                     │
 │  │ CONSENT      │    │  MEDIA_ASSET   │                     │
 │  ├──────────────┤    ├────────────────┤                     │
 │  │ id (PK)      │    │ id (PK)        │                     │
 │  │ userId (FK)──┘    │ ownerType      │                     │
 │  │ sessionId (FK)──┘ │ ownerId        │                     │
 │  │ category     │    │ type           │                     │
 │  │ granted      │    │ url            │                     │
 │  │ version      │    │ mime           │                     │
 │  └──────────────┘    │ checksum       │                     │
 │                       └────────────────┘                     │
 │  ┌──────────────┐    ┌────────────────┐                     │
 │  │  AUDIT_LOG   │    │ ADMIN_USER     │                     │
 │  ├──────────────┤    ├────────────────┤                     │
 │  │ id (PK)      │    │ id (PK)        │                     │
 │  │ actorId      │    │ userId (FK)──┘ │                     │
 │  │ entityType   │    │ role           │                     │
 │  │ entityId     │    │ isActive       │                     │
 │  │ action       │    │ scopes[]       │                     │
 │  │ diff         │    └────────────────┘                     │
 │  └──────────────┘                                           │
 └─────────────────────────────────────────────────────────────┘
```

---

## 5. Key Business Rules (Derived from Frontend Validation)

### 5.1 User & Auth
| # | Rule | Source |
|---|---|---|
| A1 | A user's `role` must be one of `'athlete' \| 'parent' \| 'coach' \| 'academy_rep' \| 'admin'` | `user.ts:3` |
| A2 | Email must be non-empty and match `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `validators.ts:3,12` |
| A3 | Phone must be exactly 10 digits (numeric only after stripping non-digits) | `validators.ts:8,18-19` |
| A4 | Slugs must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`, max 120 chars | `validators.ts:27` |
| A5 | A `parent`-role user may have multiple `Child` records | `Child.parentId` FK |
| A6 | `authProvider` is optional; if absent, the user may be a legacy/guest user | `user.ts:26` |
| A7 | A user may have at most one `AdminUser` profile | `AdminUser.userId` unique |

### 5.2 Child
| # | Rule | Source |
|---|---|---|
| B1 | `parentId` must reference an existing `User` | `Child.parentId` |
| B2 | `age` must be between 3 and 25 when used in enquiries | `validators.ts:37` |
| B3 | `sportInterests` is an array of valid sport slugs | `user.ts:41` |
| B4 | Gender is optional; defaults to no preference | `user.ts:40` |

### 5.3 Academy
| # | Rule | Source |
|---|---|---|
| C1 | `slug` must be unique and URL-safe | `academy.ts:36` |
| C2 | `sportsOffered` entries must match existing `Sport.slug` values | Soft reference |
| C3 | At least one `facility` type is expected for published academies | Business convention |
| C4 | `verificationStatus` progression: `'unverified' → 'pending' → 'verified'` (or `'rejected'`) | `academy.ts:4` |
| C5 | `rating.average` is computed from associated `Review` records | `common.ts:2-4` |
| C6 | `status` must be `'published'` to appear in search results | `academy.ts:5` |
| C7 | `achievementSignals` may be empty for new/draft academies | `academy.ts:27-32` |

### 5.4 Coach
| # | Rule | Source |
|---|---|---|
| D1 | `academyId` is optional — a coach may be independent | `coach.ts:16` |
| D2 | `sportsCoached` entries must match existing `Sport.slug` values | Soft reference |
| D3 | `experienceYears` is a positive integer (no explicit validation, but expected) | `coach.ts:13` |
| D4 | Coach `certifications` array may be empty | `coach.ts:12` |
| D5 | A coach's `status` must be `'published'` to appear in search | `coach.ts:5` |

### 5.5 Enquiry
| # | Rule | Source |
|---|---|---|
| E1 | `targetType` must be `'academy'` or `'coach'` | `enquiry.ts:1` |
| E2 | `intent` must be one of `'contact' \| 'callback' \| 'trial' \| 'enrollment_interest'` | `enquiry.ts:3-8`, `validators.ts:32` |
| E3 | `parentName` must be 2–80 characters | `validators.ts:33` |
| E4 | `parentEmail` must be valid email (non-empty) | `validators.ts:34` |
| E5 | `parentPhone` must be exactly 10 digits | `validators.ts:35` |
| E6 | `childName` is optional, max 80 characters when provided | `validators.ts:36` |
| E7 | `childAge` when provided must be integer between 3 and 25 | `validators.ts:37` |
| E8 | `sportInterest` (sport) must be non-empty string | `validators.ts:38` |
| E9 | `message` is optional, max 1000 characters | `validators.ts:39` |
| E10 | An enquiry always spawns exactly one `Lead` record (1:1) | `enquiry.ts:35` `leadId` |
| E11 | Enquiry status flow: `'submitted' → 'delivered'` (or `'failed' \| 'bounced'`) | `enquiry.ts:9` |
| E12 | `ipHash` and `userAgentHash` are captured for anti-abuse | `enquiry.ts:36-37` |

### 5.6 Shortlist / Favorites
| # | Rule | Source |
|---|---|---|
| F1 | `itemType` must be `'academy' \| 'coach' \| 'sport'` | `shortlist.ts:1` |
| F2 | `contextChildId` is optional — enables per-child shortlist views | `shortlist.ts:6` |
| F3 | A user may shortlist the same entity only once (unique constraint on userId + itemType + itemId) | Business rule |

### 5.7 Session
| # | Rule | Source |
|---|---|---|
| G1 | `refreshTokenHash` is stored — never the raw token | `session.ts:4` |
| G2 | `expiresAt` must be in the future at creation time | `session.ts:7` |
| G3 | `revokedAt` is set on logout / forced session termination | `session.ts:8` |

### 5.8 Lead
| # | Rule | Source |
|---|---|---|
| H1 | `enquiryId` is required (1:1 with Enquiry) | `lead.ts:29` |
| H2 | `source` identifies the conversion touchpoint | `lead.ts:30` |
| H3 | `status` progression: `'new' → 'contacted' → 'qualified' → 'trial_scheduled' → 'converted'` (or `'lost'` at any stage) | `lead.ts:8-14` |
| H4 | `ownerType` + `ownerId` determines which entity "owns" the lead (Academy or Coach) | `lead.ts:16,31-32` |
| H5 | `userId` and `childId` are denormalised onto the Lead for fast filtering | `lead.ts:33-34` |
| H6 | `assignedTo` references an `AdminUser.id` for lead assignment | `lead.ts:36` |

### 5.9 Sport & Competition
| # | Rule | Source |
|---|---|---|
| I1 | `sportSlug` in Competition must reference `Sport.slug` | `competition.ts:5` |
| I2 | Sport `category` classification is one of 7 values | `sport.ts:1-8` |
| I3 | Competition `level` progression: `'district' → 'state' → 'national' → 'international'` | `competition.ts:1`, `sport.ts:13-18` |
| I4 | Sport `status` controls visibility independently of academies/coaches | `sport.ts:10` |

### 5.10 Review & Moderation
| # | Rule | Source |
|---|---|---|
| J1 | `targetType` is `'academy' \| 'coach'` | `review.ts:1` |
| J2 | `rating` is 1–5 integer | `review.ts:10` |
| J3 | All reviews start as `'pending'`; moderator sets `'approved'` or `'rejected'` | `review.ts:13` |
| J4 | `moderatorId` references `AdminUser.id` | `review.ts:14` |

### 5.11 Consent & Privacy
| # | Rule | Source |
|---|---|---|
| K1 | Consent categories: `'analytics' \| 'marketing' \| 'whatsapp'` | `consent.ts:1` |
| K2 | Each consent grant/revocation is individually recorded with version | `consent.ts:4-11` |
| K3 | Analytics event emission must respect `ConsentFlags` from User | `analytics-event.ts:45` |

### 5.12 Audit
| # | Rule | Source |
|---|---|---|
| L1 | All entity mutations (create/update/delete/verify/reject/suspend) are logged | `audit.ts:1-10` |
| L2 | `diff` captures `before`/`after` snapshots for meaningful audit trails | `audit.ts:18-22` |

---

## 6. Index / Performance Considerations

| Entity | Suggested Indexes | Rationale |
|---|---|---|
| User | `(email)`, `(role)`, `(authProvider)` | Login, filtering by role |
| Child | `(parentId)`, `(parentId, sportInterests)` | Profile dashboard, sport matching |
| Academy | `(slug)`, `(status)`, `(verificationStatus)`, `(location.city, sportsOffered)` | Detail page, search, filtering |
| Coach | `(slug)`, `(academyId)`, `(status)`, `(sportsCoached)` | Detail page, academy roster, search |
| Enquiry | `(userId)`, `(targetType, targetId)`, `(status)`, `(createdAt)` | History, entity enquiries, status tracking |
| ShortlistItem | `(userId, itemType, itemId)` unique, `(userId, contextChildId)` | Prevent duplicates, per-child view |
| Session | `(userId)`, `(refreshTokenHash)` | User sessions, token lookup |
| Lead | `(enquiryId)` unique, `(ownerType, ownerId)`, `(status)`, `(assignedTo)` | CRM workflows |
| LeadActivity | `(leadId, createdAt)` | Activity timeline |
| Review | `(targetType, targetId)`, `(userId)`, `(moderationStatus)` | Rating computation, user history, moderation queue |
| Competition | `(sportSlug, level)` | Pathway display |
| Sport | `(slug)` unique, `(category)` | Lookup, category filtering |
| MediaAsset | `(ownerType, ownerId)` | Gallery/media queries |
| ConsentRecord | `(userId, category)`, `(sessionId)` | Consent audit |
| AuditLog | `(entityType, entityId)`, `(actorId)`, `(createdAt)` | Entity history, user activity |
