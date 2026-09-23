import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../../lib/axios.js";
export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    api.get("/organizer/events").then((r) => setEvents(r.data));
  }, []);
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ORGANIZER</div>
          <h1>Your events.</h1>
          <p className="muted">
            Create a gathering, submit it for review, then track participation.
          </p>
        </div>
        <Link className="btn" to="/organizer/create">
          Create event
        </Link>
      </div>
      <div className="event-grid">
        {events.map((e) => (
          <div className="card" key={e.event_id}>
            <div className="eyebrow">
              {e.approval_status} · {e.status}
            </div>
            <h3>{e.title}</h3>
            <p className="muted">
              {e.start_date} · {e.registered_count || 0} registered
            </p>
            <Link className="text-link" to={`/organizer/events/${e.event_id}`}>
              Manage registrations →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
