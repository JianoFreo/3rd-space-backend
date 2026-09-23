CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 auth_user_id uuid,
 name text NOT NULL,
 email text NOT NULL UNIQUE,
 role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','organizer','admin')),
 img_url text,
 password text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title text NOT NULL,
 description text NOT NULL,
 event_category text,
 address text NOT NULL,
 location geography(Point,4326),
 latitude double precision,
 longitude double precision,
 start_date date NOT NULL,
 end_date date,
 start_time time NOT NULL,
 capacity integer NOT NULL CHECK (capacity > 0),
 status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','cancelled','completed')),
 fee_type text,
 reward_type text,
 modality text NOT NULL CHECK (modality IN ('in-person','hybrid','online')),
 approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
 organizer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 img_url text,
 created_at timestamptz NOT NULL DEFAULT now(),
 approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected','changes_requested'))
);

CREATE TABLE IF NOT EXISTS event_registrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 registration_date timestamptz NOT NULL DEFAULT now(),
 status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','waitlisted','cancelled')),
 UNIQUE(event_id,user_id)
);

CREATE TABLE IF NOT EXISTS rewards (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 event_id uuid REFERENCES events(id) ON DELETE SET NULL,
 type text,
 amount numeric NOT NULL DEFAULT 0,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','granted')),
 created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_approval ON events(approval_status);
CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reg_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_events_location ON events USING gist(location);

CREATE OR REPLACE FUNCTION sync_event_location() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
   NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude),4326)::geography;
 END IF;
 RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_sync_event_location ON events;
CREATE TRIGGER trg_sync_event_location BEFORE INSERT OR UPDATE OF latitude,longitude ON events FOR EACH ROW EXECUTE FUNCTION sync_event_location();

CREATE OR REPLACE FUNCTION nearby_events(p_lat double precision,p_lng double precision,p_radius_m double precision)
RETURNS TABLE(id uuid,title text,event_category text,address text,description text,latitude double precision,longitude double precision,start_time time)
LANGUAGE sql AS $$
 SELECT e.id,e.title,e.event_category,e.address,e.description,e.latitude,e.longitude,e.start_time
 FROM events e
 WHERE e.approval_status='approved' AND e.status='submitted'
 AND e.location IS NOT NULL
 AND ST_DWithin(e.location,ST_SetSRID(ST_MakePoint(p_lng,p_lat),4326)::geography,p_radius_m)
 ORDER BY ST_Distance(e.location,ST_SetSRID(ST_MakePoint(p_lng,p_lat),4326)::geography);
$$;

CREATE OR REPLACE FUNCTION leaderboard_rewards()
RETURNS TABLE(user_id uuid,name text,img_url text,total_amount numeric)
LANGUAGE sql AS $$
 SELECT u.id,u.name,u.img_url,COALESCE(SUM(r.amount),0) total_amount
 FROM users u LEFT JOIN rewards r ON r.user_id=u.id AND r.status='granted'
 GROUP BY u.id,u.name,u.img_url ORDER BY total_amount DESC;
$$;

CREATE OR REPLACE FUNCTION monthly_registrations()
RETURNS TABLE(month date,count bigint)
LANGUAGE sql AS $$
 SELECT date_trunc('month',registration_date)::date,COUNT(*)
 FROM event_registrations GROUP BY 1 ORDER BY 1;
$$;
