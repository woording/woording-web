
var store = {}
export default store

store.username = "cor"
store.password = "Hunter2"
store.cachedToken = null

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
			var url = "http://api.woording.com/authenticate"

			// Add the completion handler for the async network call
			request.onload = function() {
				const parsedResponse = JSON.parse(request.response)
				store.cachedToken = parsedResponse.token
				resolve(parsedResponse.token)
			}

			// Open the request, set the correct content type
			request.open('POST', url, true)
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
			var url = "http://api.woording.com/" + username

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
 * @return {Promise}, containg friends[]
 */
store.fetchFriends = () => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {

			// Create a request, setup the corerct method and URL
			var request = new XMLHttpRequest()
			var method = "POST"
			var url = "http://api.woording.com/getFriends"

			// Add the completion handler for the async network call
			request.onload = function() {
				const parsedResponse = JSON.parse(request.response)
				resolve(parsedResponse.friends)
			}

			// Open the request, set the correct content type
			request.open('POST', url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")


			// Add the username and token to the data
			request.send('{ "username": "' + store.username + '", "token" : "' + token + '" }')
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
			var url = "http://api.woording.com/" + username + "/" + listname

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

store.deleteList = (username, list) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {

			var request = new XMLHttpRequest()
			var method = "POST"
			var url = "http://api.woording.com/deleteList"

			request.onload = function() {
				const parsedResponse = request.response
				resolve(parsedResponse)
			}

			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			request.send('{ "username" : "' + username + '", "token" : "' + token + '", "listname" : "' + list.listname + '" }')
		})
	})
}

store.saveList = (username, list_data) => {
	return new Promise((resolve, reject) => {
		store.fetchToken().then( token => {

			var request = new XMLHttpRequest()
			var method = "POST"
			var url = "http://api.woording.com/savelist"

			request.onload = function() {
				const parsedResponse = request.response
				resolve(parsedResponse)
			}

			request.open(method, url, true)
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

			console.log(username)
			console.log(token)
			console.log(list_data)
			request.send('{ "username" : "' + username + '", "token" : "' + token + '", "list_data" : ' + JSON.stringify(list_data) + ' }')
		})
	})
}