import React, {Component} from 'react'
import {AuthService} from '../../components/AuthServices'

// api
import API from '../../constants/api'
import classNames from "classnames";

export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            email: '',
            password: '',
            rePassword: '',
            emailValidation: false,
            passwordValidation: false,
            errorValidate: null,
            errorSignup: null,
            messageSignup: null
        }
        this.Auth = new AuthService()
    }

    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase())
    }

    static validatePassword(password, rePassword) {

        let valid = password.length >= 6 && password === rePassword
        let error = password.length < 6 ? 'Password requires minimum 6 characters' : password !== rePassword ? 'Password not match' : null

        return {
            valid,
            error
        }
    }

    onNameInputChange(value) {
        this.setState({userName: value})
    }

    onEmailInputChange(value) {
        this.setState({email: value},)
    }

    onPasswordChange(value) {
        const {valid, error} = Signup.validatePassword(value, this.state.rePassword)
        this.setState({password: value, passwordValidation: valid, errorValidate: error})
    }

    onRePasswordChange(value) {
        const {valid, error} = Signup.validatePassword(this.state.password, value)
        this.setState({rePassword: value, passwordValidation: valid, errorValidate: error})
    }

    signUp() {
        return new Promise((resolve, reject) => {
            fetch(API + '/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'username': this.state.userName,
                    'email': this.state.email,
                    'password': this.state.password,
                    'password_confirmation': this.state.rePassword
                })
            })
                .then(res => resolve(res.json()))
                .catch(error => reject(error))
        })
    }

    handleSubmit(e) {
        //TODO validate sign up form
        e.preventDefault()
        this.state.passwordValidation && this.signUp().then(data =>
            data.status === 'error' ? this.setState({errorSignup: data.errors[0]}) : this.setState({errorSignup: null}, () => this.Auth.ezLogin(data.data.id, () => this.props.history.push('/profile'))))
    }

    componentWillMount() {
        this.Auth.loggedIn() && this.props.history.push('/profile')
    }

    render() {
        return (
            <div className="register-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 cnt-bg-photo d-none d-xl-block d-lg-block d-md-block"
                             style={{backgroundImage: 'url(/img/side-img.jpg)'}}>
                            <div className="register-info">
                                <h3 style={{}}>Restaurants</h3>
                                <p style={{color: 'black'}}>Sign up now to review more restaurant and follow your
                                    favourite
                                    restaurants!</p>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12 align-self-center">
                            <div className="content-form-box register-box">
                                <div className="login-header"><h4>Create Your account</h4></div>
                                <form onSubmit={e => this.handleSubmit(e)}>
                                    <div className="form-group">
                                        <label>Nickname</label>
                                        <input type="text" className="form-control" name="Nickname"
                                               placeholder="Nickname"
                                               value={this.state.userName}
                                               onChange={e => this.onNameInputChange(e.target.value)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" className="form-control" name="email"
                                               placeholder="Email Address"
                                               value={this.state.email}
                                               onChange={e => this.onEmailInputChange(e.target.value)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="Password" className="form-control" name="password"
                                               placeholder="Password"
                                               value={this.state.password}
                                               onChange={e => this.onPasswordChange(e.target.value)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Re-type Password</label>
                                        <input type="Password" className="form-control" name="password"
                                               placeholder="Confirm Password"
                                               value={this.state.rePassword}
                                               onChange={e => this.onRePasswordChange(e.target.value)}/>
                                    </div>
                                    <div className="form-message">
                                        {this.state.errorValidate}
                                    </div>
                                    <div
                                        className={classNames("form-message", {['message-login']: this.state.errorSignup})}>
                                        {this.state.errorSignup}
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-color btn-md btn-block">Create New
                                            Account
                                        </button>
                                    </div>
                                    <div className="login-footer text-center">
                                        <p>Already have an account?<a href="/logIn"> Sign In</a></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
