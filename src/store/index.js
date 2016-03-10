import globals from '../globals'

var store = {}

const config = {
    ip: 'https://api.woording.com/',
	devMode: false // automatically log 'cor' in
}

export default store

store.username = ''
store.password = ''
store.keepLoggedIn = false
store.cachedToken = null
store.deletedList = null
store.called = false

/**
 * Fetch a token based on username and listname
 * used internally
 * will try to use cachedToken first, otherwise request a new one from the server
 *
 * @return {Promise} token
 */
store.fetchToken = (keepLoggedIn) => {
	return new Promise((resolve, reject) => {
        store.keepLoggedIn = keepLoggedIn
        // Token fetch functions
        if (globals.getCookie('logvalue') && !store.username){
            store.retrieveSession(globals.getCookie('logvalue')) .then(response => {
                store.username = response.username
                store.cachedToken = response.token
            }).then(response => {
                let selector = (Math.random()*1e128).toString(36)
                if (store.called) {
                    resolve(store.cachedToken)
                    return
                }
                store.called = true
                store.removeSession().then(response => {
                    store.storeSession(store.username, store.cachedToken, selector).then(response => {
                    })
                })
                resolve(store.cachedToken)
            }).catch(error => {

            })
        }

        if (store.cachedToken != null) {
            resolve(store.cachedToken)
        } else {
            if(!store.username){
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
                if (store.keepLoggedIn){
                    let selector = (Math.random()*1e128).toString(36)
                    store.storeSession(store.username, data.token, selector).then(response => {
                        console.log(response)
                    })
                }
                console.log(data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        }
	})
}

store.storeSession = (username, token, selector) => {
    return new Promise((resolve, reject) => {
        if(!store.username){
            return
        } else {
            fetch(config.ip + 'storeSession', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    'username': username,
                    'token': token,
                    'selector': selector
                })
            }).then(response => {
                return response.json()
            }).then(response => {
                if(!response.success){
                    throw new Error(response.error)
                }
                document.cookie = 'logvalue='+selector
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        }
    })
}

store.retrieveSession = selector => {
    return new Promise((resolve, reject) => {
        fetch(config.ip + 'retrieveSession', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'selector': selector
            })
        }).then(response => {
            return response.json()
        }).then(response => {
            resolve(response)
        })
    })
}

store.removeSession = () => {
    return new Promise((resolve, reject) => {
        fetch(config.ip + 'removeSession', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'selector': globals.getCookie('logvalue')
            })
        }).then(response => {
            return response.json()
        }).then(response => {
            document.cookie = "logvalue ="
            resolve(response)
        })
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
                reject(error)
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
                reject(error)
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
                reject(error)
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
                reject(error)
            })
		})
	})
}


store.register = (username, password, email) => {
    return new Promise((resolve, reject) => {
        fetch(config.ip + "register", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                'username': username,
                'password': password,
                'email': email
            })
        }).then(response => {
            return response.json()
        }).then(response => {
            resolve(response)
        }).catch(error => {
            console.log(error)
            reject(error)
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
            reject(error)
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
            reject(error)
        })
    })
}
