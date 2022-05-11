import { useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import "leaflet/dist/leaflet.css";

export default function Map({ coords }) {

  const iconWidth = 100;
  const iconHeight = 152;

  const icon = L.icon({
    iconUrl: "marker.png",
    iconSize: [iconWidth/2.75, iconHeight/2.75],
    iconAnchor: [iconWidth/2.75/2, iconHeight/2.75]
  });

  const selectedIcon = L.icon({
    iconUrl: "marker.png",
    iconSize: [iconWidth/2, iconHeight/2],
    iconAnchor: [iconWidth/4, iconHeight/2]
  });

  let [c, setC] = useState(null);
  let [playing, setPlaying] = useState(null);

  return <div className="flex flex-col md:flex-row md:gap-4">
    <MapContainer center={[51.625, 4.2]} zoom={16} scrollWheelZoom={false} className="h-[50vh] md:h-[calc(100vh-5rem)] w-full md:w-6/12 md:rounded-md" attributionControl={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coords.map(coord => <Marker position={coord} key={JSON.stringify(coord)} icon={coord == c ? selectedIcon : icon} eventHandlers={{click: () => setC(coord)}}></Marker>)}
    </MapContainer>
    <div className="sm:w-full md:w-6/12 md:h-[calc(100vh-5rem)] bg-gray-900 md:rounded-md">
      <div className="flex justify-between relative p-4 shadow-[rgba(0,0,0,.25)] shadow-lg print:shadow-none">
        <h2 className="text-xl">Lijst</h2>
        <button className="print:hidden">
          <i className="material-icons-round">filter_list</i>
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-3rem-50vh-3.75rem)] md:h-[calc(100vh-9rem)]">
        {coords.map((coord, i) => (
          <>
            <div key={coord} onClick={() => setC(coord)} className={"flex items-center py-2 pr-4 hover:bg-gray-600" + (coord == c ? " bg-gray-700" : "")}>
              <i className="material-icons-round m-4">place</i>
              <span className="flex-grow-[1]">
                Point #{i + 1}
                <br />
                {coord[0]}, {coord[1]}
              </span>
              <button className="w-12 h-12 rounded-full bg-pink-500 print:hidden" onClick={() => playing == coord ? setPlaying(null) : setPlaying(coord)}>
                <i className="material-icons-round text-black">{coord == playing ? "stop" : "play_arrow"}</i>
              </button>
            </div>
            {i < coords.length - 1 && <hr className="border-0 h-[2px] bg-gray-800 w-[calc(100%-2rem)] m-auto"/>}
          </>
        ))}
      </div>
    </div>
  </div>
}