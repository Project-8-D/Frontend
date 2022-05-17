import dynamic from "next/dynamic";
import { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: []
    };
  }

  render() {
    const Map = dynamic(
      () => import("../components/Map"),
      {
        loading: () => <p>Loading...</p>,
        ssr: false
      }
    );

    return (
      <Map coords={this.state.coords}/>
    );
  }

  componentDidMount() {
    fetch("http://localhost:5235/api/notifications")
      .then(response => response.json())
      .then(data => {
        this.setState({ coords: data });
      });

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/serviceWorker.js")
      })
    }
  }
}