import { useEffect, useState } from "react";
import EventCard from "../components/EventCard.jsx";
import { api } from "../lib/axios.js";
export default function DiscoverEvents() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const load = () =>
    api
      .get("/events", { params: { search: q, category } })
      .then((r) => setEvents(r.data));
  useEffect(() => {
    load();
  }, [category]);
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">DISCOVER</div>
          <h1>Events worth leaving home for.</h1>
          <p className="muted">
            Find sports, community activities, networking, and low-cost ways to
            meet people.
          </p>
        </div>
      </div>
      <div className="filters">
        <input
          placeholder="Search events or places"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option>sports</option>
          <option>lifestyle</option>
          <option>community</option>
          <option>networking</option>
          <option>others</option>
        </select>
        <button className="btn" onClick={load}>
          Search
        </button>
      </div>
      <div className="event-grid">
        {events.map((e) => (
          <EventCard key={e.event_id} event={e} />
        ))}
      </div>
      {!events.length && <div className="empty">No approved events found.</div>}
    </main>
  );
}
