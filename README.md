# MeetUp — Community & Social Good

A monolithic community event discovery platform built to follow the **TechCare architecture**, but written entirely in **JavaScript/JSX** instead of TypeScript.

## Stack
- Node.js + Express 5 + ESM
- Neon PostgreSQL using `@neondatabase/serverless` tagged-template SQL
- JWT + bcryptjs authentication
- Multer + optional Cloudinary image storage
- React 19 + Vite + Tailwind CSS 4
- React Router + Axios + Lucide
- OpenStreetMap + Leaflet + Nominatim
- WebSocket (`ws`)

## Architecture
```text
community-connect/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── websocket.js
│       ├── config/{db.js,env.js,cloudinary.js}
│       ├── middlewares/{auth.middleware.js,admin.middleware.js,multer.middleware.js}
│       ├── routes/{auth.route.js,admin.route.js,event.route.js,organizer.route.js,user.route.js,test.routes.js,doctor.route.js,labstaff.route.js,patient.route.js}
│       ├── controllers/{auth/,admin/,events/,reviews/,user/}
│       └── utils/{generateId.js,jwt.js,upload.js,asyncHandler.js}
├── frontend/
│   └── src/
│       ├── main.jsx / App.jsx
│       ├── auth/
│       ├── components/ui/
│       ├── events/
│       ├── map/
│       └── users/{admin,organizer,user}/
└── .env.example
```

## Neon setup
Create a Neon database and put the connection string in `.env` as `DATABASE_URL`. The backend automatically runs `CREATE TABLE IF NOT EXISTS` statements during startup, matching the TechCare pattern. The database layer is Neon PostgreSQL only.

## Run
```bash
npm install --prefix backend
npm install --prefix frontend
# copy .env.example to backend/.env and set DATABASE_URL/JWT_SECRET
npm run dev
# in a second terminal for Vite HMR:
cd frontend && npm run dev
```

For production:
```bash
npm run build
npm start
```

To create an admin, register normally, then run:
```sql
UPDATE users SET role='admin' WHERE email='your-email@example.com';
```

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/events`
- `GET /api/events/:id`
- `GET /api/events/geocode?q=...`
- `POST /api/events` organizer
- `POST /api/events/:id/register` authenticated user
- `POST /api/events/:id/reviews` authenticated user
- `GET /api/admin/dashboard` admin
- `GET /api/admin/events/pending` admin
- `PATCH /api/admin/events/:id/approval` admin
- `GET /api/organizer/events` organizer
- `GET /api/organizer/events/:id/registrations` organizer
- `PATCH /api/organizer/registrations/:id/attendance` organizer
- `GET /api/users/me`
- `GET /api/users/registrations`
- `GET /api/users/rewards`

The public map uses OpenStreetMap tiles and Nominatim for address lookup. Follow OpenStreetMap/Nominatim usage policies when deploying at scale.
