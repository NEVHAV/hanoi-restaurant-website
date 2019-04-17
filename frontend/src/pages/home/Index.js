import React, { Component } from 'react'
import Homepage from '../../components/home/Homepage'
import axios from 'axios'
import Footer from '../../components/layout/Footer'
import Header from '../../components/layout/Header'
import API from '../../constants/api'

export default class index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      restaurant: 0
    }
  }

  componentDidMount () {
    axios.get(API + `/api/restaurants`)
      .then(
        response => {
          this.setState({restaurant: response.data.data})
        })
      .catch(
        error => console.log('Restaurants\'s error!')
      )
  }

  render () {
    return (
      <React.Fragment>
        <title>Restaurant</title>
        <Header {...this.props}/>
        <Homepage {...this.props} restaurantInfo={this.state.restaurant}/>
        <Footer/>
      </React.Fragment>
    )
  }
}
