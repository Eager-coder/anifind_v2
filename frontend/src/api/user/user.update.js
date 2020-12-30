import { api_url, options } from "../../utlis/constants"

export const changeUsername = async newUsername => {
	const res = await fetch(
		"/api/user/update/username",
		options("PUT", { newUsername })
	)
	const { data, message } = await res.json()
	return { data, message, isSuccess: res.ok }
}

export const changeEmail = async newEmail => {
	const res = await fetch(
		"/api/user/update/email",
		options("PUT", { newEmail })
	)
	const { data, message } = await res.json()
	return { data, message, isSuccess: res.ok }
}

export const changePassword = async (oldPassword, newPassword) => {
	const res = await fetch(
		"/api/user/update/password",
		options("PUT", { oldPassword, newPassword })
	)
	const { message } = await res.json()
	return { message, isSuccess: res.ok }
}

export const uploadAvatar = async image => {
	const res = await fetch(`${api_url}/api/user/avatar`, options("POST", image))
	const { avatar, message, token } = await res.json()
	if (res.ok) {
		return { avatar, message }
	}
	return { message }
}

export const updateAbout = async newAbout => {
	const res = await fetch(
		"/api/user/profile/about",
		options("PUT", { newAbout })
	)
	const { data, message } = await res.json()
	return { data, message, isSuccess: res.ok }
}
