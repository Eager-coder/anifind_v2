import { LOADING_POSTS, LOADING_THREAD, SET_POSTS, SET_THREAD } from "../types"

const initialState = {
	thread: {
		title: null,
		body: null,
		numLikes: null,
		isLoading: false,
	},
	posts: {
		list: null,
		isLoading: false,
	},
}

export const discussionReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_THREAD: {
			const { topic, body, numLikes } = action.payload
			console.log(action.payload)
			return { ...state, thread: { topic, body, numLikes, isLoading: false } }
		}
		case LOADING_THREAD:
			return {
				...state,
				thread: { ...state.thread, isLoading: action.payload },
			}
		case SET_POSTS:
			return { ...state, posts: { list: action.payload, isLoading: false } }
		case LOADING_POSTS:
			return { ...state, posts: { ...state.posts, isLoading: action.payload } }
		default:
			return state
	}
}
