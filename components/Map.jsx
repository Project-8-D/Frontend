import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css";

function Map({ coords }) {
  const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  });

  let [c, setC] = React.useState(null);

  return <div style={{ display: "flex" }}>
    <MapContainer center={[51.625, 4.2]} zoom={17} scrollWheelZoom={false} style={{ height: 500, width: "50%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords.map(coord => <Marker position={coord} key={JSON.stringify(coord)} icon={icon} eventHandlers={{
      click: () => {
        setC(coord);
      },
    }}></Marker>)}
    </MapContainer>
    <div>
      {c && (
        <div>
          
          Latitude: {c[0]} <br />
          Longitude: {c[1]}
        </div>
      )}
    </div>
  </div>
}

export default Map