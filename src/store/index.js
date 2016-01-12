import EventEmitter from 'events'

const store = new EventEmitter()

export default store

store.username = "cor"
store.password = "Hunter2"

/**
 * Fetch a token based on username and listname
 * used internally
 * 
 * @return {Promise} token
 */
store.fetchToken = () => {
	return new Promise((resolve, reject) => {

		// Create a request, setup the corerct method and URL
		var request = new XMLHttpRequest()
		var method = "POST"
		var url = "http://api.woording.com/authenticate"

		// Add the completion handler for the async network call
		request.onload = function() {
			const parsedResponse = JSON.parse(request.response)
			resolve(parsedResponse.token)
		}

		// Open the request, set the correct content type
		request.open('POST', url, true)
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

		// Add the username and password parameters to the data
		request.send('{"username": "' + store.username + '", "password" : "' + store.password + '" }')
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
