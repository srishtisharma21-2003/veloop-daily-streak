# Testing Documentation

## Setup

1. Start the backend:

```bash
cd backend
npm run dev
```

2. Start the frontend:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

3. Open http://localhost:5173 or the active Vite port in the browser.

## Manual API Tests

### Register user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t1@test.com","password":"test123"}'
```

### Check streak status

```bash
TOKEN="<jwt>"
curl http://localhost:5000/api/daily-streak \
  -H "Authorization: Bearer $TOKEN"
```

### Claim Day 1

```bash
curl -X POST http://localhost:5000/api/daily-streak/claim \
  -H "Authorization: Bearer $TOKEN"
```

### Duplicate claim

Run the same claim request again immediately.

Expected result: fail with a duplicate or cooldown error.

## Anti-cheat Checks

- Tampering with client-side state does not affect server validation.
- Claim data from the client is ignored and re-derived from the JWT user.
- Duplicate claims are rejected.
- Missing previous-day validation is rejected.
- Concurrent claims are serialized by the database transaction logic.

## Missed-day Reset Flow

1. Claim the first reward.
2. Skip the next day beyond the allowed gap.
3. Refresh the streak page.
4. Expect the app to reset to Day 1 or a fresh cycle state as enforced by the backend.
