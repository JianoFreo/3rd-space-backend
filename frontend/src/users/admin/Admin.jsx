import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../lib/axios.js";
export default function Admin() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const load = () =>
    Promise.all([
      api.get("/admin/dashboard"),
      api.get("/admin/events/pending"),
    ]).then(([a, b]) => {
      setStats(a.data);
      setPending(b.data);
    });
  useEffect(() => {
    load();
  }, []);
  const decide = async (id, status) => {
    await api.patch(`/admin/events/${id}/approval`, {
      approval_status: status,
    });
    load();
  };
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ADMIN</div>
          <h1>Community operations.</h1>
          <p className="muted">
            Review organizers and keep event listings trustworthy.
          </p>
        </div>
      </div>
      {stats && (
        <div className="stats">
          {[
            ["Users", stats.users],
            ["Events", stats.events],
            ["Pending", stats.pending_events],
            ["Registrations", stats.registrations],
          ].map((x) => (
            <div className="stat" key={x[0]}>
              <span>{x[0]}</span>
              <strong>{x[1]}</strong>
            </div>
          ))}
        </div>
      )}
      <section className="section">
        <h2>Pending events</h2>
        {pending.map((e) => (
          <div className="approval-row" key={e.event_id}>
            <div>
              <strong>{e.title}</strong>
              <span>
                {e.organizer_name} · {e.start_date} · {e.location}
              </span>
            </div>
            <div className="actions">
              <button
                className="btn"
                onClick={() => decide(e.event_id, "approved")}
              >
                Approve
              </button>
              <button
                className="btn ghost"
                onClick={() => decide(e.event_id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
        {!pending.length && (
          <div className="empty">Nothing waiting for approval.</div>
        )}
        <Link className="text-link" to="/events">
          View public events →
        </Link>
      </section>
    </main>
  );
}
