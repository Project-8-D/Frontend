import { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css";
import { VictoryPie } from "victory";

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

      <div className="flex flex-nowrap gap-12 justify-between">
        <div className="cards">
          <h1 className="text-center">Unresolved</h1>
          <p className="cards-number">3</p>
        </div>
        <div className="cards">
          <h1 className="text-center">Overdue</h1>
          <p className="cards-number">0</p>
        </div>
        <div className="cards">
          <h1 className="text-center">Open</h1>
          <p className="cards-number">3</p>
        </div>
        <div className="cards">
          <h1 className="text-center">On hold</h1>
          <p className="cards-number">2</p>
        </div>
      </div>

      <MapContainer bounds={[[-1.3402098002785028, 22.0660400390625], [-3.1021210008142988, 20.676269531250004]]} scrollWheelZoom={false} className="h-96 w-full md:rounded-md mt-12" attributionControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?layers=C"
        />
        {coords.map((coord, i) => <Marker position={[coord.latitude, coord.longitude]} key={i} icon={coord == c ? selectedIcon : icon}></Marker>)}
        <FetchCoords />
      </MapContainer>

      <div className="flex flex-nowrap gap-12 justify-between mt-8">
        <div className="cards">
          <div className="cards-title">
            <h1>Sightings</h1>
            <a href="/map">View details</a>
          </div>
          <div className="row-container">
            <div className="row">
              <div>Resolved sightings</div>
              <div className="row-value">318</div>
            </div>
            <div className="row">
              <div>Unresolved sightings</div>
              <div className="row-value">3</div>
            </div>
            <div className="row">
              <div>Sightings under 50% accuracy</div>
              <div className="row-value">2</div>
            </div>
          </div>
        </div>

        <div className="cards flex flex-col align-center !pb-0">
          <div className="cards-title">
            <h1>Sightings accuracy</h1>
            <a href="">View all</a>
          </div>

          <div className="grow w-[13em] self-center">
            <VictoryPie 
              data={[
              {x: 'vehicle', y: 20},
              {x: 'gunshot', y: 10},
              {x: 'unknown', y: 15}
              ]} 
              colorScale="red" 
              innerRadius={30} 
              labelRadius={({radius}) => radius/2 - 10 } 
              labelPosition="centroid"
              style={{ labels: { fill: "white", fontSize: 20, fontWeight: "semibold" }}} />
          </div>
        </div>
      </div>
    </div>
  )
}