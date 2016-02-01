import globals from '../globals'

var store = {}

const config = {
    ip: 'http://127.0.0.1:5000/'/*'http://api.woording.com/'*/,
	devMode: true // automatically log 'cor' in
}
export default store

store.loggedIn = true
store.username = config.devMode ? 'cor' : ''
store.password = config.devMode ? 'Hunter2' : ''
store.cachedToken = null
store.deletedList = null


/**
 * Fetch a token based on username and listname
 * used internally
 * will try to use cachedToken first, otherwise request a new one from the server
 *
 * @return {Promise} token
 */
store.fetchToken = () => {
	return new Promise((resolve, reject) => {

		if (store.cachedToken != null) {
			resolve(store.cachedToken)
		} else {
            if(!store.username){
                console.log('Error: not logged in')
                return
            }
            fetch(config.ip + 'authenticate', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    'username': store.username,
                    'password': store.password
                })
            }).then(response => {
                return response.json()
            }).then(data => {
                store.cachedToken = data.token
                resolve(data.token)
            }).catch(error => {
                reject(error)
            })
		}
	})
}

/**
 * Fetch a user based on username, requires token
 *
 * @param  {String} username
 * @return {Promise} a promise containing the user data
 */
store.fetchUser = (username) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {
            fetch(config.ip + username, {
                method: 'post',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    'token': token
                })
            }).then(response => {
                resolve(response.json())
            }).catch(error => {
                console.log('error')
                reject(error)
            })
		})
	})
}


/**
 * @return {Promise}, containg friends[]
 */
store.fetchFriends = () => {
	return new Promise((resolve, reject) => {
        if (!store.username) return

		store.fetchToken().then( token => {
            fetch(config.ip + "getFriends", {
                method: 'post',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    'username': store.username,
                    'token': token
                })
            }).then(response => {
                resolve(response.json())
            }).catch(error => {
                console.log(error)
            })
		})
	})
}

/**
 * @param  {username}
 * @param  {listname}
 * @return {Promise}, containing a list
 */
store.fetchList = (username, listname) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {
            fetch(config.ip + username + "/" + listname, {
                method: 'post',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    'token': token
                })
            }).then(response => {
                resolve(response.json())
            }).catch(error => {
                console.log(error)
            })
		})
	})
}

/**
 * @param  {username}
 * @param  {list}
 * @return {Promise}, a confirmation message
 */
store.deleteList = (username, list) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {
            fetch(config.ip + "deleteList", {
                method: 'post',
                headers: {
                    'content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({
                    'username': username,
                    'token': token,
                    'listname': list.listname
                })
            }).then(response => {
                return response.json()
            }).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
            })
		})
	})
}

/**
 * @param  {username}
 * @param  {list_data}
 * @return {Promise}, a confirmation message
 */
store.saveList = (username, list_data) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {
            fetch(config.ip + "savelist", {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    'username': username,
                    'token': token,
                    'list_data': list_data
                })
            }).then(response => {
                return response.json()
            }).then(response => {
                resolve(response)
            }).catch(error => {
                console.log(error)
            })
		})
	})
}
/**
 * @param  {username}
 * @param  {friendname}
 * @return {Promise}, a confirmation message
 */
store.friendRequest = (username, friendname) => {
	return new Promise((resolve, reject) => {
        fetch(config.ip + "friendRequest", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'username': username,
                'friendname': friendname
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            resolve(data)
        }).catch(error => {
            console.log(error)
        })
	})
}

store.validateCaptcha = url => {
    return new Promise((resolve, reject) => {
        fetch(config.ip + 'validateCaptcha', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'url': url
            })
        }).then(response => {
            return response.json()
        }).then(data => {
            resolve(data.response)
        }).catch(error => {
            console.log(error)
        })
    })
}
