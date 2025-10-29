import React, { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

export default function MapPage() {
  const [features, setFeatures] = useState([]);

  const onCreated = (e) => {
    const { layer } = e;
    const geojson = layer.toGeoJSON();
    setFeatures((prev) => [...prev, geojson]);
    console.log("New shape drawn:", geojson);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-green-700">Map Intelligence</h2>
        <p className="text-gray-500 text-sm">
          Explore Esri satellite imagery and draw farm zones directly on the map.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <MapContainer
          center={[-1.3, 36.8]}
          zoom={12}
          style={{ height: "75vh", width: "100%" }}
        >
          {/* Esri Satellite Tiles */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; <a href='https://www.esri.com/'>Esri</a> Satellite"
          />

          {/* Drawing Controls */}
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={onCreated}
              draw={{
                rectangle: true,
                polygon: true,
                circle: true,
                marker: true,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
        <strong>Drawn Shapes:</strong>{" "}
        {features.length === 0 ? "None yet" : `${features.length} shapes created`}
      </div>
    </div>
  );
}
