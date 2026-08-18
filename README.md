# Learniee — Parent Dashboard with Course Search

A small version of the Learniee parent dashboard: real auth, a polished
dashboard, and a course search experience with combinable filters, sorting,
and pagination.

## What I built

- **Auth (real, working)** — Sign up / log in with a hashed password
  (bcrypt), a signed session token (JWT) stored in an `httpOnly` cookie,
  and a `proxy.ts` (Next.js middleware) that protects `/dashboard` and
  redirects logged-in users away from `/login` and `/signup`. Sessions
  persist across refreshes for 7 days.
- **Parent Dashboard** — Shows the logged-in parent's name, email, child's
  name, and join date in a header card, then leads into course search.
- **Course Search**
  - Free-text search across course name and subject (debounced).
  - Combinable filters: Grade, Subject, Price range (min/max), Teacher
    rating (4.5+, 4.0+, 3.5+).
  - Sorting: price (low↔high), rating (high→low), grade (low→high).
  - "Load more" pagination (6 results per page) once results exceed the
    page size.
  - Clean "no courses match your search" state with a one-click way to
    clear filters.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- bcryptjs + jsonwebtoken for auth
- No external UI kit — hand-built components for full control over the
  dashboard/course-card layout.

## Where data is stored

Per the assignment rules, this uses local JSON files instead of a hosted
database — no setup needed to run it.

- `data/users.json` — parent accounts (password stored as a bcrypt hash,
  never plaintext).
- `data/courses.json` — the course catalog (30 seeded courses across 5
  subjects and grades 3–12).

Example row from `data/courses.json`:

```json
{
  "id": "c001",
  "name": "Foundations of Mathematics",
  "subject": "Mathematics",
  "grade": 3,
  "teacher": "Anita Sharma",
  "rating": 4.6,
  "price": 1499,
  "durationWeeks": 8,
  "description": "Builds number sense, basic arithmetic, and problem-solving for young learners."
}
```

Reads/writes go through `lib/db.ts`, which is the only place that touches
the filesystem — swapping this for SQLite or a real database later only
means changing that one file.

## Assumptions made (brief was ambiguous here)

- "Show the logged-in user's info" → I show parent name, email, child's
  name (collected at signup, optional), and join date, since the brief
  didn't specify which fields.
- Course "Book now" is a UI affordance only — no booking/payment flow was
  in scope, so the button doesn't submit anywhere yet.
- Pagination via "Load more" rather than numbered pages — fits a parent
  scrolling through search results better, and the brief allowed either.
- Teacher rating filter uses fixed thresholds (4.5+/4.0+/3.5+) instead of
  a free-form slider, to keep filtering fast and combinable with everything
  else without extra UI complexity.

## What I'd improve with more time

- Move storage to SQLite (with Prisma) so concurrent writes to
  `users.json` can't race under load.
- Add debounced server-side full-text search (current search is a simple
  substring match) and highlight matching terms in results.
- Real booking flow: a course detail page, a cart/checkout step, and a
  "My bookings" section on the dashboard.
- Password reset flow and email verification.
- Unit tests for the filter/sort/pagination logic in the `/api/courses`
  route, and integration tests for the auth flow.
- Skeleton/empty states are basic — could add richer illustrations and
  a save-search / favorite-course feature.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects to `/login`. Sign up for a
new account to get a session and land on `/dashboard`.

## Deployment

Deployed on Vercel (works out of the box since it's a standard Next.js
app with no external database):

**Live link:** _add your Vercel URL here after deploying_
**GitHub repo:** _add your repo link here after pushing_
