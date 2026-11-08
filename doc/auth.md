# Admin auth

Email and password sign-in for staff. There is no public customer account.

**Session:** [`src/lib/auth.ts`](../src/lib/auth.ts)  
**Passwords:** [`src/lib/password.ts`](../src/lib/password.ts)  
**Login action:** [`src/features/admin-login/actions/login.ts`](../src/features/admin-login/actions/login.ts)

See also: [Database](./database.md), [Listings](./listings.md)

---

## Goals

- The browser never stores the password.
- A wrong email, a wrong password, and a disabled account look the same to the client.
- The first account exists only when the `users` table is empty.

---

## Session

The cookie name is `admin_session`. It is `httpOnly`, `sameSite: lax`, and `path: /`. `secure` is on when `NODE_ENV` is `production`. The cookie lasts 7 days.

The value is `<payload>.<signature>`. The payload is base64url JSON with `userId` and `exp`. The signature is HMAC-SHA256 of that payload, using `AUTH_SECRET`. The cookie does not contain the password.

`readActiveAdmin` loads the user from Prisma. A missing user or a user with `isActive: false` is treated as signed out. The panel layout in `src/app/admin/(panel)/layout.tsx` then redirects to `/admin/login`.

There is no `middleware.ts`. The login page itself redirects an already active admin to `/admin`.

---

## Passwords

`src/lib/password.ts` hashes with Node `scrypt`. Parameters are `N=16384`, `r=8`, `p=1`, a 64-byte key, and a 16-byte salt. The stored value looks like `scrypt$16384$8$1$<salt>$<hash>`. Comparison uses `timingSafeEqual`. Passwords must be 8 to 72 characters.

A value in the database that does not start with that prefix fails verification.

---

## First super admin

`login` counts rows in `users`. When the count is 0, it creates one user:

- name `Super Admin`
- email `ADMIN_EMAIL`, stored in lower case
- password `ADMIN_PASSWORD`, stored as a hash
- role `SUPER_ADMIN`

Later accounts are created in `/admin/admins`. That screen always sets role `ADMIN`.

---

## Sign-in result

The form and the server action share `loginFormSchema`. A failed login returns `Invalid email or password.` for each of these cases:

- the email is not in `users`
- the account is inactive
- the password does not match

---

## Rate limiting

`src/lib/rate-limit.ts` enforces an in-memory sliding window rate limit per client IP (`x-forwarded-for` / `x-real-ip`).

- Maximum 7 attempts per IP within a 15-minute sliding window.
- When exceeded, `login` returns a friendly countdown message and aborts immediately without running CPU-heavy `scrypt` hashing.
- Successful authentication immediately clears the tracker for that IP via `resetRateLimit`.

---

## Roles

| Role          | What they can do                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ADMIN`       | Create and edit plots and flats. The Admins nav item is hidden. `/admin/admins` redirects to `/admin`.                               |
| `SUPER_ADMIN` | Everything an admin can do, plus delete a listing. On `/admin/admins`: create an `ADMIN`, turn that account on or off, or delete it. |

A super admin cannot change their own active flag, delete their own account, or change another super admin. Status and delete actions refuse any target whose role is not `ADMIN`.

---

## Not built yet

- Request middleware. The layout and the login page do the redirects.
- Dashboard counts on `/admin`. The page is a title.
- Leads. There is no leads table. The home contact form does not save a submission.
- Website contact stored in the database. The public site reads [`src/config/site.ts`](../src/config/site.ts).
- Changing another admin's password.
- Changing your own password.

---

## Related files

- [`src/lib/auth.ts`](../src/lib/auth.ts)
- [`src/lib/password.ts`](../src/lib/password.ts)
- [`src/features/admin-login/actions/login.ts`](../src/features/admin-login/actions/login.ts)
- [`src/app/admin/(panel)/layout.tsx`](<../src/app/admin/(panel)/layout.tsx>)
- [`src/app/admin/login/page.tsx`](../src/app/admin/login/page.tsx)
- [`src/features/admin-accounts/actions/create-admin.ts`](../src/features/admin-accounts/actions/create-admin.ts)
