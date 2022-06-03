import dynamic from "next/dynamic";
import { Component } from "react";
import S from "../components/Sightings";

export default class Sightings extends Component {
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
      return <S coords={this.state.coords}/>;
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