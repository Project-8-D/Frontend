import { useState, useEffect } from "react";

export default function Settings() {
  let loadedSettings = {};
  if (typeof window !== "undefined") {
    loadedSettings = JSON.parse(localStorage?.getItem("settings") ?? "{}");
  }
  
  const [settings, setSettings] = useState({
    markerType: loadedSettings.markerType ?? "circle",
    markerColor: loadedSettings.markerColor ?? "type",
    emails: loadedSettings.emails ?? false,
    popups: loadedSettings.popups ?? true,
    volume: loadedSettings.volume ?? 100
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="m-8">
      <h1 className="text-3xl">Settings</h1>
      <div className="grid [grid-template-columns:max-content_max-content] gap-4 items-center w-max">
        <label htmlFor="marker-type">marker type</label>
        <select id="marker-type" value={settings.markerType} onChange={e => setSettings({...settings, markerType: e.target.value})}>
          <option value="circle">circle</option>
          <option value="icon">icon</option>
        </select>

        <label htmlFor="marker-color">marker color</label>
        <select id="marker-color" value={settings.markerColor} onChange={e => setSettings({...settings, markerColor: e.target.value})}>
          <option value="type">type</option>
          <option value="probability">probability</option>
        </select>

        <label htmlFor="emails">email notifications</label>
        <input type="checkbox" id="emails" checked={settings.emails} onChange={e => setSettings({...settings, emails: e.target.checked})} />

        <label htmlFor="popups">popups</label>
        <input type="checkbox" id="popups" checked={settings.popups} onChange={e => setSettings({...settings, popups: e.target.checked})} />

        <label htmlFor="volume">volume</label>
        <input type="range" min="0" max="100" value={settings.volume} onChange={e => setSettings({...settings, volume: e.target.value})} />

        <button className="bg-pink-500 rounded-sm px-4 py-2 my-4 font-bold [grid-column:2] w-min mx-auto" onClick={() => { localStorage.removeItem("token"); location.href = "/login"}}>LOGOUT</button>
        <h1 className="text-3xl [grid-column:1/3]">Attribution</h1>
        <label>map library</label> <p><a href="https://leafletjs.com/">Leaflet</a></p>
        <label>map data</label> <p>&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</p>
        <label>icons</label> <p><a href="https://github.com/google/material-design-icons">Material Design icons</a> by Google</p>
      </div>
    </div>
  );
}