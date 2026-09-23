import { useState } from "react";
import { api } from "../lib/axios.js";
export default function LocationPicker({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const search = async () => {
    if (!q.trim()) return;
    const { data } = await api.get("/events/geocode", { params: { q } });
    setResults(data);
  };
  return (
    <div className="stack">
      <div className="inline">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search address or place"
        />
        <button type="button" className="btn" onClick={search}>
          Find
        </button>
      </div>
      {results.map((r) => (
        <button
          type="button"
          className="location-result"
          key={r.place_id}
          onClick={() => onSelect(r)}
        >
          {r.display_name}
        </button>
      ))}
    </div>
  );
}
