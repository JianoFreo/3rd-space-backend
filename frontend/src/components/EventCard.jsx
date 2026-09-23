import { Link } from "react-router";
import { CalendarDays, MapPin, Users } from "lucide-react";
export default function EventCard({ event }) {
  return (
    <article className="event-card">
      {event.img_url ? (
        <img src={event.img_url} alt="" />
      ) : (
        <div className="event-placeholder">
          <CalendarDays size={34} />
        </div>
      )}
      <div className="event-body">
        <div className="eyebrow">
          {event.event_category} · {event.modality}
        </div>
        <h3>{event.title}</h3>
        <p className="muted">
          <MapPin size={15} />
          {event.location || "Location TBA"}
        </p>
        <p className="muted">
          <CalendarDays size={15} />
          {event.start_date}
          {event.event_time ? ` · ${event.event_time}` : ""}
        </p>
        <p className="muted">
          <Users size={15} />
          {event.registered_count || 0}
          {event.capacity ? ` / ${event.capacity}` : ""} registered
        </p>
        <Link className="text-link" to={`/events/${event.event_id}`}>
          View event →
        </Link>
      </div>
    </article>
  );
}
