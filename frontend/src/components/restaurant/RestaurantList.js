import React, {Component} from "react"
import {
    Link,
} from "react-router-dom";
import {Image} from "cloudinary-react";

import "../../components/restaurant/restaurant-2.css"
import StarRatings from "react-star-ratings";

import Pagination from "react-js-pagination";

require('bootstrap-less/bootstrap/bootstrap.less');

export default class RestaurantList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    render() {
        if (this.props.restaurantList !== 0) {
            const restaurantData = this.props.restaurantList;
            const restaurantList = [].concat(restaurantData
                .sort((a, b) => b.rating_avg - a.rating_avg))
                .map((restaurant, index) => {
                    if (index < this.state.activePage*5 && index >= (this.state.activePage-1)*5) {
                        return (
                            <div className="row restaurant" key={index}>
                                <div className="col-4">
                                    <Link to={"restaurant/" + restaurant.id}>
                                        <Image className="image-list" alt="true"
                                               publicId={"restaurant" + restaurant.id}></Image>
                                    </Link>
                                </div>
                                <div className="col-8 content">
                                    <Link to={"restaurant/" + restaurant.id} className="listTitle">
                                        {restaurant.name}
                                    </Link>
                                    <div className="receipe-content">
                                        <div className="ratings">
                                            <StarRatings
                                                rating={restaurant.rating_avg}
                                                starRatedColor="gold"
                                                starDimension="25px"
                                                starSpacing="2px"
                                            />
                                            <a className="info count"> ({restaurant.rating_count} rantings)</a>
                                        </div>
                                    </div>
                                    <div className="info" style={{color: "grey"}}>
                                        <i className="fa fa-map-marker fa-2x" aria-hidden="true"/>
                                        <a className="address">  {restaurant.address}</a>
                                    </div>
                                    <div className="info" style={{color: "grey"}}>
                                        <i className="fa fa-phone fa-2x" aria-hidden="true"/>
                                        <a className="address">  {restaurant.phone}</a>
                                    </div>
                                    <div className="info" style={{color: "grey"}}>
                                        <a className="description"> "{restaurant.description}"</a>
                                    </div>
                                    <Link to={"restaurant/" + restaurant.id} className="detail"> More detail >></Link>
                                </div>
                            </div>
                        );
                    }
                });
            return (
                <div>
                    <div className="breadcumb-area bg-img bg-overlay"
                         style={{backgroundImage: 'url(/img/bg-img/breadcumb3.jpg)'}}>
                        <div className="container h-100">
                            <div className="row h-100 align-items-center">
                                <div className="col-12">
                                    <div className="breadcumb-text text-center">
                                        <h2>Restaurant list</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1"></div>
                        <Pagination className="pagination col-11"
                                    prevPageText='<'
                                    nextPageText='>'
                                    firstPageText='<<'
                                    lastPageText='>>'
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={5}
                                    totalItemsCount={restaurantData.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                        />
                    </div>

                    <div className="receipe-post-area row">
                        {restaurantList}
                    </div>

                    <div className="row">
                        <div className="col-1"></div>
                        <Pagination className="pagination col-11"
                                    prevPageText='<'
                                    nextPageText='>'
                                    firstPageText='<<'
                                    lastPageText='>>'
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={5}
                                    totalItemsCount={restaurantData.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            );
        }
        else {
            return (
                <div></div>
            );
        }
    };
}
