import React, {Component} from 'react'
import {Modal} from 'react-bootstrap'
import 'moment-timezone';
import '../../components/Modal/editMessage.css';
import axios from "axios";
import API from "../../constants/api";

export default class EditMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            save: true
    }
    }

    componentDidMount() {
        console.log(this.props);
    }

    putComment() {
        let comment = new FormData();
        comment.set('content', this.refs.edit.value);
        axios({
            method: 'put',
            url: API + '/api/comments/' + this.props.messageId,
            data: comment,
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log("updated comment!");
                this.setState({save: false})
            })
            .catch(error => console.log("updated comment: error!"));
    }

    render() {
        let content = this.props.content;
        return (
            <div className="edit">
                <div className="content row">
                    <h1 className="col-12">Edit comment</h1>
                    <div className="col-2"></div>
                    <textarea
                        name="editComment" className="form-control col-8" id="edit"
                        placeholder="Reply"
                        defaultValue={content}
                        ref="edit"/>
                    <div className="col-2"></div>
                    <div className="col-12 edit-button">
                        {this.state.save
                            ?
                            <button
                                className="btn delicious-btn mt-30"
                                type="submit"
                                style={{float: "right", fontSize: "15px"}} onClick={() => this.putComment()}>Save
                            </button>
                            :
                            <button
                                className="btn delicious-btn mt-30 cancel"
                                type="submit"
                                style={{float: "right", fontSize: "15px"}} >Saved
                            </button>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
