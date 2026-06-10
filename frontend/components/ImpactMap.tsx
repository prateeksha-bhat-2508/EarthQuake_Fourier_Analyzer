"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle
} from "react-leaflet";

import { Popup } from "react-leaflet";

import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ImpactMap({
  latitude,
  longitude,
  affectedRadius,
  evacuationRadius
}: any) {

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={6}
      style={{
        height: "350px",
        width: "100%"
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker
  position={[
    latitude,
    longitude
  ]}
>

  <Popup>

    <div>

      <h3 className="font-bold">
        Epicenter
      </h3>

      <p>
        Lat: {latitude}
      </p>

      <p>
        Lon: {longitude}
      </p>

      <p>
        Affected Radius:
        {" "}
        {affectedRadius}
        {" "}
        km
      </p>

      <p>
        Evacuation Radius:
        {" "}
        {evacuationRadius}
        {" "}
        km
      </p>

    </div>

  </Popup>

</Marker>
    

      <Circle
        center={[
          latitude,
          longitude
        ]}
        radius={
          affectedRadius * 1000
        }
        pathOptions={{
          color: "red"
        }}
      />

      <Circle
        center={[
          latitude,
          longitude
        ]}
        radius={
          evacuationRadius * 1000
        }
        pathOptions={{
          color: "orange"
        }}
      />
    </MapContainer>

    
  );
}