export default function Settings() {
  return (
    <div className="m-8">
      <h1 className="text-3xl">Settings</h1>
      <div className="grid [grid-template-columns:max-content_max-content] gap-4 items-center w-max">
        <label htmlFor="marker">marker type</label>
        <select id="marker">
          <option value="circle">circle</option>
          <option value="icon">icon</option>
        </select>

        <label htmlFor="notifications">notifications</label>
        <input type="checkbox" id="notifications" defaultChecked={true} />

        <label htmlFor="saveFilters">save filters</label>
        <input type="checkbox" id="saveFilters" defaultChecked={true} />

        <button className="bg-pink-500 rounded-sm px-4 py-2 my-4 font-bold [grid-column:2] w-min mx-auto" onClick={() => { localStorage.removeItem("token"); location.href = "/login"}}>LOGOUT</button>
        <h1 className="text-3xl [grid-column:1/3]">Attribution</h1>
        <label>map library</label> <p><a href="https://leafletjs.com/">Leaflet</a></p>
        <label>map data</label> <p>&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</p>
        <label>icons</label> <p><a href="https://github.com/google/material-design-icons">Material Design icons</a> by Google</p>
      </div>
    </div>
  );
}