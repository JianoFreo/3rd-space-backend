import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../../lib/axios.js";
export default function ManageEvent() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const load = () =>
    api
      .get(`/organizer/events/${id}/registrations`)
      .then((r) => setRows(r.data));
  useEffect(() => {
    load();
  }, [id]);
  const attendance = async (reg, attended) => {
    await api.patch(`/organizer/registrations/${reg.id}/attendance`, {
      attended,
    });
    load();
  };
  return (
    <main className="page narrow">
      <div className="eyebrow">ATTENDEES</div>
      <h1>Event registrations.</h1>
      {rows.map((r) => (
        <div className="list-row" key={r.id}>
          <div>
            <strong>{r.name}</strong>
            <span>{r.email}</span>
          </div>
          <button
            className="btn small"
            onClick={() => attendance(r, !r.attended)}
          >
            {r.attended ? "Undo attendance" : "Mark attended"}
          </button>
        </div>
      ))}
    </main>
  );
}
