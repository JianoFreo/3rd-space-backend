import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "./AuthLayout.jsx";
import { api, setSession } from "../lib/axios.js";
export default function LoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      setSession(data);
      nav(
        data.user.role === "admin"
          ? "/admin"
          : data.user.role === "organizer"
            ? "/organizer"
            : "/user",
      );
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    }
  };
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your community."
    >
      <form onSubmit={submit} className="stack">
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
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <div className="error">{error}</div>}
        <button className="btn full">Sign in</button>
        <p className="center muted">
          No account?{" "}
          <Link className="text-link" to="/sign-up">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
