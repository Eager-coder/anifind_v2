import { api_url, options } from "../../utlis/constants"

export const tokenHandler = async () => {
	const res = await fetch(`${api_url}/api/auth/`, options())
	if (res.ok) {
		const { data } = await res.json()
		return data
	}
	return null
}

export const loginHandler = async form => {
	const res = await fetch(`${api_url}/api/auth/login`, options("POST", form))
	const { message, data } = await res.json()

	return { data, message, isSuccess: res.ok }
}

export const registerHandler = async form => {
	const res = await fetch(`${api_url}/api/auth/register`, options("POST", form))
	console.log(res)
	const { message, data } = await res.json()

	return { data, message, isSuccess: res.ok }
}

export const logout = async () => {
	const res = await fetch(`${api_url}/api/auth/logout`, options("DELETE"))
	const { message } = res.json()
	return { message, isSuccess: res.ok }
}
