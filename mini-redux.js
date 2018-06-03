/*
 * @Author: cewei
 * @Date:   2018-06-03 14:27:26
 * @Last Modified by:   cewei
 * @Last Modified time: 2018-06-03 15:21:30
 */

function createStore(reducer, applyMiddleware) {
	if (enhancer) {
		return applyMiddleware(createStore)(reducer)
	}
	let currentState = {}
	let currentListeners = []

	function getState() {
		return currentState
	}

	function dispatch(action) {
		currentState = reducer(action)
		currentListeners.forEach(cur => {
			cur()
		})
		return action
	}

	function subscribe(listener) {
		currentListeners.push(listener)
	}

	dispatch({
		type: '@#mini-redux/initial'
	})
	return {
		getState,
		dispatch,
		subscribe
	}
}

function applyMiddleware(...MiddleWares) {
	return (createStore) => (...args) => {
		const store = createStore(...args)
		let dispatch = store.dispatch

		const midApi = {
			getState: store.getState,
			dispatch: (...args) => dispatch(...args)
		}

		// dispatch = middleware(midApi)(store.dispatch)
		const middlewareChain = MiddleWares.map(cur => cur(midApi))
		dispatch = compose(...middlewareChain)(store.dispatch)
		return {
			...store,
			dispatch
		}
	}
}

function compose(...funcs) {
	if (funcs.length === 0) {
		return f => f
	}

	if (funcs.length === 1) {
		return funcs[0]
	}

	return funcs.reduce((res, cur) => {
		return (...args) => res(cur(...args))
	})
}

export default {
	createStore,
	compose,
	applyMiddleware
}