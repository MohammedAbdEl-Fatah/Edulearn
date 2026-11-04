# Requirements Document

## Introduction

This document defines the requirements for the **User Profile Management** feature of the EduLearn platform. The feature introduces four capabilities:

1. **Edit User Details** — allows authenticated users to update their profile fields (first name, last name, age, and phone number) via `PATCH /api/v1/user/edit-details`.
2. **Edit Password** — allows authenticated users to change their password by verifying their current password and confirming the new one via `PATCH /api/v1/user/edit-password`.
3. **Cron: Clean Expired/Revoked Tokens** — a daily scheduled job that purges Token documents that are expired or revoked from the database.
4. **Cron: Clean Unverified Users** — a daily scheduled job that deletes unverified User accounts whose OTPs have expired and that have exceeded the configurable retention window.

---

## Glossary

- **User**: A registered EduLearn platform user document stored in the MongoDB `users` collection, represented by the `IUser` interface.
- **Token**: A refresh-token document stored in the MongoDB `tokens` collection, represented by the `IToken` interface.
- **AuthMiddleware**: The Express middleware that verifies the access token and refresh token, attaches the authenticated `IUser` to `req.user`, and rejects unauthenticated or revoked requests.
- **UserService**: The service class responsible for processing `edit-details` and `edit-password` requests.
- **UserRepository**: The database repository wrapper for the `User` collection.
- **TokenRepository**: The database repository wrapper for the `Token` collection.
- **editDetailsSchema**: The Zod schema that validates the request body for the `edit-details` endpoint.
- **editPasswordSchema**: The Zod schema that validates the request body for the `edit-password` endpoint.
- **encryptValue**: The AES encryption utility function used to encrypt sensitive data (e.g., phone numbers) before storage.
- **decryptValue**: The AES decryption utility function, the inverse of `encryptValue`.
- **hashValue**: The bcrypt hashing utility function used to hash passwords before storage.
- **compareValue**: The bcrypt comparison utility function used to verify a plain-text value against a stored bcrypt hash.
- **EditDetailsDTO**: The data transfer object representing valid request body fields for the edit-details endpoint.
- **EditPasswordDTO**: The data transfer object representing the required request body fields for the edit-password endpoint.
- **CronJob**: A recurring scheduled task executed by `node-cron` at a configured time each day.
- **UNVERIFIED_RETENTION_MS**: A configurable millisecond duration representing the grace period after OTP expiry before an unverified user account is deleted. Defaults to 86400000 (24 hours).
- **isVerified**: A boolean field on the User document indicating whether the user has completed email/OTP verification.
- **otpExpires**: A Date field on the User document indicating when the user's OTP code expires.
- **isRevoked**: A boolean field on the Token document indicating whether the token has been explicitly revoked.
- **expires**: A Date field on the Token document indicating when the token naturally expires.
- **dob**: The date-of-birth field on the User document, derived from a client-supplied `age` integer.

---

## Requirements

### Requirement 1: Edit User Details Endpoint

**User Story:** As an authenticated user, I want to update my profile details (name, age, phone number), so that my account information stays accurate and up to date.

#### Acceptance Criteria

1. WHEN an authenticated user sends a `PATCH /api/v1/user/edit-details` request with at least one valid field (`firstName`, `lastName`, `age`, or `phone`), THE UserService SHALL update only the provided fields in the User document and return HTTP 200 with the message `"Details updated successfully"`.
2. WHEN the `edit-details` request body contains a `phone` field, THE UserService SHALL encrypt the phone value using `encryptValue` before writing it to the User document.
3. WHEN the `edit-details` request body contains an `age` field, THE UserService SHALL derive the `dob` value as `new Date(Date.now() - age * 365.25 * 24 * 60 * 60 * 1000)` and store `dob` in the User document instead of `age`.
4. WHEN the `edit-details` request body contains no recognized fields, THE editDetailsSchema SHALL reject the request and return HTTP 400 with a Zod validation error.
5. WHEN the `edit-details` request body contains unknown fields not defined in `EditDetailsDTO`, THE editDetailsSchema SHALL reject the request and return HTTP 400.
6. IF the `AuthMiddleware` cannot verify the access token or the refresh token for the `edit-details` request, THEN THE AuthMiddleware SHALL reject the request with HTTP 401 before the request reaches UserService.
7. IF the MongoDB update operation for `edit-details` fails, THEN THE UserService SHALL propagate the error to the global error handler, which SHALL return HTTP 500.
8. WHEN the `edit-details` request body contains a `firstName` field, THE editDetailsSchema SHALL require `firstName` to be a non-empty string with a minimum length of 2 characters.
9. WHEN the `edit-details` request body contains a `lastName` field, THE editDetailsSchema SHALL require `lastName` to be a non-empty string with a minimum length of 2 characters.
10. WHEN the `edit-details` request body contains an `age` field, THE editDetailsSchema SHALL require `age` to be a positive integer between 1 and 120 inclusive.

