# Notification Architecture

## Current State

- **Notification preferences**: Stored in localStorage (`sportsos:notifications`) with toggles for email, marketing, and WhatsApp
- **Analytics events**: Tracked via PostHog (consent-gated) in `lib/analytics/events.ts`
- **Backend**: No notification sending infrastructure yet

## Future Events Required

### Academy Lifecycle Events
| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| `academy.verified` | Admin verifies an academy | Email + In-app | High |
| `academy.review_received` | New review posted | Email (daily digest) | Medium |
| `academy.enquiry_received` | New enquiry submitted | Email + WhatsApp | High |
| `academy.profile_updated` | Academy updates profile | In-app | Low |

### Coach Lifecycle Events
| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| `coach.verified` | Admin verifies a coach | Email + In-app | High |
| `coach.enquiry_received` | New enquiry submitted | Email + WhatsApp | High |

### User Events
| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| `user.shortlist_update` | Academy/coach added to shortlist | In-app | Low |
| `user.welcome` | First signup complete | Email | High |
| `user.onboarding_complete` | Onboarding finished | In-app | Medium |

### System Events
| Event | Trigger | Channel | Priority |
|-------|---------|---------|----------|
| `system.maintenance` | Scheduled maintenance | Email + In-app | High |
| `system.new_feature` | New feature launched | Email | Medium |

## Data Model

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  channel: 'email' | 'push' | 'in-app' | 'whatsapp';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

type NotificationType =
  | 'academy.verified'
  | 'academy.review_received'
  | 'academy.enquiry_received'
  | 'coach.verified'
  | 'coach.enquiry_received'
  | 'user.welcome'
  | 'system.maintenance'
  | 'system.new_feature';
```

## Implementation Requirements

### Backend (sportsOS-nodejs)
1. Add `notifications` collection/table to MongoDB
2. Create API endpoints:
   - `GET /api/notifications` — list user notifications
   - `PATCH /api/notifications/:id/read` — mark as read
   - `DELETE /api/notifications/:id` — delete notification
   - `POST /api/notifications/mark-all-read` — mark all as read
3. Add notification creation in existing services (academy, coach, enquiry)
4. Add email sending via SMTP/SendGrid for high-priority events
5. Add WhatsApp integration for enquiry notifications

### Frontend (SportsOS)
1. Create `useNotifications` hook for real-time notification state
2. Add notification badge to navbar (bell icon)
3. Create notification dropdown/panel
4. Create notification settings page (already exists, needs API integration)
5. Add push notification support via Web Push API (PWA)

### Priority Order
1. In-app notifications (lowest effort, highest visibility)
2. Email notifications for high-priority events
3. WhatsApp integration for enquiries
4. Push notifications (PWA requirement)
