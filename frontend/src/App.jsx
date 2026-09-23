import { Routes, Route, Navigate, Link } from "react-router";
import Header from "./components/Header.jsx";
import DiscoverEvents from "./events/DiscoverEvents.jsx";
import EventDetails from "./events/EventDetails.jsx";
import MapPage from "./map/MapPage.jsx";
import LoginPage from "./auth/LoginPage.jsx";
import SignupPage from "./auth/SignupPage.jsx";
import ProtectRoute from "./utils/protectRoute.jsx";
import Admin from "./users/admin/Admin.jsx";
import OrganizerDashboard from "./users/organizer/pages/OrganizerDashboard.jsx";
import CreateEvent from "./users/organizer/pages/CreateEvent.jsx";
import ManageEvent from "./users/organizer/pages/ManageEvent.jsx";
import User from "./users/user/User.jsx";
import MyRegistrations from "./users/user/pages/MyRegistrations.jsx";
import Rewards from "./users/user/pages/Rewards.jsx";

function Home() {
  return (
    <main className="landing">
      <section className="landing-copy">
        <div className="eyebrow">COMMUNITY & SOCIAL GOOD</div>
        <h1>Make room for real-world connection.</h1>
        <p>
          MeetUp helps people discover accessible third spaces, join local
          activities, and build genuine connections around shared interests.
        </p>
        <div className="hero-actions">
          <Link className="btn" to="/events">
            Find an event
          </Link>
          <Link className="btn ghost" to="/sign-up">
            Create an account
          </Link>
        </div>
      </section>
      <section className="landing-panel">
        <div className="mini-card">
          <span>01</span>
          <strong>Discover</strong>
          <p>Find events by interest, location, and format.</p>
        </div>
        <div className="mini-card">
          <span>02</span>
          <strong>Show up</strong>
          <p>Register, participate, and make the first move.</p>
        </div>
        <div className="mini-card">
          <span>03</span>
          <strong>Keep connected</strong>
          <p>Earn community rewards and build recurring habits.</p>
        </div>
      </section>
    </main>
  );
}
function Shell({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <Shell>
            <Home />
          </Shell>
        }
      />
      <Route
        path="/events"
        element={
          <Shell>
            <DiscoverEvents />
          </Shell>
        }
      />
      <Route
        path="/events/:id"
        element={
          <Shell>
            <EventDetails />
          </Shell>
        }
      />
      <Route
        path="/map"
        element={
          <Shell>
            <MapPage />
          </Shell>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectRoute roles={["admin"]}>
            <Shell>
              <Admin />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/organizer"
        element={
          <ProtectRoute roles={["organizer", "admin"]}>
            <Shell>
              <OrganizerDashboard />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/organizer/create"
        element={
          <ProtectRoute roles={["organizer", "admin"]}>
            <Shell>
              <CreateEvent />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/organizer/events/:id"
        element={
          <ProtectRoute roles={["organizer", "admin"]}>
            <Shell>
              <ManageEvent />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectRoute roles={["user"]}>
            <Shell>
              <User />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/user/registrations"
        element={
          <ProtectRoute roles={["user"]}>
            <Shell>
              <MyRegistrations />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route
        path="/user/rewards"
        element={
          <ProtectRoute roles={["user"]}>
            <Shell>
              <Rewards />
            </Shell>
          </ProtectRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
