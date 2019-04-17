import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import 'moment-timezone';
import '../../components/Modal/editMessage.css';
import axios from "axios";
import API from "../../constants/api";
import {Image} from "cloudinary-react";
import Moment from "react-moment";

export default class ReplyMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reply: false,
            userInfo: ''
        };
        this.getReplyComment = this.getReplyComment.bind(this);
    }

    componentDidMount() {
        console.log(this.props);
        this.getReplyComment();
        this.setState({userInfo: this.props.userInfo});
    }

    postReply(reply) {
        reply.set('content', this.refs.message.value);
        axios({
            method: 'post',
            url: API + '/api/comments',
            data: reply,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("replied!");
                this.getReplyComment();
                this.refs.message.value = '';
            })
            .catch(error => console.log("reply : error!"));
    }

    getReplyComment() {
        axios.get(API + '/api/comments/' + this.props.messageId)
            .then(
                response => {
                    this.setState({reply: response.data.data});
                })
            .catch(error => console.log('replyComment: error!'));
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
        let content = this.state.reply;
        let reply = <div></div>;
        if (content) {
            reply = (this.state.reply.reply || []).map((reply) => {
                return (
                    <div className="row commentPost" key={reply.id}>
                        <div className="col-1">
                            <Image className="avatar-2" publicId={reply.user.image_url}></Image>
                        </div>
                        <div className="col-11" style={{textAlign: "justify"}}>
                            <h3
                                style={{fontWeight: "bold !important"}}>{reply.user.username}</h3>
                            <h4 style={{fontWeight: "bold !important"}}>{reply.content}</h4>
                        </div>
                        <p className="col-1"></p>
                        <p className="col-2 time"><Moment
                            format="YYYY/MM/DD HH:MM">{reply.created_at}</Moment></p>
                        <p className="col-2 time">Updated: <Moment fromNow>{reply.updated_at}</Moment>
                        </p>
                        <p className="col-1"></p>
                        <p className="col-2"><i className="fa fa-thumbs-up"/> Like {reply.no_of_like}</p>
                        <p className="col-2"><i className="fa fa-comment"/> Reply {reply.no_of_reply}
                        </p>
                    </div>
                );
            });

            let replyForm = new FormData();
            replyForm.set('user_id', sessionStorage.getItem('id_user'));
            replyForm.set('parent_id', this.props.messageId);

            return (
                <div className="replyMessage row">
                    <h1 className="title col-12"> Reply comment</h1>
                    <div className="row contentMessage col-12">
                        <div className="col-1">
                            <Image className="avatar-2" publicId={content.user.image_url}></Image>
                        </div>
                        <div className="col-11" style={{textAlign: "justify"}}>
                            <h3
                                style={{fontWeight: "bold !important"}}>{content.user.username}</h3>
                            <h4 style={{fontWeight: "bold !important"}}>{content.content}</h4>
                        </div>

                        <p className="col-1"></p>
                        <p className="col-2 time"><Moment
                            format="YYYY/MM/DD HH:MM">{content.created_at}</Moment></p>
                        <p className="col-2 time">Updated: <Moment fromNow>{content.updated_at}</Moment>
                        </p>
                        <p className="col-1"></p>
                        <p className="col-2"><i className="fa fa-thumbs-up"/>Like {content.no_of_like}</p>
                        <p className="col-2"><i className="fa fa-comment"/> Reply {content.no_of_reply}
                        </p>

                        <div className="col-1"></div>
                        <div className="col-11">
                            {reply}
                        </div>
                    </div>
                    <div className="col-1"></div>
                    <input
                        name="replyComment" className="form-control col-10" id="Reply"
                        defaultValue={""}
                        placeholder="Reply"
                        ref="message"/>
                    <div className="col-1"></div>
                    <div className="col-12">
                        <button className="btn delicious-btn mt-30"
                                onClick={() => {
                                    this.postReply(replyForm);
                                    this.postNotification(content.user.id, 3, this.state.userInfo.username + ' replied your comment')
                                }} type="button"
                                style={{float: "right", fontSize: "15px"}}>Reply
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div></div>
        );
    }
}
