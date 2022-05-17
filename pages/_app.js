import '../styles/globals.css'
import OneSignal from 'react-onesignal'
import React, { useEffect, useState } from 'react';


function MyApp({ Component, pageProps }) {
    useEffect(() => {
        window.OneSignal = window.OneSignal || [];
        OneSignal.init({
            appId: "edddc938-a7e6-4a9c-a505-d8aa4d314c8e",
            notifyButton: {
                enable: true,
            },

            allowLocalhostAsSecureOrigin: true,
        });
    
        return () => {
            window.OneSignal = undefined;
        };
    }, []); // <-- run this effect once on mount

    const onHandleTag = (tag) => {
        console.log("tagging")
        OneSignal.sendTag("tech", tag).then(() => {
            console.log("Done.")
        })
    }


    return (
        <>
            <Component {...pageProps} />
            <button onClick={onHandleTag('bruh')}>click</button>
        </>
  )
}

export default MyApp
