import { Component } from 'react';

export default class ResetPassword extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            email: ""
        }
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]:value});
    }

    async handleSubmit(e) {
        e.preventDefault();

        await fetch(`http://${location.hostname}:8081/api/sendresetconfirmation`, {
            method: "POST",
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: `"${this.state.email}"`
        })
        .then(_ => location.href = '/resetpassword');
    }

    render() {
        return (
            <div className="block mx-auto w-fit">
                <div className="max-w-2xl mt-[20vh]">
                    <h1 className="text-7xl">Forgot password</h1>
                    <div className="my-16 block mx-auto max-w-[400px]">
                        <form className="block max-w-[400px]" onSubmit={this.handleSubmit}>
                            <input type="email" name="email" placeholder="Email" required onChange={this.handleChange} />
                            <div className="block mx-auto w-fit my-8">
                                <button className="font-semibold text-lg rounded-md text-gray-800 bg-pink-500 py-2 px-4">CHANGE PASSWORD</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}