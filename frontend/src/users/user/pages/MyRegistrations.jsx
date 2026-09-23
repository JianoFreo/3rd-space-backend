import { useEffect, useState } from "react";
import { api } from "../../../lib/axios.js";
export default function MyRegistrations() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/users/registrations").then((r) => setRows(r.data));
  }, []);
  return (
    <main className="page narrow">
      <div className="eyebrow">MY REGISTRATIONS</div>
      <h1>Upcoming community plans.</h1>
      {rows.map((r) => (
        <div className="list-row" key={r.id}>
          <div>
            <strong>{r.title}</strong>
            <span>
              {r.start_date} · {r.location || "Online"}
            </span>
          </div>
          <span className="badge">
            {r.attended ? "Attended" : "Registered"}
          </span>
        </div>
      ))}
      {!rows.length && (
        <div className="empty">You have no registrations yet.</div>
      )}
    </main>
  );
}
