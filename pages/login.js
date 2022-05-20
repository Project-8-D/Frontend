import { Component } from 'react';

export default class Login extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            email: "",
            password: ""
        }
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]:value});
    }

    async handleSubmit(e) {
        e.preventDefault();
    }
    render() {
        return (
            <div className="flex h-[100vh] justify-center items-center">
                <div className=" max-w-2xl ">
                    <h1 className="text-8xl">Chengeta login</h1>
                    <div className="py-3 block mx-auto">
                        <form onSubmit={this.handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required onChange={this.handleChange} />
                            <input type="password" name="password" placeholder="Password" required onChange={this.handleChange} />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}