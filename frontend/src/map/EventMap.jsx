import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
export default function EventMap({
  events = [],
  center = [14.5995, 120.9842],
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current).setView(center, 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    events
      .filter((e) => e.latitude && e.longitude)
      .forEach((e) =>
        L.marker([e.latitude, e.longitude])
          .addTo(map)
          .bindPopup(`<strong>${e.title}</strong><br/>${e.location || ""}`),
      );
    return () => map.remove();
  }, [events, center]);
  return <div ref={ref} className="map" />;
}
