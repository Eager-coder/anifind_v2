import {
	SET_USER,
	SHOW_MESSAGE,
	CHANGE_EMAIL,
	CHANGE_USERNAME,
	LOADING_USER,
	REMOVE_USER,
	SET_ACCESS_TOKEN,
} from "../types"
import { base_url, customFetch } from "../../utlis/client"

import client from "../../utlis/client"
import { hideModal } from "./appActions"

export const login = (email, password) => {
	return async dispatch => {
		dispatch(startLoading())

		const res = await fetch(base_url + "/user/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
		const { data, message } = await res.json()

		if (res.ok) {
			dispatch(setToken(data.accessToken))
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch(finishLoading())
		return res.ok
	}
}
export const register = form => {
	return async dispatch => {
		dispatch(startLoading())
		const res = await client("/user/auth/register", "POST", form)
		const { message, data } = await res.json()
		if (res.ok) {
			dispatch({ type: SET_USER, payload: data })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch(finishLoading())
	}
}

export const logout = () => {
	return async dispatch => {
		await client("/user/auth/logout", "DELETE")
		dispatch({ type: REMOVE_USER })
	}
}

export const changeEmail = newEmail => {
	return async dispatch => {
		dispatch({ type: LOADING_USER, payload: true })
		const res = await client("/user/update/email", "PUT", { data: newEmail })
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch({ type: CHANGE_EMAIL, payload: data })
			dispatch(hideModal())
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch({ type: LOADING_USER, payload: false })
	}
}
export const changeUsername = newUsername => {
	return async dispatch => {
		dispatch({ type: LOADING_USER, payload: true })
		const res = await client("/user/update/username", "PUT", {
			data: newUsername,
		})
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch({ type: CHANGE_USERNAME, payload: data })
			dispatch(hideModal())
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch({ type: LOADING_USER, payload: false })
	}
}
export const changePassword = (oldPassword, newPassword, newPassword2) => {
	return async dispatch => {
		if (newPassword !== newPassword2)
			return dispatch({
				type: SHOW_MESSAGE,
				payload: { text: "Passwords do not match", isSuccess: false },
			})
		dispatch({ type: LOADING_USER, payload: true })
		const res = await client("/user/update/password", "PUT", {
			data: { oldPassword, newPassword },
		})
		const { message } = await res.json()
		if (res.ok) {
			dispatch(hideModal())
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch({ type: LOADING_USER, payload: false })
	}
}

export const requestAccessToken = () => {
	return async dispatch => {
		const { ok, data } = await customFetch({
			url: "/user/auth/refresh_token",
			method: "POST",
		})
		if (ok) {
			dispatch(setToken(data.accessToken))
			return true
		}
		return false
	}
}

export const setToken = accessToken => ({
	type: SET_ACCESS_TOKEN,
	payload: accessToken,
})

const startLoading = () => ({
	type: LOADING_USER,
	payload: true,
})

const finishLoading = () => ({
	type: LOADING_USER,
	payload: false,
})
