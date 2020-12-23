import { api_url } from "../../utlis/constants"

const options = (method = "GET", body = null) => {
	return {
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: localStorage.getItem("auth"),
		},
		body: JSON.stringify({ data: body }),
	}
}

export const changePassword = async (email, password) => {}

export const uploadAvatar = async image => {
	const res = await fetch(`${api_url}/api/user/avatar`, options("POST", image))
	const { avatar, message, token } = await res.json()
	if (res.ok) {
		localStorage.setItem("auth", token)
		return { avatar, message }
	}
	return { message }
}
