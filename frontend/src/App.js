import React from 'react'
import cloudinaryContext from './constants/cloundinary'
import {CloudinaryContext} from 'cloudinary-react';

import './App.css'

import './assets/css/animate.css'
import './assets/css/bootstrap.min.css'
import './assets/css/classy-nav.min.css'
import './assets/css/custom-icon.css'
import './assets/css/font-awesome.min.css'
import './assets/css/magnific-popup.css'
import './assets/css/nice-select.min.css'
import './assets/style.css'

import './assets/css/mCSB_buttons.png'
import './assets/css/map.css'
import './assets/css/leaflet.css'
import './assets/css/skins/default.css'
import './assets/css/style.css'
import {BrowserRouter as Router} from 'react-router-dom'
import SwitchRoute from './Route'

var browserHistory = require("react-router").browserHistory;

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CloudinaryContext cloudName={cloudinaryContext.cloud_name}
                                   uploadPreset={cloudinaryContext.upload_preset}>
                    <Router history={browserHistory}>
                        <div>
                            <SwitchRoute/>
                        </div>
                    </Router>
                </CloudinaryContext>
            </React.Fragment>
        )
    }
}

export default App
