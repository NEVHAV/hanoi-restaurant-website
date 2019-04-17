import React, {Component} from 'react'
import axios from 'axios'
import Footer from '../../components/layout/Footer'
import RestaurantDetail from '../../components/restaurant/RestaurantDetail'
import Header from '../../components/layout/Header'
import API from '../../constants/api'
import RestaurantList from "../../components/restaurant/RestaurantList";

export default class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: 0
        }
    }

    componentDidMount() {
        axios.get(API + '/api/restaurants/')
            .then(
                response => {
                    this.setState({restaurant: response.data.data })
                })
            .catch(
                error => console.log('RestaurantList: error!')
            )
    }

    componentDidUpdate(prevProps, prevState) {
        prevProps.match.params.id !== this.props.match.params.id &&
        axios.get(API + '/api/restaurants/' + this.props.match.params.id)
            .then(
                response => {
                    this.setState({restaurant: response.data.data})
                })
            .catch(
                error => console.log('RestaurantDetail: error!')
            )
    }

    render() {
        return (
            <React.Fragment>
                <title>Restaurant list</title>
                <Header/>
                <RestaurantList key={this.props.match.params.id} {...this.props} restaurantList={this.state.restaurant}/>
                <Footer/>
            </React.Fragment>
        )
    }
}
