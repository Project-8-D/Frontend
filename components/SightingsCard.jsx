export default function SightingsCard() {
    return (
        <div className="cards">
            <div className="cards-title">
                <h1>Sightings</h1>
                <a href="/sightings">View details</a>
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
    )
}    
