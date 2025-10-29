import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  CircleMarker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import AlertsPanel from "../components/AlertsPanel";

export default function MapPage() {
  const [zones, setZones] = useState([]);
  const [overlay, setOverlay] = useState("none");

  // Mock county sample data (for overlays)
  const counties = [
    { name: "Makueni", lat: -1.804, lng: 37.62, ndvi: 0.45, rainfall: 34, risk: 72 },
    { name: "Kitui", lat: -1.366, lng: 38.017, ndvi: 0.41, rainfall: 28, risk: 60 },
    { name: "Kisumu", lat: -0.0917, lng: 34.7679, ndvi: 0.67, rainfall: 84, risk: 30 },
    { name: "Meru", lat: 0.046, lng: 37.655, ndvi: 0.63, rainfall: 75, risk: 40 },
    { name: "Nakuru", lat: -0.2833, lng: 36.0667, ndvi: 0.58, rainfall: 68, risk: 45 },
    { name: "Nairobi", lat: -1.286389, lng: 36.817223, ndvi: 0.52, rainfall: 55, risk: 55 },
  ];

  const colorForNDVI = (v) => (v > 0.6 ? "#34A853" : v > 0.45 ? "#FB8C00" : "#E53935");
  const colorForRain = (v) => (v > 70 ? "#34A853" : v > 40 ? "#FB8C00" : "#E53935");
  const colorForRisk = (v) => (v > 70 ? "#E53935" : v > 50 ? "#FB8C00" : "#34A853");

  const handleCreated = (e) => {
    const { layer } = e;
    const geojson = layer.toGeoJSON();

    // Simulated AI score
    const score = Math.round(Math.random() * 100);
    const color = score >= 70 ? "#E53935" : score >= 40 ? "#FB8C00" : "#34A853";

    layer.setStyle({ color, fillColor: color, fillOpacity: 0.6 });

    const zoneData = {
      id: new Date().getTime(),
      type: geojson.geometry.type,
      coordinates: geojson.geometry.coordinates,
      riskScore: score,
      color,
    };
    setZones((prev) => [...prev, zoneData]);

    const popup = L.popup().setContent(
      `<div style="font-size:13px;">
        <strong>AI Risk Score:</strong> ${score}/100<br/>
        <span style="color:${color};font-weight:bold;">
          ${score >= 70 ? "High Risk" : score >= 40 ? "Moderate" : "Low Risk"}
        </span>
      </div>`
    );
    layer.bindPopup(popup).openPopup();
  };

  return (
    <div className="relative p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-green-700">AI Map Intelligence</h2>
          <p className="text-gray-500 text-sm">
            Draw farm zones or explore vegetation, rainfall, and risk overlays.
          </p>
        </div>

        {/* Overlay buttons */}
        <div className="flex gap-2 flex-wrap">
          {["none", "ndvi", "rainfall", "risk"].map((o) => (
            <button
              key={o}
              onClick={() => setOverlay(o)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition ${
                overlay === o
                  ? "bg-green-600 text-white shadow"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {o === "none"
                ? "🛰️ Satellite"
                : o === "ndvi"
                ? "🌿 NDVI"
                : o === "rainfall"
                ? "☔ Rainfall"
                : "🔥 Risk Heatmap"}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        <MapContainer
          center={[-1.3, 36.8]}
          zoom={8}
          style={{ height: "75vh", width: "100%" }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/'>Esri</a> Satellite"
          />

          {/* Overlay circles */}
          {overlay !== "none" &&
            counties.map((c) => (
              <CircleMarker
                key={c.name}
                center={[c.lat, c.lng]}
                radius={overlay === "risk" ? 30 : 20}
                pathOptions={{
                  color:
                    overlay === "ndvi"
                      ? colorForNDVI(c.ndvi)
                      : overlay === "rainfall"
                      ? colorForRain(c.rainfall)
                      : colorForRisk(c.risk),
                  fillColor:
                    overlay === "ndvi"
                      ? colorForNDVI(c.ndvi)
                      : overlay === "rainfall"
                      ? colorForRain(c.rainfall)
                      : colorForRisk(c.risk),
                  fillOpacity: 0.4,
                }}
              >
                <Popup>
                  <div style={{ fontSize: 13 }}>
                    <strong>{c.name}</strong>
                    <br />
                    {overlay === "ndvi" && <>NDVI: {c.ndvi}</>}
                    {overlay === "rainfall" && <>Rainfall: {c.rainfall} mm</>}
                    {overlay === "risk" && <>Risk: {c.risk}%</>}
                  </div>
                </Popup>
              </CircleMarker>
            ))}

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

      {/* Floating Alerts */}
      <div className="fixed top-24 right-4 w-80 z-50 hidden md:block">
        <AlertsPanel /
