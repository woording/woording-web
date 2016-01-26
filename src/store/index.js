import globals from '../globals'

var store = {}
const config = {
	ip: 'http://api.woording.com/'
}
export default store

store.loggedIn = true
store.username = ''
store.password = ''
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
                method: 'post',
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
                resolve(response)
            }).catch(error => {
                console.log('error')
            })
		})
	})
}

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
            resolve(response)
        }).catch(error => {
            console.log(error)
        })
	})
}
