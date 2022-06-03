import { useRouter } from "next/router";

export default function StatusCards({ coords }) {
    const router = useRouter();

    let resolved = coords.filter(coord => coord.resolved == true)
    let unresolved = coords.filter(coord => coord.resolved == false)
    let urgent = unresolved.filter(coord => coord.soundType == "gunshot")
    return (
        <div className="flex flex-row sm:flex-col grow gap-4">
            <div className="cards cursor-pointer" onClick={() => router.push("/sightings?open=yes&limit=off")}>
                <h1 className="text-center">Open</h1>
                <p className="cards-number">{unresolved.length}</p>
            </div>
            <div className="cards cursor-pointer" onClick={() => router.push("/sightings?open=yes&soundtype=gunshot&limit=off")}>
                <h1 className="text-center">Urgent</h1>
                <p className="cards-number">{urgent.length}</p>
            </div>
            <div className="cards cursor-pointer" onClick={() => router.push("/sightings?open=no&limit=off")}>
                <h1 className="text-center">Resolved</h1>
                <p className="cards-number">{resolved.length}</p>
            </div>
        </div>
    )
}