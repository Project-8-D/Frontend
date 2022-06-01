import { VictoryPie } from "victory";

export default function SightingsAccuracyCard() {
    return(
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
    )
}