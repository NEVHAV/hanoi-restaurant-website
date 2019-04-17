import React, { Component } from 'react'
import axios from 'axios'
import Footer from '../../components/layout/Footer'
import RestaurantDetail from '../../components/restaurant/RestaurantDetail'
import Header from '../../components/layout/Header'
import API from '../../constants/api'
export default class show extends Component {
  constructor (props) {
    super(props);
    this.state = {
      restaurant: 0
    }
  }

  componentDidMount () {
    axios.get(API+'/api/restaurants/' + this.props.match.params.id)
      .then(
        response => {
          this.setState({restaurant: response.data.data})
        })
      .catch(
        error => console.log('RestaurantDetail: error!')
      )
  }
  componentDidUpdate(prevProps, prevState) {
      prevProps.match.params.id !== this.props.match.params.id &&
      axios.get(API+'/api/restaurants/' + this.props.match.params.id)
          .then(
              response => {
                  this.setState({restaurant: response.data.data})
              })
          .catch(
              error => console.log('RestaurantDetail: error!')
          )
  }
  render () {
    return (
      <React.Fragment>
        <Header/>
        <RestaurantDetail key={this.props.match.params.id} {...this.props} restaurantDetail={this.state.restaurant}/>
        <Footer/>
      </React.Fragment>
    )
  }
}
