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
            <div className="block mx-auto w-fit">
                <div className="max-w-2xl mt-[20vh]">
                    <h1 className="text-7xl">Chengeta login</h1>
                    <div className="my-16 block mx-auto max-w-[400px]">
                        <form className="block max-w-[400px]" onSubmit={this.handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required onChange={this.handleChange} />
                            <input type="password" name="password" placeholder="Password" required onChange={this.handleChange} />
                            <div className="block mx-auto w-fit my-8">
                                <button className="font-semibold text-lg border border-gray-600 text-pink-500 py-2 px-4 rounded-md mr-10">FORGOT PASSWORD</button>
                                <button className="font-semibold text-lg rounded-md text-gray-800 bg-pink-500 py-2 px-4 ml-10">LOGIN</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}