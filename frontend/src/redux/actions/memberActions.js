import client from "../../utlis/client"
import {
	DELETE_MEMBER_DATA,
	LOADING_MEMBER_DATA,
	SET_MEMBER_DATA,
	SHOW_MESSAGE,
} from "../types"

export const fetchMember = username => {
	return async dispatch => {
		dispatch({ type: LOADING_MEMBER_DATA, payload: true })
		const res = await client(`/member/${username}`)
		const { message, data } = await res.json()
		if (res.ok) {
			dispatch({ type: SET_MEMBER_DATA, payload: data })
		}
		if (!res.ok) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { isSuccess: res.ok, text: message },
			})
		}
		dispatch({ type: LOADING_MEMBER_DATA, payload: false })
	}
}

export const removeMember = () => {
	return { type: DELETE_MEMBER_DATA }
}
