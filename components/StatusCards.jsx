export default function StatusCards({ coords }) {
    let resolved = coords.filter(coord => coord.resolved == true)
    let unresolved = coords.filter(coord => coord.resolved == false)
    return (
        <div className="flex flex-nowrap gap-12 justify-between">
            <div className="cards">
                <h1 className="text-center">Unresolved</h1>
                <p className="cards-number">{unresolved.length}</p>
            </div>
            <div className="cards">
                <h1 className="text-center">Overdue</h1>
                <p className="cards-number">0</p>
            </div>
            <div className="cards">
                <h1 className="text-center">Open</h1>
                <p className="cards-number">{resolved.length}</p>
            </div>
        </div>
    )
}