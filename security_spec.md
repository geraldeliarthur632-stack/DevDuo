# DevDuo Security Specification

## 1. Data Invariants
- Each user document lives at `/users/{userId}` where `{userId}` strictly matches `request.auth.uid`.
- Non-admin users cannot alter their own `isAdmin` flag or access other users' private profiles.
- Any write to `/users/{userId}` requires authentication and strict schema field validation.

## 2. The Dirty Dozen Payloads
1. Attempt to create `/users/other_user_id` with `auth.uid = victim` -> REJECT (Identity mismatch).
2. Attempt to write ghost fields like `hackRole: "superadmin"` -> REJECT (`hasOnly` validation).
3. Attempt to update document with `isAdmin: true` by non-admin -> REJECT.
4. Attempt to write 100KB payload into `name` -> REJECT (size limit exceeded).
5. Attempt unauthenticated write to `/users/{userId}` -> REJECT (`isSignedIn()` false).
6. Attempt to list all documents in `/users` by regular student -> REJECT (list restricted to admin).
7. Attempt to delete another student's profile -> REJECT.
8. Attempt to inject invalid string characters into `{userId}` path -> REJECT (`isValidId`).
9. Attempt to forge arbitrary collections like `/admin_secrets` -> REJECT (default-deny catch-all).
10. Attempt to read other student's email / progress -> REJECT (`isOwner(userId)`).
11. Attempt to change user `id` field inside payload to another UID -> REJECT (`incoming().id == userId`).
12. Attempt to bypass rules without auth token -> REJECT.
