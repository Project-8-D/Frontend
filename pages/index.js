import dynamic from "next/dynamic";

// list of latitudes and longitudes
const coords = [[51.626, 4.2], [51.624, 4.198], [51.624, 4.202]];

export default function Home() {
  const Map = dynamic(
    () => import("../components/Map"),
    {
      loading: () => <p>Loading...</p>,
      ssr: false
    }
  );

  fetch('http://localhost:5235/api/test')
    .then(response => response.json())
    .then(data => console.log(data));

  return (
    <Map coords={coords} />
  );
}