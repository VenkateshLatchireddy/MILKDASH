
// npm install @react-google-maps/api


import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default: India

const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your API key

const DeliveryTracking = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places"],
  });

  const [userLocation, setUserLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState(null);

  // ✅ Get user's live location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }
    navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => setError(`Error getting location: ${err.message}`),
      { enableHighAccuracy: true }
    );
  }, []);

  // ✅ Fetch customer location from backend
  const getCustomerLocation = async () => {
    if (!orderId) {
      setError("Enter a valid Order ID.");
      return;
    }
    try {
      const response = await fetch(`https://milkdash.onrender.com/customer-location/${orderId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCustomerLocation({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude),
        });
        setError(null);
      }
    } catch (error) {
      setError("Failed to fetch customer location.");
    }
  };

  // ✅ Get route using Google Maps Directions API
  const getRoute = () => {
    if (!userLocation || !customerLocation) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: customerLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          setError("Failed to fetch route.");
        }
      }
    );
  };

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="delivery-tracking">
      <div className="input-section">
        <input
          type="number"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button onClick={getCustomerLocation}>Get Customer Location</button>
        <button onClick={getRoute} disabled={!customerLocation || !userLocation}>
          Track Path
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <GoogleMap mapContainerStyle={mapContainerStyle} center={userLocation || defaultCenter} zoom={13}>
        {userLocation && <Marker position={userLocation} label="You" />}
        {customerLocation && <Marker position={customerLocation} label="Customer" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default DeliveryTracking;
