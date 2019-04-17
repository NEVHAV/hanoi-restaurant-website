import API from '../../constants/api'

export default class AuthServices {
    constructor() {
        this.fetch = this.fetch.bind(this)
    }

    login(userName, password) {
        return this.fetch(API + '/api/users/sign_in', {
            method: 'POST',
            body: JSON.stringify({
                'email': userName,
                'password': password
            })
        }).then(res => {
                return Promise.resolve(res)
            }
        )
    }

    ezLogin(user_id, callback) {
        this.setToken(user_id)
        callback()
    }

    logout() {
        sessionStorage.removeItem('id_user')
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token // handwaiving here
    }

    setToken(idToken) {
        // Saves user token to localStorage
        sessionStorage.setItem('id_user', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return sessionStorage.getItem('id_user')
    }

    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        // if (this.loggedIn()) {
        //   headers['Authorization'] = 'Bearer ' + this.getToken()
        // }

        return fetch(url, {
            headers,
            ...options
        })
            .then(AuthServices._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}

