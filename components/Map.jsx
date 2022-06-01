import { useState, useEffect, Fragment } from "react";
import { DivIcon } from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";

const colorMap = {
  "gunshot": "#EC4899",
  "animal": "#136F63",
  "vehicle": "#F3C677",
  "unknown": "#5954E3"
}

function createIcon(p, coord, c) {
  const iconWidth = 100;
  const iconHeight = 152;

  const selected = coord == c;

  const iconHtml = `
    <svg width="25" height="38" viewBox="0 0 25 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="${colorMap[coord.soundType]}" fill-opacity="${c && !selected ? .75 : 1}" d="M25 12.5C25 15.3253 24.0627 17.9316 22.4821 20.025C21.9203 20.8066 21.1609 21.6384 20.3202 22.5591C17.4001 25.7571 13.5 30.0285 13.5 37C13.5 37.5523 13.0523 38 12.5 38C11.9477 38 11.5 37.5523 11.5 37C11.5 30.0285 7.59989 25.7571 4.67984 22.5591C3.83915 21.6384 3.07969 20.8066 2.51793 20.025C0.93731 17.9316 0 15.3253 0 12.5C0 5.59644 5.59644 0 12.5 0C19.4036 0 25 5.59644 25 12.5Z" />
      <circle cx="12.5" cy="12.5" r="${p/100*12.5}" fill="black" fill-opacity="0.4"/>
    </svg>
  `;

  const divisor = selected ? 2 : 2.75;

  return new DivIcon({
    html: iconHtml,
    iconSize: [iconWidth/divisor, iconHeight/divisor],
    iconAnchor: [iconWidth/2/divisor, (iconHeight - 3)/divisor]
  });
}

export default function Map({ coords }) {
  const [map, setMap] = useState(null);
  const [c, setC] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);

  function FetchCoords() {
    const map = useMap();
    
    useEffect(() => {
      setMap(map);
    }, [map]);

    useEffect(() => {
      if (coords.length > 0 && !c) {
        const minLat = coords.reduce((min, c) => Math.min(min, c.latitude), coords[0].latitude);
        const maxLat = coords.reduce((max, c) => Math.max(max, c.latitude), coords[0].latitude);
        const minLng = coords.reduce((min, c) => Math.min(min, c.longitude), coords[0].longitude);
        const maxLng = coords.reduce((max, c) => Math.max(max, c.longitude), coords[0].longitude);
        let oldScale = map.getZoom();
        map.flyToBounds([[minLat, minLng], [maxLat, maxLng]]);
      }
    }, [coords]);

  }

  function coordClick(coord) {
    const same = coord == c;
    setC(same ? null : coord);

    if (!same) {
      map && map.flyTo([coord.latitude, coord.longitude]);
      const el = document.querySelectorAll(".scrollList > div")[coords.indexOf(coord)];
      if (el.scrollIntoViewIfNeeded)
        el.scrollIntoViewIfNeeded({ behavior: "smooth" });
      else
        el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function playClick(e, coord) {
    e.stopPropagation();

    if (playing == coord) {
      setPlaying(null);
      audio?.pause();
    } else {
      e.target.disabled = true;
      audio?.pause();
      setAudio(null);
      const a = new Audio(coord.sound);
      a.addEventListener("ended", () => setPlaying(null));
      setProgress(0);
      a.addEventListener("timeupdate", () => setProgress(a.currentTime / a.duration * 360));
      a.play().then(() => {
        setPlaying(coord);
        setAudio(a);
        e.target.disabled = false;
      });
    }
  }

  return <div className="flex flex-col md:flex-row md:gap-4">
    <MapContainer bounds={[[-1.3402098002785028, 22.0660400390625], [-3.1021210008142988, 20.676269531250004]]} scrollWheelZoom={false} className="h-[50vh] md:h-[calc(100vh-5rem)] w-full md:w-6/12 md:rounded-md" attributionControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?layers=C"
      />
      {coords.map((coord, i) => <Marker position={[coord.latitude, coord.longitude]} key={i} icon={createIcon(coord.probability, coord, c)} eventHandlers={{click: () => coordClick(coord)}}></Marker>)}
      <FetchCoords />
    </MapContainer>
    <div className="sm:w-full md:w-6/12 md:h-[calc(100vh-5rem)] bg-gray-900 md:rounded-md">
      <div className="flex justify-between relative p-4 shadow-[rgba(0,0,0,.25)] shadow-lg print:shadow-none">
        <h2 className="text-xl">Lijst</h2>
        <button className="print:hidden">
          <i className="material-icons-round">filter_list</i>
        </button>
      </div>
      <div className="scrollList overflow-y-auto h-[calc(100vh-3rem-50vh-3.75rem)] md:h-[calc(100vh-9rem)] print:!h-auto">
        {coords.map((coord, i) => (
          <Fragment key={coord.guid}>
            <div onClick={() => coordClick(coord)} className={"flex py-2 pr-4 hover:bg-gray-600 print:text-black break-inside-avoid" + (coord == c ? " bg-gray-700 print:font-bold" : "")}>
              <i className={"material-icons-round h-min m-4 text-3xl transition-transform" + (coord == c ? " rotate-180" : "")}>place</i>
              <span className="flex-grow-[1] mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="font-bold">Point #{i + 1}</span>
                <br />
                <i className="material-icons-round" title="coordinates">my_location</i> {coord.longitude}, {coord.latitude}
                <div className={"h-0 overflow-hidden transition-[height] [transition-timing-function:linear]" + (coord == c ? " expanded" : "")}>
                  <i className="material-icons-round" title="time">schedule</i> {new Date(coord.time).toLocaleString()}<br />
                  <i className="material-icons-round" title="node id">scatter_plot</i> {coord.nodeId.toString()}<br />
                  <i className="material-icons-round" title="sound type">category</i> {coord.soundType}<br />
                  <i className="material-icons-round" title="probability">percent</i> {coord.probability}<br />
                </div>
              </span>
              <button className="w-12 h-12 mt-[10px] ml-4 min-w-[3rem] rounded-full bg-pink-500 disabled:bg-pink-500/50 print:hidden transition-[background]" onClick={(e) => playClick(e, coord)} style={{ background: coord == playing ? `conic-gradient(#ec4899 ${progress}deg, #be185d ${progress+1}deg)` : "" }}>
                <i className="material-icons-round text-[#8e2b5c]/100">{coord == playing ? "stop" : "play_arrow"}</i>
              </button>
            </div>
            {i < coords.length - 1 && <hr className="border-0 h-[2px] bg-gray-800 w-[calc(100%-2rem)] m-auto"/>}
          </Fragment>
        ))}
      </div>
    </div>
  </div>
}