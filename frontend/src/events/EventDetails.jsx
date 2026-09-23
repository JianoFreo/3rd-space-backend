import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api, getStoredUser } from "../lib/axios.js";
import { CalendarDays, MapPin, Users, Star } from "lucide-react";
import EventMap from "../map/EventMap.jsx";
export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const user = getStoredUser();
  useEffect(() => {
    api.get(`/events/${id}`).then((r) => setEvent(r.data));
  }, [id]);
  if (!event)
    return (
      <main className="page">
        <div className="empty">Loading…</div>
      </main>
    );
  const register = async () => {
    try {
      const r = await api.post(`/events/${id}/register`);
      setMessage(r.data.message);
    } catch (e) {
      setMessage(e.response?.data?.message || "Registration failed");
    }
  };
  const review = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/events/${id}/reviews`, { rating, comment });
      setMessage("Review submitted");
      setComment("");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not submit review");
    }
  };
  return (
    <main className="page detail">
      <Link className="text-link" to="/events">
        ← Back to events
      </Link>
      <div className="detail-grid">
        <section>
          <div className="detail-hero">
            {event.img_url ? (
              <img src={event.img_url} alt="" />
            ) : (
              <div className="event-placeholder large">
                <CalendarDays size={50} />
              </div>
            )}
          </div>
          <div className="eyebrow">
            {event.event_category} · {event.modality}
          </div>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className="detail-meta">
            <span>
              <CalendarDays /> {event.start_date} to {event.end_date} ·{" "}
              {event.event_time || "Time TBA"}
            </span>
            <span>
              <MapPin /> {event.location || "Location TBA"}
            </span>
            <span>
              <Users /> {event.registered_count || 0}
              {event.capacity ? ` / ${event.capacity}` : ""} registered
            </span>
          </div>
          {event.latitude && event.longitude && (
            <EventMap
              events={[event]}
              center={[event.latitude, event.longitude]}
            />
          )}
          <h2>Reviews</h2>
          {event.reviews?.map((r) => (
            <div className="review" key={r.id}>
              <strong>{r.user_name}</strong>
              <span>{"★".repeat(r.rating)}</span>
              <p>{r.comment}</p>
            </div>
          ))}
        </section>
        <aside className="side-card">
          <div className="eyebrow">ORGANIZED BY</div>
          <h3>{event.organizer_name}</h3>
          <p className="muted">
            {event.reward_type || "Community participation"}
          </p>
          {user ? (
            <button className="btn full" onClick={register}>
              Join this event
            </button>
          ) : (
            <Link className="btn full" to="/login">
              Sign in to join
            </Link>
          )}
          {message && <div className="notice">{message}</div>}
          {user && (
            <form onSubmit={review} className="stack top-gap">
              <h3>Leave a review</h3>
              <label>
                Rating
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Good</option>
                  <option value="3">3 — Okay</option>
                  <option value="2">2 — Poor</option>
                  <option value="1">1 — Bad</option>
                </select>
              </label>
              <textarea
                placeholder="What was the experience like?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn">
                Submit review <Star size={15} />
              </button>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}
