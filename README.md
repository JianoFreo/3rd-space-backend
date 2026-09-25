# MeetUp — Community & Social Good

## Stack
- Node.js + Express 5 + ESM
- Neon PostgreSQL
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
