import React, {Component} from "react"
import {
    Link,
} from "react-router-dom";

import "../../components/restaurant/restaurant.css"
import Slider from "react-slick";
import StarRatings from 'react-star-ratings';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Moment from 'react-moment';
import 'moment-timezone';
import axios from "axios";
import {Image, Transformation} from 'cloudinary-react';
import API from '../../constants/api';
import Modal from 'react-responsive-modal';
import EditMessage from "../Modal/EditMessage";
import ReplyMessage from "../Modal/ReplyMessage";

export default class RestaurantDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 0,
            ratingId: 0,
            dish: 0,
            userInfo: 0,
            comments: 0,
            reply: false,
            checkComment: 0,
            checkLike: 0,
            subscribe: [],
            countRating: 0,
            countLikeRestaurant: 0,
            like: 0,
            show: false,
            value: '',
        };
        this.changeRating = this.changeRating.bind(this);
        this.getComment = this.getComment.bind(this);
        this.getUser = this.getUser.bind(this);
        this.checkComment = this.checkComment.bind(this);
        this.getSubscribe = this.getSubscribe.bind(this);
        this.getCountRating = this.getCountRating.bind(this);
        this.getCountLikeRestaurant = this.getCountLikeRestaurant.bind(this);
        this.checkLike = this.checkLike.bind(this);
        this.focusTextInput = this.focusTextInput.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.replyRef = React.createRef();
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    componentDidMount() {
        axios.get(API + '/api/dishes/?restaurant_id=' + this.props.match.params.id)
            .then(
                response => {
                    this.setState({dish: response.data.data})
                })
            .catch(
                error => console.log('Dish: error!')
            );
        this.getComment();
        this.getSubscribe();
        this.getUser();
        this.checkComment();
        this.getCountRating();
        this.getRating();
        this.checkLike();
        this.getCountLikeRestaurant();
    }

    onOpenModal = () => {
        this.setState({show: true});
    };

    onCloseModal = () => {
        this.setState({show: false});
        this.getComment();
    };

    onCloseModalReply = () => {
        this.setState({reply: false});
        this.getComment();
    };

    focusTextInput() {
        console.log(this.state.value);
        return this.state.value;

    }

    getUser() {
        axios.get(API + '/api/users/' + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({userInfo: response.data.data})
                })
            .catch(
                error => console.log('Dish: error!')
            )
    }

    getComment() {
        axios.get(API + '/api/comments/?restaurant_id=' + this.props.match.params.id)
            .then(
                response => {
                    this.setState({comments: response.data.data})
                })
            .catch(
                error => console.log('Comments: error!')
            );
    }

    postComment(comment) {
        comment.set('content', this.refs.comment.value);
        axios({
            method: 'post',
            url: API + '/api/comments',
            data: comment,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("commented!");
                this.getComment();
            })
            .catch(error => console.log("comment: error!"));
    }

    deleteComment(commentId) {
        axios({
            method: 'delete',
            url: API + '/api/comments/' + commentId,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("deleted comment!");
                this.getComment();
            })
            .catch(error => console.log("delete comment: error!"));
    }

    checkComment() {
        axios.get(API + '/api/comments/?restaurant_id=' + this.props.match.params.id + "&&user_id=" + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({checkComment: response.data.data})
                })
            .catch(
                error => console.log('Check comments: error!')
            );
    }

    getSubscribe() {
        axios.get(API + '/api/subscriptions/?restaurant_id=' + this.props.match.params.id + "&&" + "user_id=" + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({subscribe: response.data.data})
                })
            .catch(error => console.log('Follow: error!'));
    }

    Subscribe() {
        if (this.state.subscribe.length === 0) {
            const subscribe = new FormData();
            subscribe.set('restaurant_id', this.props.match.params.id);
            subscribe.set('user_id', sessionStorage.getItem("id_user"));
            axios({
                method: 'post',
                url: API + '/api/subscriptions',
                data: subscribe,
                headers: {'Content-Type': 'multipart/form-data'}
            })
                .then(response => {
                    console.log("subscribed!");
                    this.getSubscribe();
                })
                .catch(error => console.log("subscribe: error!"));
        }
        else {
            console.log(this.state.subscribe);
            axios({
                method: 'delete',
                url: API + '/api/subscriptions/' + this.state.subscribe[0].id,
                headers: {'Content-Type': 'multipart/form-data'}
            })
                .then(response => {
                    console.log("deleted subscribe!");
                    this.getSubscribe();
                })
                .catch(error => console.log("delete subscribe: error!"));
        }
    }

    getRating() {
        axios.get(API + '/api/ratings/?restaurant_id=' + this.props.match.params.id + "&&" + "user_id=" + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({rating: response.data.data[0].value});
                    this.setState({ratingId: response.data.data[0].id})
                })
            .catch(error => console.log('Rating: error!'));
    }

    changeRating(newRating) {
        if (this.state.rating === 0) {
            this.setState({
                    rating: newRating
                },
                () => console.log(this.state.rating));

            const rating = new FormData();
            rating.set('restaurant_id', this.props.match.params.id);
            rating.set('user_id', sessionStorage.getItem("id_user"));
            rating.set('value', newRating);
            axios({
                method: 'post',
                url: API + '/api/ratings',
                data: rating,
                headers: {'Content-Type': 'multipart/form-data'}
            })
                .then(response => {
                    console.log("rated!");
                    this.getSubscribe();
                })
                .catch(error => console.log("rating: error!"));
        }
        else {
            this.setState({
                    rating: newRating
                },
                () => console.log(this.state.rating));

            const rating = new FormData();
            rating.set('value', newRating);
            axios({
                method: 'put',
                url: API + '/api/ratings/' + this.state.ratingId,
                data: rating,
                headers: {'Content-Type': 'multipart/form-data'}
            })
                .then(response => {
                    console.log("rating updated!");
                    this.getSubscribe();
                })
                .catch(error => console.log("rating updated: error!"));
        }
        this.getCountRating();
    }

    getCountRating() {
        axios.get(API + '/api/ratings/?restaurant_id=' + this.props.match.params.id)
            .then(
                response => {
                    this.setState({countRating: response.data.data})
                })
            .catch(error => console.log('countRating: error!'));
    }

    getCountLikeRestaurant() {
        axios.get(API + '/api/likes/?object_type=1&object_id=' + this.props.match.params.id)
            .then(
                response => {
                    this.setState({countLikeRestaurant: response.data.data.length});
                })
            .catch(error => console.log('countLikeRestaurant: error!'));
    }

    postLike(objectId, objectType) {
        let like = new FormData();
        like.set('user_id', sessionStorage.getItem('id_user'));
        like.set('object_type', objectType);
        like.set('object_id', objectId);
        axios({
            method: 'post',
            url: API + '/api/likes',
            data: like,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                this.getComment();
                this.checkLike();
                this.getCountLikeRestaurant();
            })
            .catch(error => console.log("like: error!"));
    }

    deleteLike(objectId) {
        axios({
            method: 'delete',
            url: API + '/api/likes/' + objectId,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("deleted like!");
                this.getComment();
                this.checkLike();
                this.getCountLikeRestaurant();
            })
            .catch(error => console.log("delete like: error!"));
    }

    checkLike() {
        axios.get(API + '/api/likes/?&user_id=' + sessionStorage.getItem('id_user'))
            .then(
                response => {
                    this.setState({checkLike: response.data.data});
                })
            .catch(
                error => console.log('Check like: error!')
            );
    }

    postNotification(user_id, type_id, content) {
        console.log(user_id);
        let notification = new FormData();
        notification.set('user_id', user_id);
        notification.set('type_id', type_id);
        notification.set('content', content);
        notification.set('is_read', false);
        axios({
            method: 'post',
            url: API + '/api/notifications',
            data: notification,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("send notification!");
            })
            .catch(error => console.log("notification: error!"));
    }

    render() {
        if (this.props.restaurantDetail !== 0) {
            const restaurantDetail = this.props.restaurantDetail;

            //count rating
            const count = this.state.countRating;
            let countRate = [];
            let sumRating = 0;
            let rateNumber = 0;
            if (count !== 0) {
                countRate = count.map((count, index) => {
                    sumRating = sumRating + count.value;
                    rateNumber = index;
                });
            }
            let countRating =
                <div className="rateCount">
                    <p className="rateCount">{restaurantDetail.rating_count} ratings</p>
                    <p className="rateCount">{restaurantDetail.rating_avg}/5.0</p>
                </div>;

            //show menu
            const dish = this.state.dish;
            let dishes = [];
            if (dish !== 0) {
                dishes = dish.map((dish, index) => {
                    const formatter = new Intl.NumberFormat('de-DE', {
                        style: 'currency',
                        currency: 'VND',
                        minimumFractionDigits: 0
                    });
                    const price = formatter.format(dish.price);
                    return (
                        <div className="col-12 col-sm-6 col-lg-4" key={index}>
                            <div className="single-best-receipe-area mb-30">
                                <Image className="dish_image-4" alt="true"
                                       publicId={"dish" + dish.id}></Image>
                                <div className="receipe-content">
                                    <a>
                                        {dish.name}
                                    </a>
                                    <div className="ratings" style={{color: "grey"}}>
                                        <a>{price}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                });
            }

            //show comment + like + restaurant like
            const commentState = this.state.comments;
            let comments = [];

            if (commentState !== 0) {
                comments = commentState.map((comment) => {
                    let replies = [];
                    let replyCmt = 0;
                    //reply
                    if (comment.no_of_reply > 0) {
                        replyCmt = comment.reply;
                        if (comment.no_of_reply !== 0) {
                            replies = (replyCmt || []).map((reply) => {

                                let replies_2 = [];
                                let replyCmt_2 = 0;
                                //reply 2
                                if (reply.no_of_reply > 0) {
                                    replyCmt_2 = reply.reply;
                                    if (reply.no_of_reply !== 0) {
                                        replies_2 = (replyCmt_2 || []).map((reply) => {

                                            let replies_3 = [];
                                            let replyCmt_3 = 0;
                                            //reply 3
                                            if (reply.no_of_reply > 0) {
                                                replyCmt_3 = reply.reply;
                                                if (reply.no_of_reply !== 0) {
                                                    replies_3 = (replyCmt_3 || []).map((reply) => {

                                                        let replies_4 = [];
                                                        let replyCmt_4 = 0;
                                                        //reply 4
                                                        if (reply.no_of_reply > 0) {
                                                            replyCmt_4 = reply.reply;
                                                            if (reply.no_of_reply !== 0) {
                                                                replies_4 = (replyCmt_4 || []).map((reply) => {

                                                                    //child 4
                                                                    //edit & delete button
                                                                    let optionButton = <div></div>;
                                                                    if (sessionStorage.getItem('id_user')) {
                                                                        if (sessionStorage.getItem('id_user') - reply.user.id === 0) {
                                                                            optionButton =
                                                                                <p>
                                                                                    <Modal
                                                                                        open={this.state.show === reply.id}
                                                                                        onClose={this.onCloseModal}
                                                                                        center>
                                                                                        <EditMessage
                                                                                            content={reply.content}
                                                                                            messageId={reply.id}/>
                                                                                    </Modal>
                                                                                    <i className="fa fa-edit"
                                                                                       style={{cursor: "pointer"}}
                                                                                       onClick={() => this.setState({show: reply.id})}/> Edit &emsp;
                                                                                    <i className="fa fa-trash"
                                                                                       style={{cursor: "pointer"}}
                                                                                       onClick={() => {
                                                                                           if (window.confirm('You really want to delete this message?')) {
                                                                                               this.deleteComment(reply.id)
                                                                                           }
                                                                                       }}/> Delete</p>;
                                                                        }
                                                                    }

                                                                    //like reply button color
                                                                    let likeReplyStyle = {
                                                                        color: 'grey',
                                                                        cursor: 'pointer'
                                                                    };
                                                                    let likedReply = 0;
                                                                    let likeReplyId = 0;
                                                                    (this.state.checkLike || []).map((like) => {
                                                                        if (like.object_id === reply.id && like.object_type === 2) {
                                                                            likedReply = likedReply + 1;
                                                                            likeReplyId = like.id;
                                                                            likeReplyStyle = {
                                                                                color: 'blue',
                                                                                cursor: 'pointer'
                                                                            };
                                                                        }
                                                                    });

                                                                    //like reply and unlike action
                                                                    let likeReplyButton = <p></p>;
                                                                    if (sessionStorage.getItem('id_user')) {
                                                                        if (likedReply === 0) {
                                                                            likeReplyButton =
                                                                                <i className="fa fa-thumbs-up"
                                                                                   onClick={() => {
                                                                                       this.postLike(reply.id, 2);
                                                                                       this.postNotification(reply.user.id, 2, this.state.userInfo.username + ' likes your reply comment')
                                                                                   }}
                                                                                   style={likeReplyStyle}/>
                                                                        }
                                                                        if (likedReply !== 0) {
                                                                            likeReplyButton =
                                                                                <i className="fa fa-thumbs-up"
                                                                                   onClick={() => this.deleteLike(likeReplyId)}
                                                                                   style={likeReplyStyle}/>
                                                                        }
                                                                    }
                                                                    if (!sessionStorage.getItem('id_user')) {
                                                                        likeReplyButton = <i className="fa fa-thumbs-up"
                                                                                             style={{
                                                                                                 color: 'grey',
                                                                                                 cursor: 'pointer'
                                                                                             }}
                                                                                             data-toggle="tooltip"
                                                                                             title="You must log in to like this comment!"
                                                                                             data-placement="top"
                                                                                             disabled/>
                                                                    }

                                                                    return (
                                                                        <div className="row commentPost" key={reply.id}>
                                                                            <div className="col-1">
                                                                                <div>
                                                                                    <Image className="avatar-4"
                                                                                           publicId={reply.user.image_url}></Image>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-11"
                                                                                 style={{textAlign: "justify"}}>
                                                                                <div className="row">
                                                                                    <Link className="col-8" to={'profile'+reply.user.id}
                                                                                        style={{fontWeight: "bold !important"}}>{reply.user.username}</Link>
                                                                                    <div
                                                                                        className="col-4">{optionButton}</div>
                                                                                </div>
                                                                                <h4 style={{fontWeight: "bold !important"}}>{reply.content}</h4>
                                                                            </div>
                                                                            <p className="col-1"></p>
                                                                            <p className="col-2 time"><Moment
                                                                                format="YYYY/MM/DD HH:MM">{reply.created_at}</Moment>
                                                                            </p>
                                                                            <p className="col-2 time">Updated: <Moment
                                                                                fromNow>{reply.updated_at}</Moment>
                                                                            </p>
                                                                            <p className="col-1"></p>
                                                                            <p className="col-2">{likeReplyButton} Like {reply.no_of_like}</p>
                                                                            <p className="col-2"><i
                                                                                className="fa fa-comment"
                                                                                data-toggle="tooltip"
                                                                                title="You can't reply more than 5 times!"
                                                                                data-placement="top"
                                                                                style={{cursor: "pointer"}}/> Reply {reply.no_of_reply}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                });
                                                            }
                                                        }

                                                        else {
                                                            replies_4 = <div></div>;
                                                        }
                                                        //child 3
                                                        //edit & delete button
                                                        let optionButton = <div></div>;
                                                        if (sessionStorage.getItem('id_user')) {
                                                            if (sessionStorage.getItem('id_user') - reply.user.id === 0) {
                                                                optionButton =
                                                                    <p>
                                                                        <Modal open={this.state.show === reply.id}
                                                                               onClose={this.onCloseModal} center>
                                                                            <EditMessage content={reply.content}
                                                                                         messageId={reply.id}/>
                                                                        </Modal>
                                                                        <i className="fa fa-edit"
                                                                           style={{cursor: "pointer"}}
                                                                           onClick={() => this.setState({show: reply.id})}/> Edit &emsp;
                                                                        <i className="fa fa-trash"
                                                                           style={{cursor: "pointer"}} onClick={() => {
                                                                            if (window.confirm('You really want to delete this message?')) {
                                                                                this.deleteComment(reply.id)
                                                                            }
                                                                        }}/> Delete</p>;
                                                            }
                                                        }

                                                        //like reply button color
                                                        let likeReplyStyle = {color: 'grey', cursor: 'pointer'};
                                                        let likedReply = 0;
                                                        let likeReplyId = 0;
                                                        (this.state.checkLike || []).map((like) => {
                                                            if (like.object_id === reply.id && like.object_type === 2) {
                                                                likedReply = likedReply + 1;
                                                                likeReplyId = like.id;
                                                                likeReplyStyle = {color: 'blue', cursor: 'pointer'};
                                                            }
                                                        });

                                                        //like reply and unlike action
                                                        let likeReplyButton = <p></p>;
                                                        if (sessionStorage.getItem('id_user')) {
                                                            if (likedReply === 0) {
                                                                likeReplyButton = <i className="fa fa-thumbs-up"
                                                                                     onClick={() => {
                                                                                         this.postLike(reply.id, 2);
                                                                                         this.postNotification(reply.user.id, 2, this.state.userInfo.username + ' likes your reply comment')
                                                                                     }}
                                                                                     style={likeReplyStyle}/>
                                                            }
                                                            if (likedReply !== 0) {
                                                                likeReplyButton = <i className="fa fa-thumbs-up"
                                                                                     onClick={() => this.deleteLike(likeReplyId)}
                                                                                     style={likeReplyStyle}/>
                                                            }
                                                        }
                                                        if (!sessionStorage.getItem('id_user')) {
                                                            likeReplyButton = <i className="fa fa-thumbs-up"
                                                                                 style={{
                                                                                     color: 'grey',
                                                                                     cursor: 'pointer'
                                                                                 }}
                                                                                 data-toggle="tooltip"
                                                                                 title="You must log in to like this comment!"
                                                                                 data-placement="top" disabled/>
                                                        }

                                                        return (
                                                            <div className="row commentPost" key={reply.id}>
                                                                <div className="col-1">
                                                                    <div>
                                                                        <Image className="avatar-3"
                                                                               publicId={reply.user.image_url}></Image>
                                                                    </div>
                                                                </div>
                                                                <div className="col-11" style={{textAlign: "justify"}}>
                                                                    <div className="row">
                                                                        <Link className="col-8" to={'/profile/'+reply.user.id}
                                                                            style={{fontWeight: "bold !important"}}>{reply.user.username}</Link>
                                                                        <div className="col-4">{optionButton}</div>
                                                                    </div>
                                                                    <h4 style={{fontWeight: "bold !important"}}>{reply.content}</h4>
                                                                </div>
                                                                <p className="col-1"></p>
                                                                <p className="col-2 time"><Moment
                                                                    format="YYYY/MM/DD HH:MM">{reply.created_at}</Moment>
                                                                </p>
                                                                <p className="col-2 time">Updated: <Moment
                                                                    fromNow>{reply.updated_at}</Moment>
                                                                </p>
                                                                <p className="col-1"></p>
                                                                <p className="col-2">{likeReplyButton} Like {reply.no_of_like}</p>
                                                                <p className="col-2"><i className="fa fa-comment"
                                                                                        onClick={() => this.setState({reply: reply.id})}
                                                                                        style={{cursor: "pointer"}}/> Reply {reply.no_of_reply}
                                                                </p>
                                                                <Modal open={this.state.reply === reply.id}
                                                                       onClose={this.onCloseModalReply} center>
                                                                    <ReplyMessage messageId={reply.id}
                                                                                  userInfo={this.state.userInfo}/>
                                                                </Modal>
                                                                <div className="reply col-12 row">
                                                                    <div className="col-1"></div>
                                                                    <div className="col-11">
                                                                        {replies_4}
                                                                    </div>
                                                                    <div className="col-1"></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                }
                                            }

                                            else {
                                                replies_3 = <div></div>;
                                            }

                                            //child 2
                                            //edit & delete button
                                            let optionButton = <div></div>;
                                            if (sessionStorage.getItem('id_user')) {
                                                if (sessionStorage.getItem('id_user') - reply.user.id === 0) {
                                                    optionButton =
                                                        <p>
                                                            <Modal open={this.state.show === reply.id}
                                                                   onClose={this.onCloseModal} center>
                                                                <EditMessage content={reply.content}
                                                                             messageId={reply.id}/>
                                                            </Modal>
                                                            <i className="fa fa-edit" style={{cursor: "pointer"}}
                                                               onClick={() => this.setState({show: reply.id})}/> Edit &emsp;
                                                            <i className="fa fa-trash" style={{cursor: "pointer"}}
                                                               onClick={() => {
                                                                   if (window.confirm('You really want to delete this message?')) {
                                                                       this.deleteComment(reply.id)
                                                                   }
                                                               }}/> Delete</p>;
                                                }
                                            }

                                            //like reply button color
                                            let likeReplyStyle = {color: 'grey', cursor: 'pointer'};
                                            let likedReply = 0;
                                            let likeReplyId = 0;
                                            (this.state.checkLike || []).map((like) => {
                                                if (like.object_id === reply.id && like.object_type === 2) {
                                                    likedReply = likedReply + 1;
                                                    likeReplyId = like.id;
                                                    likeReplyStyle = {color: 'blue', cursor: 'pointer'};
                                                }
                                            });

                                            //like reply and unlike action
                                            let likeReplyButton = <p></p>;
                                            if (sessionStorage.getItem('id_user')) {
                                                if (likedReply === 0) {
                                                    likeReplyButton = <i className="fa fa-thumbs-up"
                                                                         onClick={() => {
                                                                             this.postLike(reply.id, 2);
                                                                             this.postNotification(reply.user.id, 2, this.state.userInfo.username + ' likes your reply comment')
                                                                         }}
                                                                         style={likeReplyStyle}/>
                                                }
                                                if (likedReply !== 0) {
                                                    likeReplyButton = <i className="fa fa-thumbs-up"
                                                                         onClick={() => this.deleteLike(likeReplyId)}
                                                                         style={likeReplyStyle}/>
                                                }
                                            }
                                            if (!sessionStorage.getItem('id_user')) {
                                                likeReplyButton = <i className="fa fa-thumbs-up"
                                                                     style={{color: 'grey', cursor: 'pointer'}}
                                                                     data-toggle="tooltip"
                                                                     title="You must log in to like this comment!"
                                                                     data-placement="top" disabled/>
                                            }

                                            return (
                                                <div className="row commentPost" key={reply.id}>
                                                    <div className="col-1">
                                                        <div>
                                                            <Image className="avatar-2"
                                                                   publicId={reply.user.image_url}></Image>
                                                        </div>
                                                    </div>
                                                    <div className="col-11" style={{textAlign: "justify"}}>
                                                        <div className="row">
                                                            <Link className="col-8" to={'/profile/'+reply.user.id}
                                                                style={{fontWeight: "bold !important"}}>{reply.user.username}</Link>
                                                            <div className="col-4">{optionButton}</div>
                                                        </div>
                                                        <h4 style={{fontWeight: "bold !important"}}>{reply.content}</h4>
                                                    </div>
                                                    <p className="col-1"></p>
                                                    <p className="col-2 time"><Moment
                                                        format="YYYY/MM/DD HH:MM">{reply.created_at}</Moment></p>
                                                    <p className="col-2 time">Updated: <Moment
                                                        fromNow>{reply.updated_at}</Moment>
                                                    </p>
                                                    <p className="col-1"></p>
                                                    <p className="col-2">{likeReplyButton} Like {reply.no_of_like}</p>
                                                    <p className="col-2"><i className="fa fa-comment"
                                                                            onClick={() => this.setState({reply: reply.id})}
                                                                            style={{cursor: "pointer"}}/> Reply {reply.no_of_reply}
                                                    </p>
                                                    <Modal open={this.state.reply === reply.id}
                                                           onClose={this.onCloseModalReply} center>
                                                        <ReplyMessage messageId={reply.id}
                                                                      userInfo={this.state.userInfo}/>
                                                    </Modal>
                                                    <div className="reply col-12 row">
                                                        <div className="col-1"></div>
                                                        <div className="col-11">
                                                            {replies_3}
                                                        </div>
                                                        <div className="col-1"></div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    }
                                }

                                else {
                                    replies_2 = <div></div>;
                                }

                                //child 1
                                //edit & delete button
                                let optionButton = <div></div>;
                                if (sessionStorage.getItem('id_user')) {
                                    if (sessionStorage.getItem('id_user') - reply.user.id === 0) {
                                        optionButton =
                                            <p>
                                                <Modal open={this.state.show === reply.id} onClose={this.onCloseModal}
                                                       center>
                                                    <EditMessage content={reply.content} messageId={reply.id}/>
                                                </Modal>
                                                <i className="fa fa-edit" style={{cursor: "pointer"}}
                                                   onClick={() => this.setState({show: reply.id})}/> Edit &emsp;
                                                <i className="fa fa-trash" style={{cursor: "pointer"}} onClick={() => {
                                                    if (window.confirm('You really want to delete this message?')) {
                                                        this.deleteComment(reply.id)
                                                    }
                                                }}/> Delete</p>;
                                    }
                                }

                                //like reply button color
                                let likeReplyStyle = {color: 'grey', cursor: 'pointer'};
                                let likedReply = 0;
                                let likeReplyId = 0;
                                (this.state.checkLike || []).map((like) => {
                                    if (like.object_id === reply.id && like.object_type === 2) {
                                        likedReply = likedReply + 1;
                                        likeReplyId = like.id;
                                        likeReplyStyle = {color: 'blue', cursor: 'pointer'};
                                    }
                                });

                                //like reply and unlike action
                                let likeReplyButton = <p></p>;
                                if (sessionStorage.getItem('id_user')) {
                                    if (likedReply === 0) {
                                        likeReplyButton = <i className="fa fa-thumbs-up"
                                                             onClick={() => {
                                                                 this.postLike(reply.id, 2);
                                                                 this.postNotification(reply.user.id, 2, this.state.userInfo.username + ' likes your reply comment')
                                                             }}
                                                             style={likeReplyStyle}/>
                                    }
                                    if (likedReply !== 0) {
                                        likeReplyButton = <i className="fa fa-thumbs-up"
                                                             onClick={() => this.deleteLike(likeReplyId)}
                                                             style={likeReplyStyle}/>
                                    }
                                }
                                if (!sessionStorage.getItem('id_user')) {
                                    likeReplyButton = <i className="fa fa-thumbs-up"
                                                         style={{color: 'grey', cursor: 'pointer'}}
                                                         data-toggle="tooltip"
                                                         title="You must log in to like this comment!"
                                                         data-placement="top" disabled/>
                                }

                                return (
                                    <div className="row commentPost" key={reply.id}>
                                        <div className="col-1">
                                            <div>
                                                <Image className="avatar" publicId={reply.user.image_url}></Image>
                                            </div>
                                        </div>
                                        <div className="col-11" style={{textAlign: "justify"}}>
                                            <div className="row">
                                                <Link className="col-8" to={'/profile/'+reply.user.id}
                                                    style={{fontWeight: "bold !important"}}>{reply.user.username}</Link>
                                                <div className="col-4">{optionButton}</div>
                                            </div>
                                            <h4 style={{fontWeight: "bold !important"}}>{reply.content}</h4>
                                        </div>
                                        <p className="col-1"></p>
                                        <p className="col-2 time"><Moment
                                            format="YYYY/MM/DD HH:MM">{reply.created_at}</Moment></p>
                                        <p className="col-2 time">Updated: <Moment fromNow>{reply.updated_at}</Moment>
                                        </p>
                                        <p className="col-1"></p>
                                        <p className="col-2">{likeReplyButton} Like {reply.no_of_like}</p>
                                        <p className="col-2"><i className="fa fa-comment"
                                                                onClick={() => this.setState({reply: reply.id})}
                                                                style={{cursor: "pointer"}}/> Reply {reply.no_of_reply}
                                        </p>
                                        <Modal open={this.state.reply === reply.id} onClose={this.onCloseModalReply}
                                               center>
                                            <ReplyMessage messageId={reply.id} userInfo={this.state.userInfo}/>
                                        </Modal>
                                        <div className="reply col-12 row">
                                            <div className="col-1"></div>
                                            <div className="col-11">
                                                {replies_2}
                                            </div>
                                            <div className="col-1"></div>
                                        </div>
                                    </div>
                                );
                            });
                        }
                    }

                    else {
                        replies = <div></div>;
                    }

                    //new reply
                    let reply = [];
                    let replyForm = new FormData();
                    if (sessionStorage.getItem('id_user')) {
                        replyForm.set('user_id', sessionStorage.getItem('id_user'));
                        replyForm.set('parent_id', comment.id);
                    }
                    reply =
                        <div className="reply col-12 row">
                            <div className="col-1"></div>
                            <div className="col-11">
                                {replies}
                            </div>
                            <div className="col-1"></div>
                        </div>;

                    //like button color
                    let likeStyle = {color: 'grey', cursor: 'pointer'};
                    let liked = 0;
                    let likeId = 0;
                    (this.state.checkLike || []).map((like) => {
                        if (like.object_id === comment.id && like.object_type === 2) {
                            liked = liked + 1;
                            likeId = like.id;
                            likeStyle = {color: 'blue', cursor: 'pointer'};
                        }
                    });

                    //like and unlike action
                    let likeButton = <p></p>
                    if (sessionStorage.getItem('id_user')) {
                        if (liked === 0) {
                            likeButton = <i className="fa fa-thumbs-up"
                                            onClick={() => {
                                                this.postLike(comment.id, 2);
                                                this.postNotification(comment.user.id, 2, this.state.userInfo.username + ' likes your comment')
                                            }}
                                            style={likeStyle}/>
                        }
                        if (liked !== 0) {
                            likeButton = <i className="fa fa-thumbs-up"
                                            onClick={() => this.deleteLike(likeId)}
                                            style={likeStyle}/>
                        }
                    }
                    if (!sessionStorage.getItem('id_user')) {
                        likeButton = <i className="fa fa-thumbs-up"
                                        style={{color: 'grey', cursor: 'pointer'}} data-toggle="tooltip"
                                        title="You must log in to like this comment!" data-placement="top" disabled/>
                    }

                    //edit & delete button
                    let optionButton = <div></div>;
                    if (sessionStorage.getItem('id_user')) {
                        if (sessionStorage.getItem('id_user') - comment.user.id === 0) {
                            optionButton =
                                <p>
                                    <Modal open={this.state.show === comment.id} onClose={this.onCloseModal} center>
                                        <EditMessage content={comment.content} messageId={comment.id}/>
                                    </Modal>
                                    <i className="fa fa-edit" style={{cursor: "pointer"}}
                                       onClick={() => this.setState({show: comment.id})}/> Edit &emsp;
                                    <i className="fa fa-trash" style={{cursor: "pointer"}} onClick={() => {
                                        if (window.confirm('You really want to delete this message?')) {
                                            this.deleteComment(comment.id)
                                        }
                                    }}/> Delete</p>;
                        }
                    }

                    return (
                        <div className="col-12" key={comment.id}>
                            <div className="contact-form-area">
                                <form>
                                    <div className="row commentPost">
                                        <div className="col-1">
                                            <div>
                                                <Image className="avatar" publicId={comment.user.image_url}></Image>
                                            </div>
                                        </div>
                                        <div className="col-11" style={{textAlign: "justify"}}>
                                            <div className="row">
                                                <Link className="col-8" to={'/profile/'+comment.user.id}
                                                    style={{fontWeight: "bold !important"}}>{comment.user.username}</Link>
                                                <div className="col-4">{optionButton}</div>
                                            </div>
                                            <h4 style={{fontWeight: "bold !important"}}>{comment.content}</h4>
                                        </div>
                                        <p className="col-1"></p>
                                        <p className="col-2 time"><Moment
                                            format="YYYY/MM/DD HH:MM">{comment.created_at}</Moment></p>
                                        <p className="col-2 time">Updated: <Moment fromNow>{comment.updated_at}</Moment>
                                        </p>
                                        <p className="col-1"></p>
                                        <p className="col-2">{likeButton} Like {comment.no_of_like}</p>
                                        <p className="col-2"><i className="fa fa-comment"
                                                                onClick={() => this.setState({reply: comment.id})}
                                                                style={{cursor: "pointer"}}/> Reply {comment.no_of_reply}
                                        </p>
                                        <Modal open={this.state.reply === comment.id} onClose={this.onCloseModalReply}
                                               center>
                                            <ReplyMessage messageId={comment.id} userInfo={this.state.userInfo}/>
                                        </Modal>
                                        {reply}
                                    </div>
                                </form>
                            </div>
                        </div>
                    );
                });
            }

            // post new comment, subscribe
            let newComment = [];
            let subscribe = [];
            let commentForm = new FormData();
            let rating = [];
            if (sessionStorage.getItem('id_user')) {
                //new comment
                newComment =
                    <div className="row">
                        <div className="col-12">
                            <div className="contact-form-area">
                                <div className="row">
                                    <div className="col-1">
                                        <div>
                                            <Image className="avatar"
                                                   publicId={this.state.userInfo.image_url}>
                                            </Image>
                                        </div>
                                    </div>
                                    <div className="col-11">
                                        <input name="message" className="form-control" id="message"
                                               placeholder="Message"
                                               defaultValue={""} style={{borderRadius: "15px"}} ref="comment"/>
                                    </div>
                                    <div className="col-12">
                                        <button className="btn delicious-btn mt-30"
                                                onClick={() => this.postComment(commentForm)} type="submit"
                                                style={{float: "right", fontSize: "15px"}}>Post
                                            Comments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>;
                commentForm.set('user_id', sessionStorage.getItem('id_user'));
                commentForm.set('restaurant_id', this.props.match.params.id);

                //subscribe
                if ((this.state.subscribe).length === 0) {
                    subscribe =
                        <a className="btn btn-myself" onClick={() => this.Subscribe()}>
                            <i className="fa fa-plus"
                               style={{color: "white"}}/>Subscribe
                        </a>
                }
                if ((this.state.subscribe).length !== 0) {
                    subscribe =
                        <a className="btn btn-light btn-myself-2" onClick={() => this.Subscribe()}>
                            <i className="fa fa-check"
                               style={{color: "grey"}}/>Subscribed
                        </a>
                }

                //rating
                rating =
                    <StarRatings
                        rating={this.state.rating}
                        changeRating={this.changeRating}
                        starRatedColor="gold"
                        starDimension="30px"
                        starHoverColor="gold"
                        starSpacing="3px"
                    />
            }

            //button comment
            //button like restaurant
            let checkLikeRestaurant = 0;
            let likeRestaurantButton = <h2></h2>;
            let likeRestaurantStyle = {color: 'grey', cursor: 'pointer'};
            let likeRestaurantId = 0;

            if (sessionStorage.getItem('id_user')) {
                let restaurantId = this.props.match.params.id;
                (this.state.checkLike || []).map((like) => {
                    if ((like.object_id - restaurantId) === 0 && like.object_type === 1) {
                        checkLikeRestaurant = 1;
                        likeRestaurantId = like.id;
                        likeRestaurantStyle = {color: 'blue', cursor: 'pointer'};
                    }
                });

                if (checkLikeRestaurant === 0) {
                    likeRestaurantButton = <h2><i className="fa fa-4x fa-thumbs-up"
                                                  onClick={() => this.postLike(this.props.match.params.id, 1)}
                                                  style={likeRestaurantStyle}/> {this.state.countLikeRestaurant} </h2>
                }
                if (checkLikeRestaurant !== 0) {
                    likeRestaurantButton =
                        <h2><i className="fa fa-4x fa-thumbs-up" onClick={() => this.deleteLike(likeRestaurantId)}
                               style={likeRestaurantStyle}/> {this.state.countLikeRestaurant} </h2>
                }
            }

            if (!sessionStorage.getItem('id_user')) {
                newComment =
                    <div>
                        <button className="comment btn">Please <Link className="comment-1" to="/login">log in</Link> to
                            comment this restaurant!
                        </button>
                    </div>;

                subscribe =
                    <a className="btn btn-light btn-myself-2" data-toggle="tooltip"
                       title="You must log in to subscribe this restaurant!" data-placement="top" disabled>
                        <i className="fa fa-plus"
                           style={{color: "grey"}}/>Subscribe
                    </a>;

                rating =
                    <StarRatings
                        starDimension="30px"
                        starSpacing="3px"
                    />;

                likeRestaurantButton = <h2 data-toggle="tooltip"
                                           title="You must log in to like this restaurant!" data-placement="top"
                                           disabled><i className="fa fa-4x fa-thumbs-up" style={{
                    color: 'grey',
                    cursor: 'pointer'
                }}/> {this.state.countLikeRestaurant} </h2>
            }

            const {show} = this.state;
            return (
                <div>
                    <title>{restaurantDetail.name}</title>
                    {/* ##### Header Area End ##### */}
                    {/* ##### Breadcumb Area Start ##### */}
                    <div className="breadcumb-area bg-img bg-overlay"
                         style={{backgroundImage: 'url(/img/bg-img/breadcumb3.jpg)'}}>
                        <div className="container h-100">
                            <div className="row h-100 align-items-center">
                                <div className="col-12">
                                    <div className="breadcumb-text text-center">
                                        <h2>{restaurantDetail.name}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ##### Breadcumb Area End ##### */}
                    <div className="receipe-post-area section-padding-80">
                        {/* Receipe Slider */}
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="receipe-slider">
                                        <Image
                                            publicId={"restaurant" + restaurantDetail.id}>
                                        </Image>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Receipe Content Area */}
                        <div className="receipe-content-area">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 col-md-8">
                                        <div className="receipe-headline my-5">
                                            <span><Moment>{restaurantDetail.updated_at}</Moment></span>
                                            <h2>{restaurantDetail.name}</h2>
                                            <div className="receipe-duration">
                                                <h6 style={{fontStyle: "italic"}}>
                                                    <i className="fa fa-map-marker"
                                                       aria-hidden="true"/>
                                                    &emsp;{restaurantDetail.address}</h6>
                                                <h6 style={{fontStyle: "italic"}}>
                                                    <i className="fa fa-phone"
                                                       aria-hidden="true"/>
                                                    &emsp;{restaurantDetail.phone}</h6>
                                                <h6 style={{fontStyle: "italic"}}>
                                                    <i className="fa fa-clock-o"
                                                       aria-hidden="true"/>
                                                    &emsp;Open: 8h00 - 22h00</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <div className="receipe-ratings text-right my-5">
                                            <div className="ratings">
                                                {rating}
                                                {countRating}
                                            </div>
                                            <div className="row">
                                                <div className="col-5" style={{marginTop: "13px"}}>
                                                    {likeRestaurantButton}
                                                </div>
                                                <div className="col-5">
                                                    {subscribe}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <Tabs>
                                        <TabList className="row">
                                            <Tab className="tab btn">Description</Tab>
                                            <Tab className="tab btn">Menu</Tab>
                                        </TabList>

                                        <TabPanel style={{maxHeight: "1000px", overflow: "auto", textAlign: "justify"}}>
                                            <h4>{restaurantDetail.description}</h4>
                                        </TabPanel>
                                        <TabPanel className="row" style={{maxHeight: "1000px", overflow: "auto"}}>
                                            {dishes}
                                        </TabPanel>
                                    </Tabs>
                                </div>
                                <div className="row" style={{marginTop: "4em"}}>
                                    <div className="col-12">
                                        <div className="section-heading text-left">
                                            <h3>Comment</h3>
                                        </div>
                                        {comments}
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: "4em"}}>
                                    <div className="col-12">
                                        <div className="section-heading text-left">
                                            <h3>Leave a comment</h3>
                                        </div>
                                    </div>
                                </div>
                                {newComment}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    }
}
