import PlayButton from "./PlayButton";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function Popup({ lastNotification, countStart=0 }) {
  const [playing, setPlaying] = useState(null);
  const [closed, setClosed] = useState(true);
  const count = useRef(countStart);
  const router = useRouter();

  useEffect(() => {
    if (count.current < 2) {
      count.current++;
    } else {
      setClosed(false);
    }
  }, [lastNotification]);

  return (
    <>
    <div className="backdrop" style={{ opacity: !closed*1 }}></div>
    <div className={"popup rounded-sm fixed flex flex-col gap-4 right-0 m-4 p-4 w-[calc(100%-2rem)] sm:w-80 bg-gray-800 shadow-[rgba(0,0,0,.25)] shadow-lg z-9999 transition-[top] -bottom-full" + (!closed ? " !bottom-0" : " closed")}>
      <div className="flex">
          <PlayButton coord={lastNotification} playing={playing} setPlaying={setPlaying}/>
          <div>
            <p className="select-none text-center p-5 text-xl capitalize">{lastNotification?.sound_type}</p>
          </div>
      </div>
      <div className="popup-buttons flex justify-between">
        <button className="select-none bg-red-600" onClick={() => setClosed(true)}>Close</button>
        <button className="select-none bg-green-600" onClick={
          () => {
            router.push("/sightings?active=" + lastNotification?.guid);
            setClosed(true);
          }
      }>Open</button>
      </div>
  
    </div>
    </>
  )
}