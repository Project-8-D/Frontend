import PlayButton from "./Playbutton";
import { useState } from "react";

export default function Popup({ lastNotification }) {
  const [playing, setPlaying] = useState(null);
  return (
    <div>
      <div>
        <PlayButton coord={lastNotification} playing={playing} setPlaying={setPlaying}/>
        <div>
          <p>{lastNotification?.type}</p>
          <p>{lastNotification?.probability}</p>
        </div>
      </div>

      <div>
        <button>Close</button>
        <button>Resolve</button>
      </div>

    </div>
  )
}