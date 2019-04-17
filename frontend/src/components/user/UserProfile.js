import React from 'react'
import ProfileEdit from './ProfileEdit'
import Modal from 'react-responsive-modal'
import { Link, } from 'react-router-dom'
import {Image, Transformation} from 'cloudinary-react';
import {AuthService} from '../../components/AuthServices'
import API from '../../constants/api'
import './UserProfile.css'

export default class UserProfile extends React.Component {

    constructor() {
        super()
        this.Auth = new AuthService()
        this.state = {
            loading: true,
            loadingRes: true,
            userData: null,
            followRes: [],
            modalEditOpen: false
        }
        this.fetchDataUser = this.fetchDataUser.bind(this)
    }

    onOpenModal = () => {
        this.setState({modalEditOpen: true});
    };

    onCloseModal = () => {
        this.setState({modalEditOpen: false});
    };

    componentWillMount() {
        if (!this.Auth.loggedIn()) {
            this.props.history.push('/login')
        }
    }

    componentDidMount() {
        this.fetchDataUser()
        this.fetchFollowRes()
    }

    fetchDataUser() {
        this.setState({loading: true}, () => fetch(API + '/api/users/' + this.Auth.getToken(), {
            method: 'GET',
        }).then(res => res.json()).then(data => this.setState({loading: false, userData: data.data})))
    }

    fetchFollowRes() {
        this.setState({loadingRes: true}, () => fetch(API + '/api/subscriptions?user_id=' + this.Auth.getToken(), {
            method: 'GET'
        }).then(res => res.json()).then(data => this.setState({loadingRes: false, followRes: data.data})))
    }

    render() {
        const data = this.state.userData
        return (
            this.state.loading ? null : <div>
                <div className="container">
                    <div className="profile">
                        <div className="profile-image">
                            <Image
                                publicId={data.image_url}>
                                <Transformation width="150" height="150" gravity="faces" crop="fill"/>
                            </Image>
                        </div>
                        <div className="profile-user-settings">
                            <h1 className="profile-user-name">{data.username}</h1>
                            <button className="btn profile-edit-btn" onClick={this.onOpenModal}>Edit Profile</button>
                            <Modal open={this.state.modalEditOpen} onClose={this.onCloseModal}>
                                <ProfileEdit data={data} reFetchData={this.fetchDataUser} closeModal = {this.onCloseModal}/>
                            </Modal>
                        </div>
                        <div className="profile-bio">
                            <p>
                                <span className="profile-real-name">{data.email}</span> {data.address}
                            </p>
                        </div>
                    </div>
                    {/* End of profile section */}
                </div>
                {/* End of container */}
                <main>
                    <div className="container">
                        <div className="gallery">
                            {
                                this.state.loadingRes ? <div className='loader'/> :
                                    this.state.followRes.map((e, index) => <div className="gallery-item" key={index} tabIndex={0}>
                                        <div className="gallery-image">
                                            <Image
                                                publicId="default_restaurant.jpg">
                                            </Image>
                                            <p align="center"> {e.restaurant.name} </p>
                                        </div>

                                        <Link to={'/restaurant/'+e.restaurant_id} className="gallery-item-info">
                                            <ul>
                                                <li className="gallery-item-likes">
                                                    <span className="visually-hidden">Likes:</span>
                                                    <i className="fas fa-heart" aria-hidden="true"/> 56
                                                </li>
                                                <li className="gallery-item-comments">
                                                    <span className="visually-hidden">Comments:</span>
                                                    <i className="fas fa-comment" aria-hidden="true"/> 2
                                                </li>
                                            </ul>
                                        </Link>
                                    </div>)
                            }

                        </div>
                        {/* End of gallery */}
                    </div>
                    {/* End of container */}
                </main>
            </div>

        )
    }
}

