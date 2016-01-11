import EventEmitter from 'events'

const store = new EventEmitter()

export default store

/**
 * @param  {String} listname
 * @return list data
 */
store.fetchList = listname => {
	return {
		message: "Test list"
	}
}