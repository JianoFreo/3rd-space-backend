import { Link, useNavigate } from "react-router";
import { CalendarDays, LogOut, MapPinned } from "lucide-react";
import { clearSession, getStoredUser } from "../lib/axios.js";
export default function Header() {
  const nav = useNavigate();
  const user = getStoredUser();
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <CalendarDays size={22} />
        MeetUp
      </Link>
      <nav>
        <Link to="/events">Discover</Link>
        <Link to="/map">
          <MapPinned size={17} />
          Map
        </Link>
        {user && (
          <span className="user-chip">
            {user.name} · {user.role}
          </span>
        )}
        {user ? (
          <button
            className="icon-btn"
            onClick={() => {
              clearSession();
              nav("/login");
            }}
          >
            <LogOut size={18} />
          </button>
        ) : (
          <Link className="btn small" to="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
