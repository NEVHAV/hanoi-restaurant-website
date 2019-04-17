import React from 'react'
import PeopleProfile from '../../components/user/PeopleProfile'
import Header from '../../components/layout/Header'

export default class Profile extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Header {...this.props}/>
                <PeopleProfile {...this.props}/>
            </React.Fragment>
        )
    }

}
