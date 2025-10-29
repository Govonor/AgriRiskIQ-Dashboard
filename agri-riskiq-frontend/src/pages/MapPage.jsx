import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import AlertsPanel from "../components/AlertsPanel";

export default function MapPage() {
  const [zones, setZones] = useState([]);

  const handleCreated = (e) => {
    const { layer } = e;
    const geojson = layer.toGeoJSON();

    // 🧠 Simulate an AI risk score (0–100)
    const score = Math.round(Math.random() * 100);
    const color =
      score >= 70 ? "#E53935" : score >= 40 ? "#FB8C00" : "#34A853"; // red, orange, green

    // Apply color to the drawn shape
    layer.setStyle({ color, fillColor: color, fillOpacity: 0.6 });

    // Store shape metadata
    const zoneData = {
      id: new Date().getTime(),
      type: geojson.geometry.type,
      coordinates: geojson.geometry.coordinates,
      riskScore: score,
      color,
    };

    setZones((prev) => [...prev, zoneData]);

    // Add popup with score
    const popup = L.popup().setContent(
      `<div style="font-size:13px;">
        <strong>AI Risk Score:</strong> ${score}/100<br/>
        <span style="color:${color};font-weight:bold;">${
        score >= 70 ? "High Risk" : score >= 40 ? "Moderate" : "Low Risk"
      }</span>
      </div>`
    );
    layer.bindPopup(popup).openPopup();
  };

  return (
    <div className="relative p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-green-700">
          AI Map Intelligence
        </h2>
        <p className="text-gray-500 text-sm">
          Draw farm zones to instantly calculate simulated AI risk scores.
        </p>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        <MapContainer
          center={[-1.3, 36.8]}
          zoom={12}
          style={{ height: "75vh", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/'>Esri</a> Satellite"
          />
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: true,
                polygon: true,
                circle: true,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          AI Risk Summary
        </h3>
        {zones.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No zones drawn yet. Draw a polygon or circle on the map.
          </p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700">
            {zones.map((z) => (
              <li
                key={z.id}
                className="flex justify-between border-b border-gray-100 pb-1"
              >
                <span>
                  🗺️ <strong>{z.type}</strong>
                </span>
                <span style={{ color: z.color, fontWeight: "bold" }}>
                  {z.riskScore}/100
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating Alerts Panel */}
      <div className="fixed top-24 right-4 w-80 z-50 hidden md:block">
        <AlertsPanel />
      </div>
    </div>
  );
}
