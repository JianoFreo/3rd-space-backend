# MeetUp Community — Monolithic React + Express + Supabase

A JavaScript-only community event discovery platform based on the same MVC-inspired architecture used by TechCare.

## Stack
- React 19 + Vite + Tailwind CSS
- Express 5 + ESM JavaScript
- Supabase PostgreSQL via `@supabase/supabase-js` (service role used only by backend)
- JWT + bcryptjs authentication
- Multer + optional Cloudinary image storage
- Leaflet + OpenStreetMap
- WebSocket scaffold

## Roles
- **User:** discover, register, attend, review, earn rewards
- **Organizer:** create events and manage their events/attendance
- **Admin:** approve/reject events and view platform metrics

## Architecture
Browser → React → Axios → Express Routes → Middleware → Controllers → Supabase PostgreSQL

The backend serves `frontend/dist` in production, making the application a single deployable Node service.

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `backend/.env` and fill in Supabase URL, service-role key, and JWT secret.
4. `npm install --prefix backend`
5. `npm install --prefix frontend`
6. `npm run dev`
7. Open `http://localhost:5173`.

## Admin account
Registration intentionally allows only `user` and `organizer`. After registering a first account, change its `role` to `admin` in Supabase SQL Editor:

`update users set role = 'admin' where email = 'your-email@example.com';`

## OpenStreetMap
The app uses Leaflet with OpenStreetMap tiles and attribution. Event creation lets organizers click the map to save latitude/longitude. The backend also exposes a Nominatim geocoding endpoint at `/api/events/geocode` for future address search UI.

Do not expose the Supabase service-role key to the frontend.
