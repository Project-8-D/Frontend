export default function StatusCards({ coords }) {
    let resolved = coords.filter(coord => coord.resolved == true)
    let unresolved = coords.filter(coord => coord.resolved == false)
    let urgent = unresolved.filter(coord => coord.soundType == "gunshot")
    return (
        <div className="flex flex-nowrap gap-12 justify-between">
            <div className="cards">
                <h1 className="text-center">Open</h1>
                <p className="cards-number">{unresolved.length}</p>
            </div>
            <div className="cards">
                <h1 className="text-center">Urgent</h1>
                <p className="cards-number">{urgent.length}</p>
            </div>
            <div className="cards">
                <h1 className="text-center">Resolved</h1>
                <p className="cards-number">{resolved.length}</p>
            </div>
        </div>
    )
}