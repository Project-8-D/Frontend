import Link from "next/link";
import { useRouter } from "next/router";

export default function SightingsCard({ coords }) {
    let resolved = coords.filter(coord => coord.resolved == true);
    let unresolved = coords.filter(coord => coord.resolved == false);
    let lowAccuracy = unresolved.filter(coord => coord.probability < 50);
    let newSightings = coords.filter(coord => coord.time*1000 >= Number(new Date()) - (1000*60*60));

    const router = useRouter();
    
    return (
        <div className="cards">
            <div className="cards-title">
                <h1>Sightings</h1>
                <Link href="/sightings">More</Link>
            </div>
            <div className="row-container">
                <div className="row" onClick={() => router.push("/sightings?open=yes&limit=off")}>
                    Unresolved sightings
                    <div className="row-value">{unresolved.length}</div>
                </div>
                <div className="row" onClick={() => router.push("/sightings?open=no&limit=off")}>
                    Resolved sightings
                    <div className="row-value">{resolved.length}</div>
                </div>
                <div className="row" onClick={() => router.push("/sightings?probmax=50&limit=off")}>
                    Sightings under 50% accuracy
                    <div className="row-value">{lowAccuracy.length}</div>
                </div>
                <div className="row" onClick={() => router.push("/sightings?open=both&maxage=1&limit=off")}>
                    New sightings (last hour)
                    <div className="row-value">{newSightings.length}</div>
                </div>
            </div>
        </div>
    )
}    
