import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "./AuthLayout.jsx";
import { api, setSession } from "../lib/axios.js";
export default function SignupPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      setSession(data);
      nav(form.role === "organizer" ? "/organizer" : "/user");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
    }
  };
  return (
    <AuthLayout
      title="Join MeetUp"
      subtitle="Create an account and start finding your third place."
    >
      <form onSubmit={submit} className="stack">
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            minLength="8"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <label>
          I am a
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">Participant</option>
            <option value="organizer">Organizer</option>
          </select>
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn full">Create account</button>
        <p className="center muted">
          Already registered?{" "}
          <Link className="text-link" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
