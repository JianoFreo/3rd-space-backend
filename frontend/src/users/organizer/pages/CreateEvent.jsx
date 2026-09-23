import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../lib/axios.js";
import LocationPicker from "../../../map/LocationPicker.jsx";
export default function CreateEvent() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    event_category: "community",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    start_date: "",
    end_date: "",
    event_time: "",
    capacity: 20,
    reward_type: "",
    modality: "in-person",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const change = (k, v) => setForm({ ...form, [k]: v });
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("image", file);
    try {
      await api.post("/events", fd);
      nav("/organizer");
    } catch (e) {
      setError(e.response?.data?.message || "Could not create event");
    }
  };
  return (
    <main className="page narrow">
      <div className="eyebrow">NEW EVENT</div>
      <h1>Create a community event.</h1>
      <form onSubmit={submit} className="stack">
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
          />
        </label>
        <div className="two">
          <label>
            Category
            <select
              value={form.event_category}
              onChange={(e) => change("event_category", e.target.value)}
            >
              <option>sports</option>
              <option>lifestyle</option>
              <option>community</option>
              <option>networking</option>
              <option>others</option>
            </select>
          </label>
          <label>
            Modality
            <select
              value={form.modality}
              onChange={(e) => change("modality", e.target.value)}
            >
              <option>in-person</option>
              <option>hybrid</option>
              <option>online</option>
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea
            required
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
          />
        </label>
        <label>Location</label>
        <LocationPicker
          onSelect={(r) =>
            setForm({
              ...form,
              location: r.display_name,
              latitude: r.lat,
              longitude: r.lon,
            })
          }
        />
        <div className="two">
          <label>
            Start date
            <input
              type="date"
              required
              value={form.start_date}
              onChange={(e) => change("start_date", e.target.value)}
            />
          </label>
          <label>
            End date
            <input
              type="date"
              required
              value={form.end_date}
              onChange={(e) => change("end_date", e.target.value)}
            />
          </label>
        </div>
        <div className="two">
          <label>
            Time
            <input
              value={form.event_time}
              onChange={(e) => change("event_time", e.target.value)}
              placeholder="6:00 PM"
            />
          </label>
          <label>
            Capacity
            <input
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => change("capacity", e.target.value)}
            />
          </label>
        </div>
        <label>
          Reward / incentive
          <input
            value={form.reward_type}
            onChange={(e) => change("reward_type", e.target.value)}
            placeholder="10 community points"
          />
        </label>
        <label>
          Cover image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn">Submit for approval</button>
      </form>
    </main>
  );
}
