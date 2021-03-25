import client from "../../utlis/client"
import { LOADING_POSTS, LOADING_THREAD, SET_POSTS, SET_THREAD } from "../types"
export const fetchDiscussion = thread_id => {
	return async dispatch => {
		dispatch(startLoadingThread())
		dispatch(startLoadingPosts())
		const res = await client(`/discussions/${thread_id}`)
		const { thread, posts } = (await res.json()).data
		if (res.ok) {
			dispatch(setThread(thread))
			dispatch(setPosts(posts))
		}
		dispatch(finishLoadingThread())
		dispatch(finishLoadingPosts())
	}
}

const startLoadingThread = () => ({
	type: LOADING_THREAD,
	payload: true,
})
const finishLoadingThread = () => ({
	type: LOADING_THREAD,
	payload: false,
})
const startLoadingPosts = () => ({
	type: LOADING_POSTS,
	payload: true,
})
const finishLoadingPosts = () => ({
	type: LOADING_POSTS,
	payload: false,
})

const setThread = thread => ({
	type: SET_THREAD,
	payload: thread,
})

const setPosts = posts => ({
	type: SET_POSTS,
	payload: posts,
})
