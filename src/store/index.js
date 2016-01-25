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
			// Create a request, setup the corerct method and URL
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + "authenticate"

			// Add the completion handler for the async network call
			request.onload = function() {
                if(this.status == 200){
                    const parsedResponse = JSON.parse(request.response)
                    store.cachedToken = parsedResponse.token
                    resolve(parsedResponse.token)
                } else {
                    reject("ERROR")
                }
			}

			// Open the request, set the correct content type
			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			// Add the username and password parameters to the data
			request.send('{"username": "' + store.username + '", "password" : "' + store.password + '" }')
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
			// Create a request, setup the corerct method and URL
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + username

			// Add the completion handler for the async network call
			request.onload = function() {
				const parsedResponse = JSON.parse(request.response)
				resolve(parsedResponse)
			}

			// Open the request, set the correct content type
			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")


			// Add the username and token to the data
			request.send('{ "token" : "' + token + '" }')
		})
	})
}


/**
 * @return {Promise}, containg friends[]
 */
store.fetchFriends = () => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {

			// Create a request, setup the corerct method and URL
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + "getFriends"

			// Add the completion handler for the async network call
			request.onload = function() {
				const parsedResponse = JSON.parse(request.response)
				resolve(parsedResponse.friends)
			}

			// Open the request, set the correct content type
			request.open('POST', url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")


			// Add the username and token to the data
			request.send('{ "username": "' + store.username +
						'", "token" : "' + token + '" }')
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

			// Create a request, setup the corerct method and URL
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + username + "/" + listname

			// Add the completion handler for the async network call
			request.onload = function() {
				const parsedResponse = JSON.parse(request.response)
				resolve(parsedResponse)
			}

			// Open the request, set the correct content type
			request.open('POST', url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			// Add the username and token to the data
			request.send('{ "token" : "' + token + '" }')
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

			//create request
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + "deleteList"

			// magic
			request.onload = function() {
				const parsedResponse = request.response
				resolve(parsedResponse)
			}

			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			// Send request
			request.send('{ "username" : "' + username +
						'", "token" : "' + token +
						'", "listname" : "' + list.listname + '" }')
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

            console.log(list_data)
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = config.ip + "savelist"

			request.onload = function() {
				const parsedResponse = request.response
				resolve(parsedResponse)
			}

			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			request.send('{ "username" : "' + username +
						'", "token" : "' + token +
						'", "list_data" : ' + JSON.stringify(list_data) + ' }')
		})
	})
}

store.friendRequest = (username, friendname) => {
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest()
		var method = "POST"
		var url = config.ip + "friendRequest"

		request.onload = function() {
			const parsedResponse = request.response
			resolve(parsedResponse)
		}

		request.open(method, url, true)
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

		request.send('{ "username" : "' + username +
					'", "friendname" : "' + friendname + '" }')
	})
}
