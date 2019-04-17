import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {AuthService} from '../../components/AuthServices'
import Modal from 'react-responsive-modal'
import SearchBox from '../../components/SearchBox'
import API from '../../constants/api'
import axios from "axios";
import Moment from 'react-moment';
import 'moment-timezone';

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            userData: null,
            notification: [],
            showNotification: false,
            second: 0,
            searchModalOpen: false,
        };
        this.Auth = new AuthService();
        this.getNotification = this.getNotification.bind(this);
        this.updateNotification = this.updateNotification.bind(this);
    }

    componentDidMount() {
        if (this.Auth.loggedIn()) {
            fetch(API + '/api/users/' + this.Auth.getToken(), {
                method: 'GET',
            }).then(res => res.json()).then(data => this.setState({loading: false, userData: data.data}))
        }
        this.getNotification();
        this.interval = setInterval(() => this.getNotification(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    onOpenModal = () => {
        this.setState({searchModalOpen: true})
    }

    onCloseModal = () => {
        this.setState({searchModalOpen: false})
    }

    getNotification() {
        axios.get(API + '/api/notifications/?user_id=' + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({notification: response.data.data});
                    // console.log(response.data.data);
                })
            .catch(
                error => console.log('get notifications: error!')
            );
    }

    updateNotification(notificationId, is_read) {
        let notification = new FormData();
        notification.set('is_read', is_read);
        axios({
            method: 'put',
            url: API + '/api/notifications/' + notificationId,
            data: notification,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("send notification!");
            })
            .catch(error => console.log("notification: error!"));
    }

    showNotification() {
        if (this.state.showNotification) {
            this.setState({showNotification: false});
        }
        else {
            this.state.notification.map((noti, index) => {
                if (!noti.is_read) {
                    this.updateNotification(noti.id, true);
                }
            });
            this.setState({showNotification: true});
        }
    }
    logout = () =>  {
        fetch(API + '/api/users/sign_out', {
            method: "DELETE",
        })
    }

    render() {
        let numberOfNoti = this.state.notification.length;
        this.state.notification.map((noti, index) => {
            if (noti.is_read) {
                numberOfNoti--;
            }
        });
        let notification;
        if (numberOfNoti > 0)
            notification = <a href="#" onClick={() => this.showNotification()}>Notification <mark
                style={{backgroundColor: "#ff0000", color: "white"}}>{numberOfNoti}</mark>
            </a>;
        else
            notification = <a href="#" onClick={() => this.showNotification()}>Notification</a>;
        const notiModal = (this.state.notification || []).map((notification) => {
            let icon = <i/>;
            if (notification.type_id === 2) {
                icon = <i className="fa fa-thumbs-up fa-2x" style={{color: "#4db8ff", marginLeft: "0 !important"}}/>
            }
            if (notification.type_id === 3) {
                icon = <i className="fa fa-comments-o fa-2x" style={{color: "#5cd65c", marginLeft: "0 !important"}}/>
            }
            if (notification.type_id === 4) {
                icon = <i className="fa fa-bell fa-2x" style={{color: "#e6e600", marginLeft: "0 !important"}}/>
            }
            return (
                <div style={{
                    height: "60px",
                    width: "530px",
                    border: "solid",
                    borderColor: "#cccccc",
                    borderWidth: "0.5px 1px 0 1px",
                    backgroundColor: "#e9ebee",
                    top: "500px"
                }} key={notification.id}>
                    <div className="row" style={{
                        width: "500px",
                        marginTop: "5px",
                        marginLeft: "15px",
                        textAlign: "justify",
                        padding: "10px"
                    }}>
                        <a className="col-1">{icon}</a>
                        <h4 className="col-11">
                            <b>{notification.content}</b> at <Moment
                                format="YYYY/MM/DD HH:MM">{notification.created_at}</Moment></h4>
                    </div>
                </div>
            );
        });

        return (
            <header className="header-area">
                {/* Top Header Area */}
                <div className="delicious-main-menu">
                    <div className="classy-nav-container breakpoint-off">
                        <div className="container">
                            {/* Menu */}
                            <nav className="classy-navbar justify-content-between" id="deliciousNav">
                                {/* Logo */}
                                <a className="nav-brand" href="/"><img src="/img/core-img/logo.png"/></a>
                                {/* Navbar Toggler */}
                                <div className="classy-navbar-toggler">
                                    <span className="navbarToggler"><span/><span/><span/></span>
                                </div>
                                {/* Menu */}
                                <div className="classy-menu">
                                    {/* close btn */}
                                    <div className="classycloseIcon">
                                        <div className="cross-wrap"><span className="top"/><span
                                            className="bottom"/></div>
                                    </div>
                                    {/* Nav Start */}
                                    <div className="classynav">
                                        <ul>
                                            <li><a href="/">Home</a></li>
                                            <li><a href="/restaurant">Restaurant</a></li>
                                            {!this.state.loading ?  <li>{notification}</li> : null
                                            }
                                            {this.state.loading ? <li><Link to="/logIn">Login</Link></li> : <li><Link
                                                to="/profile">{this.state.userData.username}</Link></li>}
                                            {this.state.loading ? null : this.state.userData.admin &&
                                                <li><a href={API + '/admin/?auth_token=' + this.state.userData.auth_token}>Admin</a></li>}
                                            {!this.state.loading && <li><Link onClick={() => {
                                                this.Auth.logout();
                                                this.logout();
                                                this.setState({loading: true})
                                            }} to='/home'>Logout</Link></li>}
                                        </ul>
                                        {/* Newsletter Form */}
                                        <div className="search-btn">
                                            <i className="fa fa-search" aria-hidden="true" onClick={this.onOpenModal}/>
                                            <Modal open={this.state.searchModalOpen} center={true}
                                                   onClose={this.onCloseModal}
                                                   styles={{'modal': {'transform': 'translateY(-20%)'}}}>
                                                <SearchBox closeModal={this.onCloseModal}/>
                                            </Modal>
                                        </div>
                                        <div style={{
                                            height: "auto",
                                            width: "530px",
                                            position: "absolute",
                                            marginLeft: "0px",
                                            top: "90px",
                                            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                        }}>
                                            {this.state.showNotification ? notiModal : null}
                                        </div>
                                    </div>
                                    {/* Nav End */}
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}
