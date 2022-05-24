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
            <div className="block mx-auto">
                <div className="max-w-2xl mt-[20vh]">
                    <h1 className="text-8xl">Chengeta login</h1>
                    <div className="py-3 block mx-auto max-w-[400px]">
                        <form className="block max-w-[400px]" onSubmit={this.handleSubmit}>
                            <input className="w-[100%] h-10 my-4 rounded-t-sm border-b border-gray-400 focus:border-b-[2px] focus:border-pink-500 focus:outline-none" type="email" name="email" placeholder="Email" required onChange={this.handleChange} />
                            <input className="w-[100%] h-10 my-4 rounded-t-sm border-b border-gray-400 focus:border-b-[2px] focus:border-pink-500 focus:outline-none" type="password" name="password" placeholder="Password" required onChange={this.handleChange} />
                            <div className="block mx-auto w-fit">
                                <button className="border border-gray-600 text-pink-500 py-1 px-2 rounded-md mr-5">FORGOT PASSWORD</button>
                                <button className="rounded-md text-gray-800 bg-pink-500 py-1 px-2 ml-5">LOGIN</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}