// import React, { useEffect, useState } from "react";
// import Map, { Marker, Source, Layer } from "react-map-gl/maplibre";
// import "maplibre-gl/dist/maplibre-gl.css";

// const mapStyle = "https://api.maptiler.com/maps/basic-v2/style.json?key=VhJ9Ly4eBJNy8uoJ2QFi";
// const defaultCenter = { latitude: 20.5937, longitude: 78.9629 }; // Default to India

// const DeliveryTracking = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [customerLocation, setCustomerLocation] = useState(null);
//   const [route, setRoute] = useState(null);
//   const [orderId, setOrderId] = useState("");
//   const [error, setError] = useState(null);

//   // ✅ Get user's live location
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError("Geolocation is not supported.");
//       return;
//     }
//     navigator.geolocation.watchPosition(
//       (position) => {
//         setUserLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//         });
//       },
//       (err) => setError(`Error getting location: ${err.message}`),
//       { enableHighAccuracy: true }
//     );
//   }, []);

//   // ✅ Fetch customer location from backend
//   const getCustomerLocation = async () => {
//     if (!orderId) {
//       setError("Enter a valid Order ID.");
//       return;
//     }
//     try {
//       const response = await fetch(`http://localhost:5001/customer-location/${orderId}`);
//       const data = await response.json();
//       if (data.error) {
//         setError(data.error);
//       } else {
//         setCustomerLocation({
//           latitude: parseFloat(data.latitude),
//           longitude: parseFloat(data.longitude),
//         });
//         setError(null);
//       }
//     } catch (error) {
//       setError("Failed to fetch customer location.");
//     }
//   };

//   // ✅ Get route using Open Source Routing Machine (OSRM)
//   const getRoute = async () => {
//     if (!userLocation || !customerLocation) return;

//     const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${customerLocation.longitude},${customerLocation.latitude}?geometries=geojson`;
    
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.routes.length) {
//         setRoute(data.routes[0].geometry);
//       } else {
//         setError("No route found.");
//       }
//     } catch (error) {
//       setError("Failed to get route.");
//     }
//   };

//   return (
//     <div className="delivery-tracking">
//       <div className="input-section">
//         <input
//           type="number"
//           placeholder="Enter Order ID"
//           value={orderId}
//           onChange={(e) => setOrderId(e.target.value)}
//         />
//         <button onClick={getCustomerLocation}>Get Customer Location</button>
//         <button onClick={getRoute} disabled={!customerLocation || !userLocation}>
//           Track Path
//         </button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       <Map
//         initialViewState={{ ...defaultCenter, zoom: 13 }}
//         style={{ width: "100%", height: "400px" }}
//         mapStyle={mapStyle}
//       >
//         {userLocation && (
//           <Marker latitude={userLocation.latitude} longitude={userLocation.longitude} color="blue" />
//         )}
//         {customerLocation && (
//           <Marker latitude={customerLocation.latitude} longitude={customerLocation.longitude} color="red" />
//         )}

//         {route && (
//           <Source type="geojson" data={{ type: "Feature", geometry: route }}>
//             <Layer
//               id="route"
//               type="line"
//               paint={{ "line-color": "#ff0000", "line-width": 4 }}
//             />
//           </Source>
//         )}
//       </Map>
//     </div>
//   );
// };

// export default DeliveryTracking;