---

### Requirement 2: Edit Password Endpoint

**User Story:** As an authenticated user, I want to change my account password by providing my current password and a new confirmed password, so that I can maintain the security of my account.

#### Acceptance Criteria

1. WHEN an authenticated user sends a `PATCH /api/v1/user/edit-password` request with valid `currentPassword`, `newPassword`, and `confirmPassword` fields, THE UserService SHALL verify the current password, hash the new password, update the User document, and return HTTP 200 with the message `"Password updated successfully"`.
2. WHEN the `currentPassword` provided in the request does not match the bcrypt hash stored in `req.user.password`, THE UserService SHALL return HTTP 400 with the message `"Current password is incorrect"` and SHALL NOT write any update to the database.
3. WHEN `newPassword` does not equal `confirmPassword` in the request body, THE UserService SHALL return HTTP 400 with the message `"Passwords do not match"` and SHALL NOT write any update to the database.
4. WHEN both password checks pass, THE UserService SHALL hash `newPassword` using `hashValue` and persist the resulting hash to the User document's `password` field along with an updated `updatedAt` timestamp.
5. WHEN the `edit-password` request body is missing any of `currentPassword`, `newPassword`, or `confirmPassword`, THE editPasswordSchema SHALL reject the request and return HTTP 400 with a Zod validation error.
6. WHEN the `edit-password` request body contains a `newPassword` with fewer than 6 characters, THE editPasswordSchema SHALL reject the request and return HTTP 400.
7. WHEN the `edit-password` request body contains unknown fields, THE editPasswordSchema SHALL reject the request and return HTTP 400.
8. IF the `AuthMiddleware` cannot verify the access token or the refresh token for the `edit-password` request, THEN THE AuthMiddleware SHALL reject the request with HTTP 401 before the request reaches UserService.
9. IF the MongoDB update operation for `edit-password` fails, THEN THE UserService SHALL propagate the error to the global error handler, which SHALL return HTTP 500.

---

### Requirement 3: Validation Schemas

**User Story:** As a developer, I want strict Zod validation schemas for both new endpoints, so that invalid or malformed requests are rejected before they reach the service layer.

#### Acceptance Criteria

1. THE editDetailsSchema SHALL accept request bodies containing at least one of `firstName`, `lastName`, `age`, or `phone`, and SHALL reject bodies where none of these fields are present.
2. THE editPasswordSchema SHALL require all three fields (`currentPassword`, `newPassword`, `confirmPassword`) to be present and non-empty strings.
3. THE editPasswordSchema SHALL enforce a minimum length of 6 characters on `newPassword`.
4. THE editDetailsSchema SHALL use strict object validation (`.strict()`) to reject any unknown fields not defined in `EditDetailsDTO`.
5. THE editPasswordSchema SHALL use strict object validation (`.strict()`) to reject any unknown fields not defined in `EditPasswordDTO`.

---

### Requirement 4: Routing and Middleware Integration

**User Story:** As a developer, I want the two new PATCH routes to be correctly wired with authentication and validation middleware, so that all requests are authenticated and validated before processing.

#### Acceptance Criteria

1. THE userController SHALL mount the `PATCH /edit-details` route with `AuthMiddleware`, the `editDetailsSchema` validation middleware, and `UserService.editDetails` as the handler, in that order.
2. THE userController SHALL mount the `PATCH /edit-password` route with `AuthMiddleware`, the `editPasswordSchema` validation middleware, and `UserService.editPassword` as the handler, in that order.
3. WHEN the CORS configuration is applied, THE application SHALL include `PATCH` in the list of allowed HTTP methods so that the new routes are reachable from allowed origins.

