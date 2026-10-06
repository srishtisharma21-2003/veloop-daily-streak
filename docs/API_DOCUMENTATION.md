# VELoop Daily Streak API Documentation

Base URL: http://localhost:5000/api

All authenticated endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

## Authentication

### POST /auth/register

Creates a user and wallet.

Request body:

```json
{
  "name": "Srishti",
  "email": "srishti@test.com",
  "password": "test123"
}
```

Response:

```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "<id>",
    "name": "Srishti",
    "email": "srishti@test.com"
  }
}
```

### POST /auth/login

```json
{
  "email": "srishti@test.com",
  "password": "test123"
}
```

### GET /auth/me

Returns the authenticated user profile.

## Daily Streak

### GET /daily-streak

Returns the current streak status and reward state.

Example response:

```json
{
  "success": true,
  "currentStreak": 1,
  "currentDay": 2,
  "checkedIn": 1,
  "totalRewards": 7,
  "status": "ACTIVE",
  "nextClaimAt": "2026-10-07T02:48:39.374Z",
  "serverTime": "2026-10-06T02:48:39.988Z",
  "isClaimable": false,
  "wasReset": false,
  "cycleNumber": 1,
  "rewards": []
}
```

### POST /daily-streak/claim

No request body is required. The backend builds the claim logic from the JWT user identity.

Success response:

```json
{
  "success": true,
  "message": "Reward claimed!",
  "claimedDay": 1,
  "reward": {
    "type": "VES",
    "amount": 5,
    "currency": "VES"
  },
  "wallet": {
    "balance": 105,
    "currency": "VES"
  }
}
```

### GET /daily-streak/history

Returns user claim history.

## Wallet

### GET /wallet

```json
{
  "success": true,
  "balance": 105,
  "currency": "VES"
}
```
