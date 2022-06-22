import { Component } from 'react';
import Link from "next/link";

export default class Login extends Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      errorMessage: ""
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    await fetch(`http://${location.hostname}:8081/api/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    }).then(response => {
      if (response.status === 200) {
        response.json().then((body) => {
          localStorage.setItem("token", body)
          window.location.pathname = "/";
          this.setState({ errorMessage: "" });
        });
      } else {
        this.setState({ errorMessage: response.status == 400 ? "Wrong username or password" : response.statusText });
      }
    });
  }

    render() {
        return (
            <div className="block mx-auto w-fit">
                <div className="max-w-2xl mt-[20vh]">
                    <h1 className="text-7xl">Chengeta login</h1>
                    <div className="my-16 block mx-auto max-w-[400px]">
                        <form className="block max-w-[400px]" onSubmit={this.handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required onChange={this.handleChange} />
                            <input type="password" name="password" placeholder="Password" required onChange={this.handleChange} />
                            <div className="block mx-auto w-fit my-8">
                                <button className="font-semibold text-lg rounded-md text-gray-800 bg-pink-500 py-2 px-4 ml-7">LOGIN</button>
                                <Link href="/forgotpassword">
                                  <a className="font-semibold text-lg  border-gray-600 text-pink-500 rounded-md ml-14">FORGOT PASSWORD?</a>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
