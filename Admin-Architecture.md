# Admin Architecture

## Purpose

Internal administration surface for SportsOS staff. Used to manage academies, coaches, sports, users, verification, leads, and operational analytics. Not customer-facing.

## Principles

- Strict role-based access (admin only; no parent/athlete/coach access)
- Append-only audit log for every mutation
- Verification is a first-class state machine
- Lead management is a workflow, not a CRUD list
- Optimistic UI with server-confirmed actions
- Bulk operations gated to high-trust roles
- Sensitive actions require explicit confirmation

## Route Structure

- `/admin` — Dashboard (KPIs, queues, recent activity)
- `/admin/academies` — Academy list
- `/admin/academies/[id]` — Academy detail / edit
- `/admin/academies/new` — Create
- `/admin/coaches` — Coach list
- `/admin/coaches/[id]` — Coach detail / edit
- `/admin/coaches/new` — Create
- `/admin/sports` — Sport taxonomy
- `/admin/sports/[id]` — Sport detail / edit
- `/admin/verification` — Verification queue (academies + coaches)
- `/admin/verification/[id]` — Evidence review
- `/admin/enquiries` — Enquiry log
- `/admin/leads` — Lead inbox (kanban + table)
- `/admin/leads/[id]` — Lead detail + activity
- `/admin/users` — User directory
- `/admin/users/[id]` — User detail (immutable PII, action log)
- `/admin/analytics` — Operational dashboards (see Analytics-Architecture.md)
- `/admin/settings` — Platform settings (feature flags, taxonomy, messages)

## Roles

- `super_admin` — Full access, settings, role assignment
- `ops_admin` — Academies, coaches, sports, verification
- `lead_admin` — Leads, enquiries, assignment, status
- `analyst` — Read-only analytics
- `support` — Read-only user + enquiry access

Role-based UI gating, server-side enforcement on every action, and route-level guard.

## Component Hierarchy

AdminShell
├── AdminTopbar
│   ├── GlobalSearch (admin-scoped)
│   ├── RoleIndicator
│   └── AdminUserMenu
├── AdminSidebar
│   ├── Dashboard
│   ├── Academies
│   ├── Coaches
│   ├── Sports
│   ├── Verification
│   ├── Leads
│   ├── Enquiries
│   ├── Users
│   ├── Analytics
│   └── Settings (super_admin only)
├── AdminBreadcrumbs
└── AdminSection (role-gated)
    ├── DataTable (filter, sort, paginate, bulk)
    │   ├── RowActions
    │   ├── BulkActions
    │   └── StatusPill
    ├── DetailDrawer
    ├── EditForm (typed, validated, draft autosave)
    ├── VerificationReview
    │   ├── EvidenceViewer
    │   ├── DecisionPanel (verify / reject / request more)
    │   └── ActivityTrail
    ├── LeadInbox
    │   ├── LeadBoard (kanban by status)
    │   ├── LeadTable
    │   ├── LeadFilters
    │   └── LeadDetail
    │       ├── LeadHeader
    │       ├── LeadActivity (append-only)
    │       ├── StatusChange
    │       ├── AssignOwner
    │       └── AddNote
    └── ConfirmDialog (destructive actions)

Shared admin primitives:
- `DataTable` — typed columns, virtualization for large lists
- `FilterBar` — saved filter sets per admin
- `DiffViewer` — show before/after for audit
- `StatusPill` — consistent status vocabulary
- `EmptyState`, `ErrorState`, `Skeleton` reused from public

## Data Model

Extends public entities with admin fields:

Academy (admin view)
- All public fields
- `internal_notes`
- `risk_score`
- `source` (manual | import | partner | self_register)
- `last_indexed_at`
- `audit_log_id` (latest)

Coach (admin view) — same pattern as Academy.

VerificationCase
- id, target_type (academy | coach), target_id
- status (queued | under_review | needs_info | verified | rejected)
- submitted_at, assigned_to, decided_at
- evidence[] (document_url, type, uploaded_by, hash)
- reviewer_notes
- decision_reason
- audit_log_id

Lead
- id, enquiry_id (FK Enquiry)
- source (academy_detail | coach_detail | compare | shortlist | search)
- owner_type (academy | coach), owner_id
- user_id?, child_id?
- status (new | contacted | qualified | trial_scheduled | converted | lost)
- assigned_to? (admin user)
- last_activity_at
- created_at, updated_at

LeadActivity
- id, lead_id
- actor_type (system | admin), actor_id?
- type (note | status_change | contact_attempt | whatsapp_sent | callback_logged)
- payload (JSON)
- created_at

AuditLog
- id, actor_id, actor_role
- entity_type, entity_id
- action (create | update | delete | verify | reject | suspend | restore | assign | status_change)
- diff (before, after)
- ip, user_agent
- created_at

AdminUser
- id, user_id (FK User), role
- scopes[] (optional fine-grained)
- is_active, last_active_at

## Workflows

Verification
1. Academy/coach submits evidence (or admin imports)
2. VerificationCase created, status `queued`
3. Lead_admin / ops_admin picks up, status `under_review`
4. Reviewer decides: verify, reject, or request more info
5. On verify: entity `verification_status` → `verified`, audit log entry, cache invalidation
6. On reject: entity → `rejected`, reason captured, audit log, notification
7. On needs_info: status `needs_info`, message logged, owner notified

Lead Management
1. Enquiry submitted → Lead created (status `new`), LeadActivity `system.created`
2. Assignment: lead_admin picks or system auto-assigns by region
3. Status flow: new → contacted → qualified → trial_scheduled → converted | lost
4. Every transition writes LeadActivity and updates `last_activity_at`
5. Notes are immutable once written
6. Daily rollup for analytics (see Analytics-Architecture.md)

User Management
- Read-only PII view (masked phone/email by default, reveal requires confirmation + audit)
- Action log filtered by entity
- Suspend / restore with reason
- Force logout (revoke all sessions)

## Security

- All `/admin/**` routes require `admin` role; server-enforced
- Step-up auth (re-authenticate) for destructive actions (suspend, delete, role change)
- IP allowlist (configurable, optional)
- Admin actions throttled per user
- Sensitive reveals (full phone/email) require explicit reason, written to audit log
- No public PII export; exports are admin-scoped and audit-logged
- Session revocation on role downgrade
- Read-only role (`analyst`) cannot mutate

## Performance

- Server components for lists with cursor pagination
- `DataTable` virtualization for >100 rows
- Debounced search, server-side filter
- Background reindex on publish/unpublish
- Optimistic updates for status changes, with rollback on failure
- Skeleton states for every async section

## Caching

- Admin lists: short TTL (30–60s) SWR; tag-based invalidation on mutation
- Detail pages: stale-while-revalidate
- Verification queue: real-time polling or SSE (future)
- No long-lived cache for sensitive views

## Observability

- All admin actions write AuditLog
- Error reporting with admin context
- p95 latency tracking per admin route
- Alerting on unusual bulk activity (mass suspend, mass reject)

## Phase Integration

- Phase 7 — Admin & Lead Management (Internal)
  - Admin shell, role-based access
  - Academy / Coach / Sport management (CRUD, verify, suspend)
  - Verification queue with evidence review
  - Lead inbox, assignment, status, activity log
  - Internal analytics dashboards (see Analytics-Architecture.md)

## MVP Boundaries

- No multi-tenant isolation in MVP (single SportsOS org)
- No super-admin role delegation UI (seeded only)
- No external SSO for admins in MVP
- No AI-assisted verification in MVP
- No admin mobile app in MVP
