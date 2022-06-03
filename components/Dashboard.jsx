import dynamic from "next/dynamic";
import SightingsCard from "./SightingsCard";
import SightingsAccuracyCard from "./SightingsAccuracyCard";
import StatusCards from "./StatusCards";
import { useRouter } from "next/router";

const Map = dynamic(
  () => import("../components/Map"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false
  }
);


export default function Dashboard({ coords }) {
  const router = useRouter();

  return(
    <div className="w-100 lg:w-8/12 mx-auto">
      
      <div className="flex flex-col sm:flex-row gap-4 my-4 mx-4 lg:mx-0">
        <StatusCards coords={coords}/>
        <div className="h-96 w-full sm:w-9/12 bg-gray-900 rounded-md">
          <Map coords={coords.slice(0, 10)} coordClick={(coord, coords) => router.push("/sightings?coord=" + coord.guid)} bounds={[[-4, 19],[0.7, 23.5]]}/>
        </div>
      </div>

      <div className="flex flex-nowrap gap-4 flex-col md:flex-row mx-4 lg:mx-0">
        <SightingsCard coords={coords}/>

        <SightingsAccuracyCard coords={coords}/>
      </div>
    </div>
  )
}