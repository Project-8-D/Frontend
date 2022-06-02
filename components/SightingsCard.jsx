export default function SightingsCard({ coords }) {
    let resolved = coords.filter(coord => coord.resolved == true)
    let unresolved = coords.filter(coord => coord.resolved == false)
    let lowAccuracy = unresolved.filter(coord => coord.probability < 50)
    
    return (
        <div className="cards">
            <div className="cards-title">
                <h1>Sightings</h1>
                <a href="/sightings">View details</a>
            </div>
            <div className="row-container">
                <div className="row">
                    <div>Resolved sightings</div>
                    <div className="row-value">{resolved.length}</div>
                </div>
                <div className="row">
                    <div>Unresolved sightings</div>
                    <div className="row-value">{unresolved.length}</div>
                </div>
                <div className="row">
                    <div>Sightings under 50% accuracy</div>
                    <div className="row-value">{lowAccuracy.length}</div>
                </div>
            </div>
        </div>
    )
}    
