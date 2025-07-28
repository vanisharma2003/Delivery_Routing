import { GoogleMap, DirectionsRenderer, useLoadScript } from "@react-google-maps/api";

const center = { lat: 28.591405, lng: 77.434973 };

const MapComponent = ({ directions, onMapReady }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      zoom={13}
      center={center}
      mapContainerStyle={{ width: "100%", height: "500px" }}
      onLoad={onMapReady}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default MapComponent;
