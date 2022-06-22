import "../styles/globals.css"
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import App from "next/app";
import Popup from "../components/Popup";
import { useRouter } from "next/router";
import Head from "next/head";

let socket;

export default function MyApp({ Component, pageProps }) {
  if (typeof location !== "undefined" && !location.pathname.startsWith("/login") &&
   !location.pathname.startsWith("/resetpassword") && !location.pathname.startsWith("/forgotpassword")
    && !localStorage.getItem("token")) {
    window.location.pathname = "/login";
  }

  const [coords, setCoords] = useState([]);
  const router = useRouter();
  const [lastNotification, setLastNotification] = useState(undefined);

  useEffect(() => {
    let token;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    if (token) {
      fetch(`http://${location.hostname}:8081/api/notifications`, {
        headers: new Headers({
          "Authorization": "Bearer " + token
        })
      })
      .then(response => {
        if (response.status === 200) {
          response.json().then(data => {
            setCoords(data);
          });
        } else if (response.status === 401) {
          localStorage.removeItem("token");
          location.href = "/login";
        }
      });

      if (!socket) {
        socket = new WebSocket(`ws://${location.hostname}:8081/ws`);
        socket.onmessage = async event => {
          socket.send("");
          const data = JSON.parse(event.data);
          setCoords(oldCoords => [...oldCoords, data]);
          const notification = await spawnNotification(data);
          setLastNotification(data);
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
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"></link>
      <title>Sightings</title>
    </Head>
    <Navbar />
    <Popup lastNotification={lastNotification} />
    <Component coords={coords} setCoords={setCoords} {...pageProps} />
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