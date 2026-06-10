"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Earthquake {
  id: string;
  place: string;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number;
  timestamp: number;
}

interface Props {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (
    earthquake: Earthquake
  ) => void;
}

export default function EarthquakeMap({
  earthquakes,
  selectedEarthquake,
  onSelectEarthquake,
}: Props) {
  return (
    <MapContainer
      center={[38, 142]}
      zoom={5}
      style={{
        height: "75vh",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {earthquakes.map((quake) => (
        <CircleMarker
          key={quake.id}
          center={[
            quake.latitude,
            quake.longitude,
          ]}
          radius={Math.max(
            quake.magnitude * 2,
            5
          )}
          pathOptions={{
            color:
              selectedEarthquake?.id ===
              quake.id
                ? "cyan"
                : quake.magnitude >= 8
                ? "red"
                : quake.magnitude >= 7
                ? "orange"
                : "yellow",
          }}
          eventHandlers={{
            click: () =>
              onSelectEarthquake(quake),
          }}
        >
          <Popup>
            <div>
              <h3>
                <strong>
                  {quake.place}
                </strong>
              </h3>

              <p>
                Magnitude:
                {" "}
                {quake.magnitude}
              </p>

              <p>
                Depth:
                {" "}
                {quake.depth} km
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}