import Image from "next/image";
import { useState, useEffect } from "react";
import MenuItem from "./MenuItem";

function subscribe(subscribed, setSubscribed) {
    // subscribes the current logged in user
    if (typeof localStorage === "undefined"){
        return
    }

    var url = "https://localhost:8082/api/subscribe"
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
    await fetch("https://localhost:8082/api/subscribed", {
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

  useEffect(() => {
    isSubscribed().then(
        value => setSubscribed(value)
    )
  }, [])
  
  return  <>
    <div className="h-12 bg-gray-900 relative w-full shadow-[rgba(0,0,0,.25)] shadow-lg print:hidden">
      <button className="w-12 h-12" onClick={() => setIsOpen(true)}>
        <i className="material-icons-round">menu</i>
      </button>
      <div className="float-right">
        <button className="w-12 h-12" onClick={() => window.print()}>
          <i className="material-icons-round">print</i>
        </button>
        <button className="w-12 h-12" onClick={() => subscribe(subscribed, setSubscribed)} disabled={subscribed === null ? true : undefined}>
          <i className="material-icons-round">{subscribed ? "notifications_off" : "notifications"}</i>
        </button>
      </div>
    </div>
    {isOpen && <div className="fixed w-full h-full left-0 top-0 bg-black/75 z-9999" onClick={() => setIsOpen(false)}></div>}
    <div className={"fixed w-80 h-full left-0 top-0 bg-gray-800 z-9999 transition-transform -translate-x-full" + (isOpen ? " translate-x-0" : "")}>
    <Image
      src="/ranger.png"
      width={68}
      height={68}
      className="rounded-full w-32 absolute"
      alt="Avatar"
    />
      <MenuItem icon="home" text="Home" href="/" />
      <MenuItem icon="map" text="Sightings" href="/sightings" />
    </div>
  </>
}