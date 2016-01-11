import EventEmitter from 'events'

const store = new EventEmitter()

export default store

/**
 * Fetch a list based on username and listname
 * 
 * @param {String} username 
 * @param {String} listname
 * @return list data
 */
store.fetchList = (username, listname) => {
	return {
		list: username + "/" + listname
	}
}