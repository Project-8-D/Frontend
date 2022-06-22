import { useState } from "react";

export default function PlayButton({ coord, playing, setPlaying }) {
  const [audio, setAudio] = useState(null);
  const [progress, setProgress] = useState(0);
  
  function playClick(e, coord) {
    e.stopPropagation();
  
    if (playing == coord) {
      setPlaying(null);
      audio?.pause();
    } else {
      e.target.disabled = true;
      audio?.pause();
      setAudio(null);
      const a = new Audio(coord?.sound);
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
  
  return (
    <button className="w-12 h-12 mt-[10px] ml-4 min-w-[3rem] rounded-full bg-pink-500 disabled:bg-pink-500/50 print:hidden transition-[background]" onClick={(e) => playClick(e, coord)} style={{ background: coord == playing ? `conic-gradient(#ec4899 ${progress}deg, #be185d ${progress + 1}deg)` : "" }}>
      <i className="material-icons-round text-[#8e2b5c]/100">{coord == playing ? "stop" : "play_arrow"}</i>
    </button>
  )
}

