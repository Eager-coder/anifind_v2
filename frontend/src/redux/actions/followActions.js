import client from "../../utlis/client"
import {
	LOADING_FOLLOWERS,
	LOADING_FOLLOWINGS,
	SET_FOLLOWERS,
	SET_FOLLOWINGS,
} from "../types"
import { showMessage } from "./appActions"

export const followUser = following_id => {
	return async dispatch => {
		dispatch(startLoadingFollowings())
		const res = await client("/user/follow/" + following_id, "POST")
		const { message } = await res.json()
		if (res.ok) {
			dispatch(getFollowings())
		}
		if (message) {
			dispatch(showMessage(message, res.ok))
		}
	}
}

export const getFollowings = () => {
	return async dispatch => {
		dispatch(startLoadingFollowings())
		const res = await client("/user/follow/following")
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch(setFollowings(data))
		}
		if (message) {
			dispatch(showMessage(message, res.ok))
		}
		dispatch(finishLoadingFollowings())
	}
}
export const getFollowers = () => {
	return async dispatch => {
		dispatch(startLoadingFollowers())
		const res = await client("/user/follow/followers")
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch(setFollowers(data))
		}
		if (!res.ok && message) {
			dispatch(showMessage(message, res.ok))
		}
		dispatch(finishLoadingFollowers())
	}
}
export const unfollowUser = following_id => {
	return async dispatch => {
		dispatch(startLoadingFollowers())
		const res = await client("/follow/" + following_id, "DELETE")
		const { message } = await res.json()
		if (res.ok) {
			dispatch(finishLoadingFollowers())
		}
		if (message) {
			dispatch(showMessage(message, res.ok))
		}
	}
}

const startLoadingFollowers = () => ({
	type: LOADING_FOLLOWERS,
	payload: true,
})
const finishLoadingFollowers = () => ({
	type: LOADING_FOLLOWERS,
	payload: false,
})
const startLoadingFollowings = () => ({
	type: LOADING_FOLLOWINGS,
	payload: true,
})
const finishLoadingFollowings = () => ({
	type: LOADING_FOLLOWINGS,
	payload: false,
})
const setFollowings = followers => ({
	type: SET_FOLLOWINGS,
	payload: followers,
})
const setFollowers = followers => ({
	type: SET_FOLLOWERS,
	payload: followers,
})
