import { useState, useEffect, useRef, Fragment } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import colorMap from "./colorMap";

const Map = dynamic(
  () => import("../components/Map"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false
  }
);

const getTextColor = (hex) => (parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16)) / 3 > 150 ? "#000000" : "#ffffff";

export default function Sightings({ coords, setCoords }) {
  const [map, setMap] = useState(null);
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  const [filtersOpened, setFiltersOpened] = useState(false);
  const [filterSoundType, setFilterSoundType] = useState("");
  const [filterResolved, setFilterResolved] = useState("no");
  const [filterProbabilityMin, setFilterProbabilityMin] = useState(0);
  const [filterProbabilityMax, setFilterProbabilityMax] = useState(100);
  const [filterNode, setFilterNode] = useState("");
  const [enableFilterAge, setEnableFilterAge] = useState(false);
  const [filterAge, setFilterAge] = useState(1);
  const [orderBy, setOrderBy] = useState("time");
  const [orderDesc, setOrderDesc] = useState(true);
  const [enableFilterLimit, setEnableFilterLimit] = useState(true);
  const [filterLimit, setFilterLimit] = useState(10);

  function resetFilters() {
    setFilterSoundType("");
    setFilterResolved("no");
    setFilterNode("");
    setFilterProbabilityMin(0);
    setFilterProbabilityMax(100);
    setEnableFilterAge(false);
    setFilterAge(1);
    setOrderBy("time");
    setOrderDesc(true);
    setEnableFilterLimit(true);
    setFilterLimit(10);
  }

  const router = useRouter();

  const handledParams = useRef(false);

  let filtered = coords.filter(coord => {
    return (
      filterSoundType === "" || coord.sound_type === filterSoundType) &&
      (!enableFilterAge || coord.time*1000 >= Number(new Date()) - filterAge*1000*60*60) &&
      coord.probability >= filterProbabilityMin && coord.probability <= filterProbabilityMax &&
      (!filterNode || coord.nodeId == filterNode) && 
      (filterResolved === "both" || coord.resolved === (filterResolved === "yes"));
  }).sort((a, b) => {
    switch (orderBy) {
      case "time":
        return b.time - a.time;
      case "accuracy":
        return b.probability - a.probability;
      case "latitude":
        return b.latitude - a.latitude;
      case "longitude":
        return b.longitude - a.longitude;
    }
  });

  if (!orderDesc) filtered.reverse();

  filtered = filtered.slice(0, enableFilterLimit ? filterLimit : coords.length);

  if (active && filtered.indexOf(active) === -1)
    setActive(null);

  function handleParams(newPath) {
    resetFilters();

    const params = new URLSearchParams((newPath || router.asPath).split("?")[1]);
  
    const active = params.get("active");
    if (active) {
      const found = coords.find(c => c.guid === active);
      if (found) setActive(found);
    }
  
    const soundType = params.get("soundtype");
    if (soundType) setFilterSoundType(soundType);
  
    const resolved = params.get("resolved");
    if (resolved) setFilterResolved(resolved);
  
    const limit = params.get("limit");
    if (limit === "off") {
      setEnableFilterLimit(false);
    } else if (limit) {
      setFilterLimit(parseInt(limit));
    }
  
    const maxAge = params.get("maxage");
    if (maxAge) {
      setEnableFilterAge(true);
      setFilterAge(parseInt(maxAge));
    }
  
    const probmax = params.get("probmax");
    if (probmax) setFilterProbabilityMax(probmax);
  }

  function handleResolvedClick(coord) {
    fetch(`http://${location.hostname}:8081/api/resolve`, {
            method: "POST",
            headers: new Headers({
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token")
            }),
            body: JSON.stringify({
              guid: coord.guid,
              resolved: !coord.resolved
            })
        }).then(response => {
            if (response.ok) {
              coord.resolved = !coord.resolved;
              setCoords(coords => coords.map(c => c.guid === coord.guid ? coord : c));
            }
        });
  }

  useEffect(() => {
    if (coords.length && !handledParams.current) {
      handleParams();
      handledParams.current = true;
    }
    router.events.on("routeChangeComplete", handleParams);
    return () => router.events.off("routeChangeComplete", handleParams);
  }, [coords]);

  useEffect(() => {
    if (map) {
      if (active) {
        map.flyTo([active.latitude, active.longitude]);
        const el = document.querySelectorAll(".scrollList > div")[filtered.indexOf(active)];
        if (el) {
          if (el.scrollIntoViewIfNeeded)
            el.scrollIntoViewIfNeeded({ behavior: "smooth" });
          else
            el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        map.flyToBounds([[-4, 19],[0.4, 23.5]]);
      }
    }
  }, [map, active, filtered]);

  function playClick(e, coord) {
    e.stopPropagation();

    if (playing == coord) {
      setPlaying(null);
      audio?.pause();
    } else {
      e.target.disabled = true;
      audio?.pause();
      setAudio(null);
      const a = new Audio(coord.sound);
      a.addEventListener("ended", () => setPlaying(null));
      setProgress(0);
      a.addEventListener("timeupdate", () => setProgress(a.currentTime / a.duration * 360));
      a.play().then(() => {
        setPlaying(coord);
        setAudio(a);
        e.target.disabled = false;
      });
    }
  }

  return <div className="flex flex-col lg:flex-row gap-4 m-4">
    <div className="h-[50vh] lg:h-[calc(100vh-5rem)] w-full lg:w-6/12">
      <Map coords={filtered} current={active} coordClick={(coord) => setActive(coord == active ? null : coord)} setParentMap={setMap}/>
    </div>
    <div className="lg:w-6/12 lg:h-[calc(100vh-5rem)] bg-gray-900 rounded-md">
      <div className="flex justify-between items-center relative box-content shadow-[rgba(0,0,0,.25)] shadow-lg print:shadow-none">
          <h2 className="text-xl pl-4 flex items-center gap-3">{filtersOpened ? "Filters" : "List"} <span className="text-base text-white/50">{filtered.length}/{coords.length}</span></h2>
          <span>
            <button onClick={() => resetFilters()}>
              <i className="material-icons-round">settings_backup_restore</i>
            </button>
            <button className="print:hidden justify-self-end w-12 h-12" onClick={() => setFiltersOpened(!filtersOpened)}>
              <i className="material-icons-round">{filtersOpened ? "view_list" : "filter_alt"}</i>
            </button>
          </span>
      </div>
      <div className="scrollList overflow-y-auto h-[calc(100vh-5.5rem-50vh-3.75rem)] lg:h-[calc(100vh-8rem)] print:!h-auto">
        {filtersOpened ?
          <div className="m-6 grid [grid-template-columns:max-content_max-content] gap-4 items-center w-max mx-auto">
            <label htmlFor="soundtype">type</label>
            <select value={filterSoundType} onChange={e => setFilterSoundType(e.target.value)} id="soundtype">
              <option value="">all</option>
              <option value="animal">animal</option>
              <option value="gunshot">gunshot</option>
              <option value="vehicle">vehicle</option>
              <option value="unknown">unknown</option>
            </select>

            <label htmlFor="resolved">resolved</label>
            <select value={filterResolved} onChange={e => setFilterResolved(e.target.value)} id="resolved">
              <option value="yes">yes</option>
              <option value="no">no</option>
              <option value="both">both</option>
            </select>

            <label htmlFor="node">node</label>
            <select value={filterNode} onChange={e => setFilterNode(e.target.value)} id="node">
              <option value="">all</option>
              {coords.reduce((acc, c) => {
                if (!acc.includes(c.nodeId)) acc.push(c.nodeId);
                return acc;
                }, []).sort(new Intl.Collator(undefined, {numeric: true}).compare).map(n => <option key={n} value={n}>{n}</option>)}
            </select>

            <label htmlFor="probmin">probability</label>
            <div className="flex items-center justify-between">
              <input type="number" min={0} max={filterProbabilityMax} value={filterProbabilityMin} onChange={e => setFilterProbabilityMin(e.target.value)} className="w-5/12" id="probmin"/>
              &#8211;
              <input type="number" min={filterProbabilityMin} max={100} value={filterProbabilityMax} onChange={e => setFilterProbabilityMax(e.target.value)} className="w-5/12"/>
            </div>

            <label htmlFor="age" className={enableFilterAge ? "" : "opacity-50"}>max age</label>
            <div className="flex items-center">
              <input type="checkbox" checked={enableFilterAge} onChange={e => setEnableFilterAge(e.target.checked)}/>
              <input type="number" min={0} value={filterAge} onChange={e => setFilterAge(e.target.value)} className="disabled:opacity-50" disabled={enableFilterAge ? undefined : true} id="age"/>
              <span className="ml-1">h</span>
            </div>

            <label htmlFor="order">order by</label>
            <div className="flex items-center">
            <button onClick={() => setOrderDesc(!orderDesc)} className="select-none mr-1"><span className="material-icons-round text-3xl w-6 -ml-1 mr-1">{orderDesc ? "arrow_downward" : "arrow_upward"}</span></button>
            <select value={orderBy} onChange={e => setOrderBy(e.target.value)} className="grow" id="order">
              <option value="time">time</option>
              <option value="accuracy">accuracy</option>
              <option value="latitude">latitude</option>
              <option value="longitude">longitude</option>
            </select>
            </div>

            <label htmlFor="limit" className={enableFilterLimit ? "" : "opacity-50"}>limit</label>
            <div className="flex items-center">
              <input type="checkbox" checked={enableFilterLimit} onChange={e => setEnableFilterLimit(e.target.checked)}/>
              <input type="number" min={0} value={filterLimit} onChange={e => setFilterLimit(e.target.value)} className="grow disabled:opacity-50" disabled={enableFilterLimit ? undefined : true} id="limit"/>
            </div>
          </div>
          :
          filtered.map((coord, i) => (
            <Fragment key={coord.guid}>
              <div onClick={() => setActive(coord == active ? null : coord)} className={"flex py-2 pr-4 hover:bg-gray-600 print:text-black break-inside-avoid" + (coord == active ? " bg-gray-700 print:font-bold" : "")}>
                <i className={"material-icons-round h-min m-4 text-3xl transition-transform" + (coord == active ? " rotate-180" : "")}>place</i>
                <span className="flex-grow-[1] mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="font-bold">Point #{i + 1}</span>
                  <br />
                  <i className="material-icons-round" title="coordinates">my_location</i> {coord.longitude}, {coord.latitude}
                  <div className={"h-0 overflow-hidden transition-[height] [transition-timing-function:linear]" + (coord == active ? " expanded" : "")}>
                    <i className="material-icons-round" title="time">schedule</i> {new Date(coord.time*1000).toLocaleString()}<br />
                    <i className="material-icons-round" title="node id">scatter_plot</i>
                    &nbsp;
                    <span className="chip" onClick={e => {
                      e.stopPropagation();
                      setFilterNode(coord.nodeId);
                    }}>
                      {coord.nodeId.toString()}
                    </span>
                    <br />
                    <i className="material-icons-round" title="sound type">category</i>
                      &nbsp;
                      <span className="chip" style={{
                        backgroundColor: colorMap[coord.sound_type],
                        color: getTextColor(colorMap[coord.sound_type]) + "BF"
                      }} onClick={e => {
                        e.stopPropagation();
                        resetFilters();
                        setFilterSoundType(coord.sound_type);
                        setEnableFilterLimit(false);
                      }}>{coord.sound_type}</span>
                      <br />
                    <i className="material-icons-round" title="probability">percent</i> {coord.probability}<br />
                    <span className="flex items-center">
                      <i className="material-icons-round" title="resolved">done</i>
                      &nbsp;
                      <input type="checkbox" checked={coord.resolved} onChange={() => handleResolvedClick(coord)} onClick={e => e.stopPropagation()} />
                    </span>
                  </div>
                </span>
                <button className="w-12 h-12 mt-[10px] ml-4 min-w-[3rem] rounded-full bg-pink-500 disabled:bg-pink-500/50 print:hidden transition-[background]" onClick={(e) => playClick(e, coord)} style={{ background: coord == playing ? `conic-gradient(#ec4899 ${progress}deg, #be185d ${progress+1}deg)` : "" }}>
                  <i className="material-icons-round text-[#8e2b5c]/100">{coord == playing ? "stop" : "play_arrow"}</i>
                </button>
              </div>
              {i < coords.length - 1 && <hr className="border-0 h-[2px] bg-gray-800 w-[calc(100%-2rem)] m-auto"/>}
            </Fragment>
          ))
        }
      </div>
    </div>
  </div>
}