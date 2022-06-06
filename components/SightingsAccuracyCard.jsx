import Link from "next/link";
import { VictoryPie } from "victory";
import { useRouter } from "next/router";

export default function SightingsAccuracyCard({ coords }) {
    let unresolved = coords.filter(coord => coord.resolved == false);
    let gunshots = unresolved.filter(coord => coord.soundType == "gunshot").length;
    let animals = unresolved.filter(coord => coord.soundType == "animal").length;
    let vehicles = unresolved.filter(coord => coord.soundType == "vehicle").length;
    let unknowns = unresolved.filter(coord => coord.soundType == "unknown").length;

    const router = useRouter();

    return(
        <div className="cards flex flex-col align-center !pb-0">
            <div className="cards-title">
                <h1>Sighting types</h1>
                <Link href="/sightings">More</Link>
            </div>

            <div className="grow flex">
                <div className="legend grow m-4 flex justify-center">
                    <div className="flex flex-col self-center">
                        <Link href={"/sightings?soundtype=gunshot&limit=off"} passHref><div><span className="square bg-[#EC4899]"></span> gunshot</div></Link>
                        <Link href={"/sightings?soundtype=animal&limit=off"} passHref><div><span className="square bg-[#136F63]"></span> animal</div></Link>
                        <Link href={"/sightings?soundtype=vehicle&limit=off"} passHref><div><span className="square bg-[#F3C677]"></span> vehicle</div></Link>
                        <Link href={"/sightings?soundtype=unknown&limit=off"} passHref><div><span className="square bg-[#5954E3]"></span> unknown</div></Link>
                    </div>
                </div>
                <div className="grow h-[13em] !self-center m-6">
                    <VictoryPie 
                    data={[
                        {x: 'gunshot', y: gunshots},
                        {x: 'animal', y: animals},
                        {x: 'vehicle', y: vehicles},
                        {x: 'unknown', y: unknowns}
                    ]}
                    radius={200}
                    colorScale={["#EC4899", "#136F63", "#F3C677", "#5954E3"]}
                    labels={({ datum}) => datum.y}
                    innerRadius={100} 
                    padAngle={4}
                    labelRadius={({radius}) => radius + 32} 
                    labelPosition="centroid"
                    style={{ labels: { fill: "white", fontSize: 24, fontWeight: "bold" }}}
                    events={[{
                        target: "data",
                        eventHandlers: {
                          onClick: () => {
                            return [
                                {
                                    target: "data",
                                    mutation: ({ datum }) => {
                                        router.push(`/sightings?soundtype=${datum.x}&limit=off`);
                                    }
                                }
                            ];
                          }
                        }
                      }]} />
                </div>
            </div>
        </div>
    )
}