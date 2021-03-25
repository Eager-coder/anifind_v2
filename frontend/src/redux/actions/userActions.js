import client from "../../utlis/client"
import {
	SET_PROFILE,
	LOADING_PROFILE,
	SHOW_MESSAGE,
	UPLOAD_AVATAR,
	UPDATE_ABOUT,
	LOADING_USER,
	SET_USER,
} from "../types"

export const getUser = () => {
	return async dispatch => {
		dispatch({ type: LOADING_USER, payload: true })
		const { data, message, ok } = await client("/user/profile", "GET")
		// const { data, message } = await res.json()
		if (ok) {
			dispatch({ type: SET_USER, payload: data })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: ok },
			})
		}
		dispatch({ type: LOADING_USER, payload: false })
	}
}

export const uploadAvatar = image => {
	return async dispatch => {
		dispatch({ type: LOADING_PROFILE, payload: true })
		const res = await client("/user/profile/avatar", "PUT", { data: image })
		const { avatar, message } = await res.json()
		if (res.ok) {
			dispatch({ type: UPLOAD_AVATAR, payload: avatar })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}

		dispatch({ type: LOADING_PROFILE, payload: false })
	}
}
export const updateAbout = newAbout => {
	return async dispatch => {
		dispatch({ type: LOADING_PROFILE, payload: true })
		const res = await client("/user/profile/about", "PUT", { data: newAbout })
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch({ type: UPDATE_ABOUT, payload: data })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}

		dispatch({ type: LOADING_PROFILE, payload: false })
	}
}
