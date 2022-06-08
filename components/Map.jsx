import { useState, useEffect } from "react";
import { DivIcon } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import colorMap from "./colorMap";

function createIcon(p, coord, c) {
  const iconWidth = 100;
  const iconHeight = 152;

  const selected = coord == c;

  const iconHtml = `
    <svg width="25" height="38" viewBox="0 0 25 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colorMap[coord.sound_type]}" fill-opacity="${c && !selected ? .75 : 1}" style="pointer-events: auto; cursor: pointer" d="M25 12.5C25 15.3253 24.0627 17.9316 22.4821 20.025C21.9203 20.8066 21.1609 21.6384 20.3202 22.5591C17.4001 25.7571 13.5 30.0285 13.5 37C13.5 37.5523 13.0523 38 12.5 38C11.9477 38 11.5 37.5523 11.5 37C11.5 30.0285 7.59989 25.7571 4.67984 22.5591C3.83915 21.6384 3.07969 20.8066 2.51793 20.025C0.93731 17.9316 0 15.3253 0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5Z" />
      <circle cx="12.5" cy="12.5" r="${p/100*12.5}" fill="black" fill-opacity="0.4" style="cursor: pointer"/>
    </svg>
  `;

  const divisor = selected ? 2 : 2.75;

  return new DivIcon({
    html: iconHtml,
    iconSize: [iconWidth/divisor, iconHeight/divisor],
    iconAnchor: [iconWidth/2/divisor, (iconHeight - 3)/divisor]
  });
}

function SetMap({ setMap, setParentMap }) {
  const map = useMap();
  useEffect(() => {
    setMap(map);
    setParentMap && setParentMap(map);
  }, [map]);
}

export default function Map({ coords, current, coordClick, setParentMap, bounds = [[-4, 19],[0.4, 23.5]] }) {
  const [map, setMap] = useState(null);

  return <MapContainer zoomSnap={0} bounds={bounds} boundsOptions={{ padding: [50, 50] }} attributionControl={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?layers=C"
  />
  {coords.map((coord, i) => <Marker position={[coord.latitude, coord.longitude]} key={i} icon={createIcon(coord.probability, coord, current)} eventHandlers={{click: () => coordClick && coordClick(coord, coords)}}></Marker>)}
  <SetMap setMap={setMap} setParentMap={setParentMap}/>
</MapContainer>
}