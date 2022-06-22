import { Component } from 'react';

export default class ResetPassword extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            success: false,
            resetCode: "",
            password: "",
            confirmPassword: ""
        }
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({[name]:value});
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({message: "The passwords don't match."})
        }
        else {
            await fetch(`http://${location.hostname}:8081/api/resetpassword`, {
                method: "POST",
                credentials: 'include',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetCode: this.state.resetCode, password: this.state.password, confirmPassword: this.state.confirmPassword })
            })
            .then(r => r.json())
            .then(response => {
                this.setState({success: response.success, message: response.message})
            });
        }
    }

    render() {
        return (
            <div className="block mx-auto w-fit">
                <div className="max-w-2xl mt-[20vh]">
                    <h1 className="text-7xl">Reset password</h1>
                    <div className="my-16 block mx-auto max-w-[400px]">
                        <form className="block max-w-[400px]" onSubmit={this.handleSubmit}>
                            <input type="text" name="resetCode" placeholder="Reset code" required onChange={this.handleChange} />
                            <input type="password" name="password" placeholder="New password" required onChange={this.handleChange} />
                            <input type="password" name="confirmPassword" placeholder="Confirm password" required onChange={this.handleChange} />
                            <div className="block mx-auto w-fit my-8">
                                <button type="submit" className="font-semibold text-lg rounded-md text-gray-800 bg-pink-500 py-2 px-4">CHANGE PASSWORD</button>
                            </div>
                        </form>
                        {this.state.message && 
                            <p className={`block mx-auto w-fit ${this.state.success ? "text-green-500" : "text-red-500" }`}>{this.state.message}</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}