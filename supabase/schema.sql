create type user_role as enum ('admin','organizer','user');

create type event_category as enum ('sports','lifestyle','community','networking','others');

create type event_modality as enum ('in-person','hybrid','online');

create type event_status as enum ('open','closed','cancelled','finished');

create type approval_status as enum ('pending','approved','rejected');

create table if not exists users (
    id bigint generated always as identity primary key,
    name text not null,
    email text unique not null,
    password_hash text not null,
    role user_role not null default 'user',
    created_at timestamptz default now(),
    img_url text
);

create table if not exists events (
    id bigint generated always as identity primary key,
    title text not null,
    event_category event_category not null,
    description text not null,
    location text not null,
    start_date date not null,
    end_date date not null,
    time text not null,
    capacity integer,
    reward_type text,
    modality event_modality not null,
    status event_status not null default 'open',
    approval_status approval_status not null default 'pending',
    approved_by bigint references users (id) on delete set null,
    organizer_id bigint not null references users (id) on delete cascade,
    created_at timestamptz default now(),
    img_url text,
    latitude double precision,
    longitude double precision
);

create table if not exists event_registrations (
    id bigint generated always as identity primary key,
    event_id bigint not null references events (id) on delete cascade,
    user_id bigint not null references users (id) on delete cascade,
    registration_date timestamptz default now(),
    attended boolean default false,
    unique (event_id, user_id)
);

create table if not exists reviews (
    id bigint generated always as identity primary key,
    event_id bigint not null references events (id) on delete cascade,
    user_id bigint not null references users (id) on delete cascade,
    rating integer not null check (rating between 1 and 5),
    comment text,
    created_at timestamptz default now(),
    unique (event_id, user_id)
);

create table if not exists rewards (
    id bigint generated always as identity primary key,
    user_id bigint not null references users (id) on delete cascade,
    event_id bigint references events (id) on delete set null,
    type text not null,
    points integer not null default 0,
    description text,
    created_at timestamptz default now()
);

create index if not exists events_organizer_idx on events (organizer_id);

create index if not exists events_approval_idx on events (approval_status);

create index if not exists registrations_event_idx on event_registrations (event_id);