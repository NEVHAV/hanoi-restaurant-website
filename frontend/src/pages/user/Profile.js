import React from 'react'
import UserProfile from '../../components/user/UserProfile'
import Header from '../../components/layout/Header'

export default class Profile extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Header {...this.props}/>
                <UserProfile {...this.props}/>
            </React.Fragment>
        )
    }

}
