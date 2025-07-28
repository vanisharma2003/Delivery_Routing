import React, { useRef, useState } from "react";
import MapComponent from "./components/Map";
import { getNearest } from "./utils/calculateDistance";

const warehouse = { lat: 28.591405, lng: 77.434973 };
const restaurantList = [
  { id: 1, position: { lat: 28.570000, lng: 77.450000 } },
  { id: 2, position: { lat: 28.600000, lng: 77.420000 } },
  { id: 3, position: { lat: 28.610000, lng: 77.460000 } },
  { id: 4, position: { lat: 28.555000, lng: 77.430000 } },
];

function App() {
  const [directions, setDirections] = useState(null);
  const [remaining, setRemaining] = useState([...restaurantList]);
  const [currentLocation, setCurrentLocation] = useState(warehouse);
  const mapRef = useRef(null);
  const [completed, setCompleted] = useState(false);
  const [lastDeliveredId, setLastDeliveredId] = useState(null);

  const handleMapReady = (map) => {
    mapRef.current = map;
  };

  const startDelivery = async () => {
    const nearest = await getNearest(currentLocation, remaining, window.google);
    setLastDeliveredId(nearest.id);
    routeTo(nearest.position);
  };

  const routeTo = (destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: currentLocation,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result) => {
        if (result) {
          setDirections(result);
          const leg = result.routes[0].legs[0];
          console.log("Distance:", leg.distance.text);
          console.log("Duration:", leg.duration.text);
        }
      }
    );
  };

  const markDelivered = async () => {
    if (!directions) return;

    if (remaining.length === 0) {
      setCompleted(true);
      return;
    }

    if (lastDeliveredId == null) {
      console.warn("Delivered restaurant not found");
      return;
    }

    const newRemaining = remaining.filter((r) => r.id !== lastDeliveredId);
    setRemaining(newRemaining);

    if (newRemaining.length === 0) {
      setCompleted(true);
      return;
    }

    const lastDest = directions.routes[0].legs[0].end_location.toJSON();
    setCurrentLocation(lastDest);

    const next = await getNearest(lastDest, newRemaining, window.google);
    setLastDeliveredId(next.id);
    routeTo(next.position);
  };

  return (
    <div>
  <h2 style={{ textAlign: "center" }}>Delivery Route App</h2>
  <MapComponent directions={directions} onMapReady={handleMapReady} />

  <div style={{ textAlign: "center", marginTop: "1rem" }}>
    {!directions && <button onClick={startDelivery}>Start Delivery</button>}
    {directions && !completed && (
      <>
        <button onClick={markDelivered}>Mark as Delivered</button>

        {/* Estimated time & distance */}
        {directions.routes?.[0]?.legs?.[0] && (
          <div style={{ marginTop: "10px", fontWeight: "bold" }}>
            Estimated Distance: {directions.routes[0].legs[0].distance.text}, Estimated Time: {directions.routes[0].legs[0].duration.text}
          </div>
        )}
      </>
    )}
    {completed && <h3>All deliveries completed 🎉</h3>}
  </div>
</div>

  );
}

export default App;
