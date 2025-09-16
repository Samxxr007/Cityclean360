import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DataDisplay() {
  const [data, setData] = useState(null);
  const [position, setPosition] = useState(null); // null until location is ready

  // Adjust backend URL depending on local or public access
  const backendURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api/data"
      : "https://mycitycleanbackend.loca.lt/api/data";

  // Fetch bin/sensor data from backend
  const fetchData = async () => {
    try {
      const res = await axios.get(backendURL);
      setData(res.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
  };

  // Get current location from browser
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.error("❌ Error getting location:", err);
        }
      );
    } else {
      console.error("❌ Geolocation not supported by this browser.");
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchData();
    getLocation();
    const interval = setInterval(fetchData, 15000); // refresh every 15 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>📡 Smart Bin Status</h2>
      
      {data ? (
        <div>
          <p><strong>Last Updated:</strong> {data.created_at}</p>
          <p><strong>Bin Level:</strong> {data.field1} %</p>
        </div>
      ) : (
        <p>Loading bin data...</p>
      )}

      <h3>🗺 Bin Location</h3>
      {position ? (
        <MapContainer
          center={position} // Start map at your location
          zoom={15}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>📍 My Bin Location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default DataDisplay;
