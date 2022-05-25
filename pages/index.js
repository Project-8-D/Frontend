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
    const Dashboard = dynamic(
      () => import("../components/dashboard"),
      {
        loading: () => <p>Loading...</p>,
        ssr: false
      }
    );

    return (
      <Dashboard coords={this.state.coords}/>
    );
  }

  componentDidMount() {
    fetch("https://localhost:8082/api/notifications")
      .then(response => response.json())
      .then(data => {
        this.setState({ coords: data });
      });
  }
}