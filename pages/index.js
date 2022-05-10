export default function Home() {
  fetch('http://localhost:5235/api/test')
    .then(response => response.json())
    .then(data => console.log(data))
  return (
    <h1>Home</h1>
  )
}
