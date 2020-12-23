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
	},
	url = "http://localhost:80"

export const changePassword = async (email, password) => {}

export const uploadAvatar = async image => {
	const res = await fetch(`${url}/api/user/avatar`, options("POST", image))
	const { avatar, message, token } = await res.json()
	if (res.ok) {
		localStorage.setItem("auth", token)
		return { avatar, message }
	}
	return { message }
}
