import React, {Component} from 'react'
import {AuthService} from '../../components/AuthServices'

import PropTypes from 'prop-types';

// api
import API from '../../constants/api'
//css
import './ProfileEdit.css'

export default class ProfileEdit extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            userName: this.props.data.username,
            location: this.props.data.address,
            password: '',
            rePassword: '',
            oldPassword: '',
            validate: {
                valid: true,
                errors: []
            },
            confirmDialog: false,
        }
        this.Auth = new AuthService()
        this.closeDialog = this.closeDialog.bind(this)
        this.editInfo = this.editInfo.bind(this)
        this.submit = this.submit.bind(this)
    }


    onNameInputChange(value) {
        this.setState({userName: value})
    }

    onLocationInputChange(value) {
        this.setState({location: value})
    }

    onPasswordChange(value) {
        this.setState({password: value}, () => this.setState({validate: this.validate()}))
    }

    onRePasswordChange(value) {
        this.setState({rePassword: value}, () => this.setState({validate: this.validate()}))
    }

    // onOldPasswordChange(value) {
    //     this.setState({oldPassword: value, validate: this.validate()})
    // }

    validate() {
        let valid = true
        let errors = []
        if (this.state.password !== this.state.rePassword) {
            valid = false
            errors.push('password not match!!!')
        }
        if (this.state.password.length > 0 && this.state.password.length < 6) {
            valid = false
            errors.push('password minimum 6 characters')
        }
        // if (this.state.password.length > 0 && this.state.oldPassword.length === 0) {
        //     valid = false
        //     errors.push('old password requires for change new password')
        // }
        return {
            valid,
            errors
        }
    }

    editInfo() {
        return new Promise((resolve, reject) => {
            fetch(API + '/api/users/' + this.Auth.getToken(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: this.state.password.length > 0 ? JSON.stringify({
                    'address': this.state.location,
                    'username': this.state.userName,
                    'password': this.state.password,
                    'password_confirmation': this.state.rePassword
                }) : JSON.stringify({
                    'address': this.state.location,
                    'username': this.state.userName
                })
            })
                .then(res => resolve(res.json()))
                .catch(error => reject(error))
        })
    }

    updateImage(publicId) {
        console.log(publicId)
        return new Promise((resolve, reject) => {
            fetch(API + '/api/users/' + this.Auth.getToken(), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'image_url': publicId,
                })
            })
                .then(() => this.props.reFetchData())
                .catch(error => reject(error))
        })
    }

    handleSubmit(e) {
        //TODO validate sign up form
        e.preventDefault()
        this.setState({confirmDialog: true})
    }

    submit() {
        this.editInfo().then(() => {
            this.props.reFetchData()
            this.props.closeModal()
        }).catch(error => console.log(error))
        this.closeDialog()
    }

    closeDialog() {
        this.setState({confirmDialog: false})
    }

    componentWillMount() {
        !this.Auth.loggedIn() && this.props.history.push('/login')
    }

    onPhotoSelected(file) {
        const url = `https://api.cloudinary.com/v1_1/${
            this.context.cloudName
            }/upload`
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", this.context.uploadPreset);
        fetch(url, {
            method: 'POST',
            body: formData,
        }).then(res => res.json()).then(res => {
            this.updateImage(res.public_id)
            this.props.closeModal()
        })
    }

    render() {
        return (
            <div className="wrapper">
                <div className="form-header">
                    Edit Profile
                </div>
                <div className="form-grp">
                    <label>Full name</label>
                    <input type="text" value={this.state.userName}
                           onChange={e => this.onNameInputChange(e.target.value)}/>
                </div>
                <div className="form-grp">
                    <label>Location</label>
                    <input type="text" value={this.state.location}
                           onChange={e => this.onLocationInputChange(e.target.value)}/>
                </div>
                <div className="form-grp">
                    <label>Password</label>
                    <input type="password" value={this.state.password}
                           onChange={e => this.onPasswordChange(e.target.value)}/>
                </div>
                <div className="form-grp">
                    <label>Password confirmation</label>
                    <input type="password" value={this.state.rePassword}
                           onChange={e => this.onRePasswordChange(e.target.value)}/>
                </div>
                <div className="errors">
                    {this.state.validate.errors.map(e => <p style={{color: 'red'}}>{e}</p>)}
                </div>
                <div className="form-grp">
                    <input type="submit" onClick={e => this.handleSubmit(e)} defaultValue="Update profile"/>
                </div>
                <div className="form-grp">
                    <label>Change Avatar</label>
                    <input type="file"
                           id="fileupload"
                           accept="image/*"
                           multiple={false}
                           ref={fileInputEl =>
                               (this.fileInputEl = fileInputEl)
                           }
                           onChange={() =>
                               this.onPhotoSelected(
                                   this.fileInputEl.files[0]
                               )
                           }/>
                </div>
                <div className={`confirm-dialog${this.state.confirmDialog ? ' visible' : '' }`}>
                    <div className='dialog'>
                        <p>
                            Update Information ?
                        </p>
                        <button onClick={this.submit}>
                            OK
                        </button>
                        <button onClick={this.closeDialog}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
ProfileEdit.contextTypes = {
    cloudName: PropTypes.string,
    uploadPreset: PropTypes.string,
};
