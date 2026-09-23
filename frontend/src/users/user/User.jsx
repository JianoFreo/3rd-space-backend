import { Link } from "react-router";
export default function User() {
  return (
    <main className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MY COMMUNITY</div>
          <h1>Keep showing up.</h1>
          <p className="muted">
            Your registrations and community rewards live here.
          </p>
        </div>
      </div>
      <div className="quick-grid">
        <Link className="card link-card" to="/user/registrations">
          <strong>My registrations</strong>
          <span>See the events you joined.</span>
        </Link>
        <Link className="card link-card" to="/user/rewards">
          <strong>Rewards</strong>
          <span>Track points earned from participation.</span>
        </Link>
      </div>
    </main>
  );
}
