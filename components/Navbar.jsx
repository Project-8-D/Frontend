import Image from "next/image";
import { useState, useEffect } from "react";
import MenuItem from "./MenuItem";
import { useRouter } from "next/router";
import profilePic from "../public/ranger.png";

function subscribe(subscribed, setSubscribed) {
    // subscribes the current logged in user
    if (typeof localStorage === "undefined"){
        return
    }

    var url = `http://${location.hostname}:8081/api/subscribe`
    fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    }).then(
        res => {
            if (res.status === 200) {
                setSubscribed(!subscribed)
            }
        }
    )
}

async function isSubscribed() {
    var sub
    await fetch(`http://${location.hostname}:8081/api/subscribed`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            })
        }).then(
            res => res.text
        ).then(
            text => {
                sub = text === "Subscribed"
            }
        )

    return sub
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => setIsOpen(false);

    isSubscribed().then(
        value => setSubscribed(value)
    )

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
        <button className="w-12 h-12" onClick={() => subscribe(subscribed, setSubscribed)} disabled={subscribed === null ? true : undefined}>
          <i className="material-icons-round">{subscribed ? "notifications_off" : "notifications"}</i>
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