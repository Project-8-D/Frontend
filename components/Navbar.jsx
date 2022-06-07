import Image from "next/image";
import { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { useRouter } from "next/router";
import profilePic from "../public/ranger.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => setIsOpen(false);

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [])

  return  <>
    <div className="h-12 bg-gray-900 relative w-full shadow-[rgba(0,0,0,.25)] shadow-lg print:hidden">
      <button className="w-12 h-12" onClick={() => setIsOpen(true)}>
        <i className="material-icons-round">menu</i>
      </button>
      <div className="float-right">
        <button className="w-12 h-12" onClick={() => window.print()}>
          <span className="material-icons-round">print</span>
        </button>
        <button className="w-12 h-12">
          <i className="material-icons-round">notifications</i>
        </button>
      </div>
    </div>
    {isOpen && <div className="fixed w-full h-full left-0 top-0 bg-black/75 z-9999" onClick={() => setIsOpen(false)}></div>}
    <div className={"fixed w-80 h-full left-0 top-0 bg-gray-800 z-9999 transition-transform -translate-x-full" + (isOpen ? " translate-x-0" : "")}>
      {<div className="menuProfile flex items-center gap-6 m-8">
        <Image
          src={profilePic}
          width={64}
          height={64}
          className="profilePic"
          alt="Avatar"
        />
        <p>Abu Abdohle</p>
      </div>}
      <MenuItem icon="home" text="Home" href="/" />
      <MenuItem icon="map" text="Sightings" href="/sightings" />
    </div>
  </>
}