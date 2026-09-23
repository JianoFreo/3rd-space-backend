import { useEffect, useState } from "react";
import { api } from "../../../lib/axios.js";
export default function Rewards() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/users/rewards").then((r) => setRows(r.data));
  }, []);
  const total = rows.reduce((s, r) => s + r.points, 0);
  return (
    <main className="page narrow">
      <div className="eyebrow">REWARDS</div>
      <h1>{total} community points.</h1>
      {rows.map((r) => (
        <div className="list-row" key={r.id}>
          <div>
            <strong>{r.description}</strong>
            <span>{new Date(r.created_at).toLocaleDateString()}</span>
          </div>
          <strong>+{r.points}</strong>
        </div>
      ))}
      {!rows.length && (
        <div className="empty">Attend events to start earning rewards.</div>
      )}
    </main>
  );
}
