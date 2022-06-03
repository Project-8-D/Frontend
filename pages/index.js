import { Component } from "react";
import Dashboard from "../components/Dashboard";

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
      return <Dashboard coords={this.state.coords}/>;
    }
  }

  componentDidMount() {
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