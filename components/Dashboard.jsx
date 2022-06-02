import { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import SightingsCard from "./SightingsCard";
import SightingsAccuracyCard from "./SightingsAccuracyCard";
import StatusCards from "./StatusCards";

export default function Dashboard({ coords }){

  const iconWidth = 100;
  const iconHeight = 152;

  const icon = L.icon({
    iconUrl: "marker.png",
    iconSize: [iconWidth/2.75, iconHeight/2.75],
    iconAnchor: [iconWidth/2.75/2, (iconHeight - 3)/2.75]
  });

  const [map, setMap] = useState(null);
  const [c, setC] = useState(null);

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
        map.flyToBounds([[minLat, minLng], [maxLat, maxLng]]);
      }
    }, [coords]);

  }

  return(
    <div className="mt-5 w-100 md:w-8/12 mx-auto">
      <StatusCards coords={coords}/>

      <MapContainer bounds={[[-1.3402098002785028, 22.0660400390625], [-3.1021210008142988, 20.676269531250004]]} scrollWheelZoom={false} className="h-96 w-full md:rounded-md mt-12" attributionControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?layers=C"
        />
        {coords.map((coord, i) => {
          if (i < 10)
            return <Marker position={[coord.latitude, coord.longitude]} key={i} icon={coord == c ? selectedIcon : icon}></Marker>
        }
        )}
        <FetchCoords />
      </MapContainer>

      <div className="flex flex-nowrap gap-12 justify-between mt-8">
        <SightingsCard coords={coords}/>

        <SightingsAccuracyCard />
      </div>
    </div>
  )
}