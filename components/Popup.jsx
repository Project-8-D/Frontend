import PlayButton from "./PlayButton";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function Popup({ lastNotification }) {
  const [playing, setPlaying] = useState(null);
  const [closed, setClosed] = useState(true);
  const count = useRef(0);
  const router = useRouter();

  useEffect(() => {
    console.log(count.current);
    if (count.current < 2) {
      count.current++;
    } else {
      setClosed(false);
    }
  }, [lastNotification]);

  return (
    <div className={"fixed flex flex-col gap-4 right-0 m-4 p-4 w-80 bg-gray-800 shadow-[rgba(0,0,0,.25)] shadow-lg z-9999 transition-[top] -top-full" + (!closed ? " !top-0" : "")}>
      <div className="flex">
          <PlayButton coord={lastNotification} playing={playing} setPlaying={setPlaying}/>
          <div>
            <p className="select-none text-center p-5 text-xl">{lastNotification?.sound_type}</p>
          </div>
      </div>
      <div className="popup-buttons flex justify-between">
        <button className="select-none bg-red-600" onClick={() => setClosed(true)}>Close</button>
        <button className="select-none bg-green-600" onClick={
          () => {
            setPlaying(false);
            router.push("/sightings?active=" + lastNotification?.guid);
            setClosed(true);
          }
      }>Open</button>
      </div>
  
    </div>
  )
}