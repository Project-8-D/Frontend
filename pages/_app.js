import "../styles/globals.css"
import Head from "next/head";
import Navbar from "../components/Navbar";

export default function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet"></link>
      <meta name="color-scheme" content="dark"></meta>
    </Head>

    <Navbar />
    <div className="md:p-4">
      <Component {...pageProps} />
    </div>
  </>
}
