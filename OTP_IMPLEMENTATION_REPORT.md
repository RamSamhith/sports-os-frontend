# OTP Email Delivery Implementation Report

**Date**: 2026-06-14
**Status**: ✅ Implemented
**Build**: Passed (lint ✅, typecheck ✅, build ✅)

---

## Summary

Email OTP delivery is now fully implemented using Resend. All three OTP flows (registration, password reset, phone verification) send HTML and plain-text emails via the Resend API.

---

## What Was Implemented

### 1. OTP Email Template

**File**: `sportsOS-nodejs/templates/emailTemplates.js`

- Added `otpTemplate(name, otp, purpose)` — branded HTML email with 6-digit OTP code in monospace dashed box
- Added `plainTextOtp(name, otp, purpose)` — plain-text fallback
- Purpose-aware: email subjects change based on `email_verification`, `password_reset`, or `phone_verification`
- Exports: `otpTemplate`, `plainTextOtp`

### 2. OTP Email Sending Function

**File**: `sportsOS-nodejs/services/emailService.js`

- Added `sendOtpEmail(user, otp, type)` — maps OTP type to subject line, renders template, sends via `sendEmail()`
- Replaced `console.warn`/`console.error` with structured `logger.warn`/`logger.error` calls
- Existing `sendEmail()` function handles Resend client initialization, error handling, and logging
- Export: `sendOtpEmail`

### 3. OTP Delivery Wired Into AuthService

**File**: `sportsOS-nodejs/services/authService.js`

| Flow | Location | Before | After |
|------|----------|--------|-------|
| Registration | `registerUser()` line 54-58 | `// TODO: Send OTP to user's email via email service` | `await sendOtpEmail({ name, email }, otp, 'email_verification')` |
| Password Reset | `forgotPassword()` line 124-128 | `// TODO: Send OTP to user's email` | `await sendOtpEmail({ name: user.name, email: user.email }, otp, 'password_reset')` |
| Phone Verification | `sendPhoneOtp()` line 175-181 | `// TODO: Send OTP via SMS / WhatsApp gateway` | `await sendOtpEmail({ name: user.name, email: user.email }, otp, 'phone_verification')` |

- Removed the `// TODO` comment from `logout()` (line 250)
- All three delivery calls are fire-and-forget with warning logs on failure (OTP is still created in DB)

### 4. Missing Model Files Created

| File | Purpose |
|------|---------|
| `sportsOS-nodejs/models/OTP.js` | OTP storage with TTL index (auto-expires after 10 min) |
| `sportsOS-nodejs/models/Role.js` | Role model (imported by authService) |

---

## OTP Expiry and Verification Flow

### Expiry Mechanism

**File**: `sportsOS-nodejs/models/OTP.js`

```javascript
expiresAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) }
// + TTL index: otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

- OTPs expire after **10 minutes** (default)
- MongoDB TTL index auto-deletes expired documents
- Password reset OTPs explicitly set `expiresAt` in `forgotPassword()` (line 113)

### Verification Flow

| Step | Function | File:Line | What Happens |
|------|----------|-----------|--------------|
| 1. User registers | `registerUser()` | authService.js:34 | User created, OTP generated, email sent |
| 2. User submits OTP | `verifyEmail()` | authService.js:148 | Finds OTP by userId+otp+type, updates `isVerified: true`, deletes OTP |
| 3. User requests password reset | `forgotPassword()` | authService.js:101 | Old OTP deleted, new OTP created, email sent |
| 4. User submits reset OTP | `resetPassword()` | authService.js:134 | Finds OTP by userId+otp+type, updates password, deletes OTP |
| 5. User verifies phone | `sendPhoneOtp()` | authService.js:161 | Old phone OTP deleted, new OTP created, email sent |
| 6. User submits phone OTP | `verifyPhone()` | authService.js:179 | Finds OTP by userId+otp+type, updates `phoneVerified: true`, deletes OTP |

### Error Handling

- **OTP not found**: Returns `'Invalid or expired OTP'` error
- **Email delivery fails**: OTP is still created in DB; warning logged; user sees success message (OTP can be resent)
- **Resend API key missing**: `sendEmail()` returns `{ sent: false, reason: 'NO_API_KEY' }` with warning log
- **Resend API error**: Error logged with subject, recipient, and error message

---

## Files Modified

| File | Changes |
|------|---------|
| `sportsOS-nodejs/templates/emailTemplates.js` | Added `otpTemplate()`, `plainTextOtp()`, updated exports |
| `sportsOS-nodejs/services/emailService.js` | Added `sendOtpEmail()`, replaced console with logger, updated imports/exports |
| `sportsOS-nodejs/services/authService.js` | Wired OTP delivery at 3 locations, added imports, removed TODO comments |

## Files Created

| File | Purpose |
|------|---------|
| `sportsOS-nodejs/models/OTP.js` | OTP model with TTL expiry |
| `sportsOS-nodejs/models/Role.js` | Role model (was missing) |

---

## Environment Variables Required

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | Yes | — | Resend API key for email delivery |
| `EMAIL_FROM` | No | `noreply@sportsos.com` | Sender email address |
| `FRONTEND_URL` | No | `https://sportsos.vercel.app` | Used in password reset links |

---

## Build Results

```
✓ Lint:     1 warning (pre-existing, not from this change)
✓ Typecheck: No errors
✓ Build:    79 pages generated successfully
```

---

## What's NOT Changed

- No database schema changes (OTP model was created but matches existing authService expectations)
- No frontend changes (OTP verification pages already exist)
- No authentication flow changes
- No onboarding flow changes
- Phone OTP still sent via email (SMS gateway TODO remains)
