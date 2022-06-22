import { useState, useEffect } from "react";
import { DivIcon } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import colorMap from "./colorMap";

function lerpHex(a, b, amount) { 
    const ah = parseInt(a.replace("#", ""), 16),
          ar = ah >> 16,
          ag = ah >> 8 & 0xff,
          ab = ah & 0xff;

    const bh = parseInt(b.replace("#", ""), 16),
          br = bh >> 16,
          bg = bh >> 8 & 0xff,
          bb = bh & 0xff;

    return "#" + (
      (1 << 24) +
      (ar + amount * (br - ar) << 16) +
      (ag + amount * (bg - ag) << 8) +
      ab + amount * (bb - ab) | 0
    ).toString(16).slice(1);
}

const circle = p => `
<foreignObject x="0" y="0" width="100%" height="100%" clip-path="url(#clip)">
  <div class="dot" xmlns="http://www.w3.org/1999/xhtml" style="background: conic-gradient(#00000066 ${p/100*360}deg, #00000000 ${p/100*360+1}deg)" />
</foreignObject>
`;

const icons = {
  animal: `<circle cx="4.5" cy="9.5" r="2.5"/><circle cx="9" cy="5.5" r="2.5"/><circle cx="15" cy="5.5" r="2.5"/><circle cx="19.5" cy="9.5" r="2.5"/><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"/>`,
  gunshot: `<path d="M 12,2 C 10,2 6.9882239,4.9748959 7.0000002,10.000001 v 9.999998 c 8.01e-5,0.530404 0.2108447,1.039052 0.5859375,1.414061 C 7.9609499,21.789152 8.4695976,21.999921 9.0000002,22 H 12 15 c 0.530403,-7.9e-5 1.039052,-0.21086 1.414061,-0.58594 C 16.789153,21.039055 16.999919,20.530403 17,19.999999 V 10.000001 C 17.011777,4.9748959 14,2 12,2 Z" />`,
  vehicle: `<path d="M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11C5.84,5,5.29,5.42,5.08,6.01L3,12v7.5C3,20.33,3.67,21,4.5,21h0 C5.33,21,6,20.33,6,19.5V19h12v0.5c0,0.82,0.67,1.5,1.5,1.5h0c0.82,0,1.5-0.67,1.5-1.5V12L18.92,6.01z M7.5,16 C6.67,16,6,15.33,6,14.5S6.67,13,7.5,13S9,13.67,9,14.5S8.33,16,7.5,16z M16.5,16c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5 s1.5,0.67,1.5,1.5S17.33,16,16.5,16z M5.81,10l1.04-3h10.29l1.04,3H5.81z"/>`,
  unknown: `<path d="M7.92,7.54C7.12,7.2,6.78,6.21,7.26,5.49C8.23,4.05,9.85,3,11.99,3c2.35,0,3.96,1.07,4.78,2.41c0.7,1.15,1.11,3.3,0.03,4.9 c-1.2,1.77-2.35,2.31-2.97,3.45c-0.15,0.27-0.24,0.49-0.3,0.94c-0.09,0.73-0.69,1.3-1.43,1.3c-0.87,0-1.58-0.75-1.48-1.62 c0.06-0.51,0.18-1.04,0.46-1.54c0.77-1.39,2.25-2.21,3.11-3.44c0.91-1.29,0.4-3.7-2.18-3.7c-1.17,0-1.93,0.61-2.4,1.34 C9.26,7.61,8.53,7.79,7.92,7.54z M14,20c0,1.1-0.9,2-2,2s-2-0.9-2-2c0-1.1,0.9-2,2-2S14,18.9,14,20z"/>`
} 

function createIcon(p, coord, current) {
  const { markerType = "circle", markerColor = "type" } = JSON.parse(localStorage.getItem("settings") || "{}");

  const iconWidth = 100;
  const iconHeight = 152;

  const selected = coord == current;

  let fill = colorMap[coord.sound_type];
  if (markerColor === "probability") {
    fill = lerpHex(colorMap.unknown, colorMap.gunshot, coord.probability/100);
  }

  const iconHtml = `
    <svg width="25" height="38" viewBox="0 0 25 38" fill="black" style="filter: grayscale(${(current && !selected) ? ".75" : "0"})" xmlns="http://www.w3.org/2000/svg">
      <path fill="${fill}" style="pointer-events: auto; cursor: pointer" d="M25 12.5C25 15.3253 24.0627 17.9316 22.4821 20.025C21.9203 20.8066 21.1609 21.6384 20.3202 22.5591C17.4001 25.7571 13.5 30.0285 13.5 37C13.5 37.5523 13.0523 38 12.5 38C11.9477 38 11.5 37.5523 11.5 37C11.5 30.0285 7.59989 25.7571 4.67984 22.5591C3.83915 21.6384 3.07969 20.8066 2.51793 20.025C0.93731 17.9316 0 15.3253 0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5Z" />
      ${markerType == "circle" ? circle(coord.probability) : `<g transform="translate(3.5, 3.5) scale(.75)" opacity=".4">${icons[coord.sound_type]}</g>`}
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