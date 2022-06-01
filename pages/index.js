import dynamic from "next/dynamic";
import { Component } from "react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coords: []
    };

    if (typeof window !== 'undefined')
      this.token = localStorage.getItem('token')
  }

  render() {
    if (!this.token && typeof window !== 'undefined') {
      window.location.pathname = "/login"
    }
    else {
      const Dashboard = dynamic(
        () => import("../components/Dashboard"),
        {
          loading: () => <p>Loading...</p>,
          ssr: false
        }
      );
  
      return (
        <Dashboard coords={this.state.coords}/>
      );
    }
  }

  componentDidMount() {
    console.log(this.token)
    fetch("https://localhost:8082/api/notifications", {
      headers: new Headers({
          'Authorization': 'Bearer ' + this.token
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ coords: data });
      });
  }
}