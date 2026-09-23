# Community Events Backend

Express + PostgreSQL (Neon) + JWT + Cloudinary. JavaScript only.

## Setup
1. Create a Neon PostgreSQL database.
2. Run `sql/schema.sql` in the Neon SQL editor.
3. Copy `.env.example` to `.env` and fill the Neon/Cloudinary/JWT values.
4. `npm install`
5. `npm run dev`

Base URL: `http://localhost:5000/api`

Implemented endpoints:
- GET /health
- POST /auth/login
- POST /auth/register
- GET /auth/me
- GET /events?category=&search=
- GET /events?organizer=me
- GET /events/:id
- POST /events
- PATCH /events/:id/status
- POST /events/:id/register
- GET /events/:id/registrations
- GET /events/nearby?lat=&lng=&radius=
- GET /me/rewards
- GET /me/registrations
- GET /admin/leaderboard
- GET /admin/users
- PATCH /admin/users/:id
- GET /admin/analytics

The API uses direct SQL through `pg`, matching the requested Neon architecture. JWT signing uses a server-side secret; do not commit real credentials.
