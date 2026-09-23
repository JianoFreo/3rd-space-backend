import { Link, useLocation } from "react-router";
export default function Organizer() {
  const location = useLocation();
  return (
    <div>
      <div className="role-nav">
        <Link to="/organizer">Dashboard</Link>
        <Link to="/organizer/create">Create event</Link>
        <Link to="/events">Discover</Link>
      </div>
      {location.pathname.endsWith("/create") ? <></> : null}
    </div>
  );
}