---

### Requirement 5: Cron Job — Clean Expired/Revoked Tokens

**User Story:** As a system administrator, I want expired and revoked tokens to be automatically removed from the database every day, so that the Token collection does not grow unboundedly and stale tokens cannot be misused.

#### Acceptance Criteria

1. THE CronJob `cleanExpiredTokens` SHALL be scheduled to run every day at 02:00 server time using the `node-cron` expression `"0 2 * * *"`.
2. WHEN `cleanExpiredTokens` executes, THE TokenRepository SHALL delete all Token documents where `expires` is less than the current time OR `isRevoked` is `true`.
3. WHEN `cleanExpiredTokens` executes, THE CronJob SHALL preserve all Token documents that are neither expired nor revoked.
4. WHEN `cleanExpiredTokens` completes, THE CronJob SHALL log the count of deleted documents to the console.
5. IF the `deleteMany` operation in `cleanExpiredTokens` throws an error, THEN THE CronJob SHALL catch the error, log it to the console, and continue without crashing the application.

---

### Requirement 6: Cron Job — Clean Unverified Users

**User Story:** As a system administrator, I want unverified user accounts whose OTPs have expired beyond the configured retention window to be automatically deleted every day, so that the User collection remains clean and resources are not consumed by abandoned registrations.

#### Acceptance Criteria

1. THE CronJob `cleanUnverifiedUsers` SHALL be scheduled to run every day at 03:00 server time using the `node-cron` expression `"0 3 * * *"`.
2. WHEN `cleanUnverifiedUsers` executes, THE UserRepository SHALL delete all User documents where `isVerified` is `false`, `otpExpires` is less than the current time, AND `createdAt` is less than `(now - UNVERIFIED_RETENTION_MS)`.
3. WHEN `cleanUnverifiedUsers` executes, THE CronJob SHALL preserve all verified User documents and all unverified User documents whose `createdAt` is within the retention window.
4. THE `UNVERIFIED_RETENTION_MS` constant SHALL default to `86400000` (24 hours) and SHALL be overridable via an environment variable.
5. WHEN `cleanUnverifiedUsers` completes, THE CronJob SHALL log the count of deleted documents to the console.
6. IF the `deleteMany` operation in `cleanUnverifiedUsers` throws an error, THEN THE CronJob SHALL catch the error, log it to the console, and continue without crashing the application.

---

### Requirement 7: Cron Initialization

**User Story:** As a developer, I want both cron jobs to be registered once during application startup, so that they run automatically without any manual intervention.

#### Acceptance Criteria

1. THE `initCronJobs` function SHALL accept a `TokenRepository` instance and a `UserRepository` instance as parameters.
2. WHEN the `bootstrap` function in `app.controller.ts` executes, THE application SHALL call `initCronJobs` exactly once, passing the shared `TokenRepository` and `UserRepository` instances.
3. WHEN `initCronJobs` is called, THE function SHALL register both the `cleanExpiredTokens` and `cleanUnverifiedUsers` cron schedules before returning.

---

### Requirement 8: Encryption Round-Trip Integrity

**User Story:** As a developer, I want the phone encryption and decryption utilities to be inverse operations, so that stored encrypted phone values can be accurately recovered.

#### Acceptance Criteria

1. FOR ALL valid phone strings, applying `encryptValue` followed by `decryptValue` SHALL return a value equal to the original phone string.
2. WHEN `encryptValue` is called with a phone string, THE utility SHALL use the AES algorithm with the `ENCRYPT_KEY` environment variable as the key.

---

### Requirement 9: Password Hashing Round-Trip Integrity

**User Story:** As a developer, I want the password hashing and comparison utilities to be consistent, so that a password hashed with `hashValue` is always verifiable by `compareValue`.

#### Acceptance Criteria

1. FOR ALL valid password strings, `compareValue({ value: password, hash: hashValue(password) })` SHALL return `true`.
2. FOR ALL valid password strings `p1` and `p2` where `p1 !== p2`, `compareValue({ value: p1, hash: hashValue(p2) })` SHALL return `false`.
