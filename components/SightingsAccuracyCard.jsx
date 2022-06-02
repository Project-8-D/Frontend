import { VictoryPie } from "victory";

export default function SightingsAccuracyCard({ coords }) {
    let unresolved = coords.filter(coord => coord.resolved == false)
    let gunshots = unresolved.filter(coord => coord.soundType == "gunshot").length
    let animals = unresolved.filter(coord => coord.soundType == 'animal').length
    let vehicles = unresolved.filter(coord => coord.soundType == 'vehicle').length
    let unknowns = unresolved.filter(coord => coord.soundType == 'unknown').length
    return(
        <div className="cards flex flex-col align-center !pb-0">
            <div className="cards-title">
                <h1>Sightings accuracy</h1>
                <a href="">View all</a>
            </div>

            <div className="grow w-[13em] self-center">
                <VictoryPie 
                data={[
                    {x: 'gunshot', y: gunshots},
                    {x: 'animal', y: animals},
                    {x: 'vehicle', y: vehicles},
                    {x: 'unknown', y: unknowns}
                ]} 
                colorScale="red" 
                innerRadius={30} 
                labelRadius={({radius}) => radius/2 - 10 } 
                labelPosition="centroid"
                style={{ labels: { fill: "white", fontSize: 20, fontWeight: "semibold" }}} />
            </div>
        </div>
    )
}