# ROLLBACK PLAN

**Date:** 2026-06-12
**Risk Level:** MODERATE

---

## Pre-Deployment Backup

Before starting deployment, create a backup tag:

```bash
cd sportsOS-nodejs
git tag backup/pre-phase-7
git push origin backup/pre-phase-7
```

This preserves the exact state of the code before deployment.

---

## Rollback Scenarios

### Scenario 1: Deploy Fails (Render build error)

**Symptom:** Render shows deploy failure
**Action:** Fix the issue and push again, OR revert to previous commit

```bash
cd sportsOS-nodejs
git revert HEAD
git push origin main
```

Render will auto-deploy the reverted code.

---

### Scenario 2: Deploy Succeeds But API Broken

**Symptom:** Endpoints return errors after deploy
**Action:** Rollback to the pre-deployment commit

```bash
cd sportsOS-nodejs
git revert HEAD --no-edit
git push origin main
```

Render auto-deploys the reverted code (~2-5 min).

---

### Scenario 3: Database Migration Breaks Things

**Symptom:** After dropping collections and seeding, data is wrong
**Action:** Re-seed from seed scripts (they are idempotent — `deleteMany` + `insertMany`)

```bash
# Re-run seeds
export MONGODB_URI="<your-mongodb-uri>"
node seeds/seedAcademies.js
node seeds/seedCoaches.js
```

---

### Scenario 4: Need Full DB Restore

**Symptom:** Data is corrupted or lost
**Action:** Restore from MongoDB Atlas backup

1. Go to MongoDB Atlas → Backup
2. Select the most recent continuous backup
3. Click "Restore to Point-in-Time"
4. Choose restore point (before migration)
5. Wait for restore to complete

**Note:** Atlas free tier does NOT include backups. If no backup exists, data must be re-seeded.

---

### Scenario 5: Complete Rollback

**Symptom:** Everything is broken
**Action:** Rollback both code AND database

1. **Rollback code:**
   ```bash
   cd sportsOS-nodejs
   git reset --hard backup/pre-phase-7
   git push origin main --force
   ```

2. **Restore database:**
   - Drop all collections
   - Re-run OLD seed scripts (if they exist)
   - OR restore from Atlas backup

3. **Rollback frontend:**
   ```bash
   cd ..
   git revert HEAD
   git push origin backend-integration
   ```

---

## Rollback Decision Tree

```
Deploy fails?
  → YES → Fix and redeploy, OR revert commit
  → NO ↓

API broken after deploy?
  → YES → git revert HEAD, push, wait for auto-deploy
  → NO ↓

Database broken?
  → YES → Re-seed (seeds are idempotent)
  → NO ↓

Data lost?
  → YES → Restore from Atlas backup (if available)
  → NO ↓

Everything broken?
  → Full rollback: reset to backup tag, force push, restore DB
```

---

## Critical Notes

1. **Seed scripts are idempotent** — they call `deleteMany({})` before `insertMany`, so re-running is safe
2. **`users` collection is NOT touched** by seeds — existing user accounts are preserved
3. **Render auto-deploys on push** — no manual deploy needed
4. **Render free tier** — service sleeps after 15 min inactivity, cold start takes ~10s
5. **MongoDB Atlas free tier** — no automatic backups; consider upgrading before production
