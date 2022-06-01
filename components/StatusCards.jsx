export default function StatusCards() {
    return (
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
        </div>
    )
}