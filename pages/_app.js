import "../styles/globals.css"
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import App from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";

let socket;

export default function MyApp({ Component, pageProps }) {
  if (typeof location !== "undefined" && !location.pathname.startsWith("/login") && !localStorage.getItem("token")) {
    window.location.pathname = "/login";
  }

  const [coords, setCoords] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    
    if (token) {
      fetch("https://localhost:8082/api/notifications", {
        headers: new Headers({
          "Authorization": "Bearer " + token
        })
      })
        .then(response => response.json())
        .then(data => {
          setCoords(data);
        });

      if (!socket) {
        socket = new WebSocket("wss://localhost:8082/ws");
        socket.onmessage = async event => {
          socket.send("");
          const data = JSON.parse(event.data);
          setCoords(oldCoords => [...oldCoords, data]);
          const notification = await spawnNotification(data);
          notification.onclick = () => {
            router.push("/sightings?active=" + data.guid);
            window.focus();
          }
        };
      }
    }
  }, []);

  return <>
    <Head>
      <title>Sightings</title>
    </Head>
    <Navbar />
    <Component coords={coords} {...pageProps} />
  </>
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps }
}

function spawnNotification(data) {
  const args = ["New Sighting", {
    body:
`type: ${data.sound_type}
probability: ${data.probability}%`,
    icon: "./ranger.png",
    image: "./ranger.png"
  }];

  return new Promise((resolve, reject) => {
    if (!("Notification" in window)) {
      reject("Desktop notifications are not supported by this browser.");
    } else if (Notification.permission === "granted") {
      resolve(new Notification(...args));
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted")
          resolve(new Notification(...args));
      });
    }
  });
}