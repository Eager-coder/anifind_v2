const options = (method, body) => {
		return {
			method,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: localStorage.getItem("auth"),
			},
			body: JSON.stringify(body) || null,
		}
	},
	url = "http://localhost:80"

export const tokenHandler = async () => {
	const res = await fetch(`${url}/api/auth/`, options("GET"))
	if (res.ok) {
		const { data } = await res.json()
		return data
	}
	return null
}

export const loginHandler = async form => {
	const res = await fetch(`${url}/api/auth/login`, options("POST", form))
	const { message, data, token } = await res.json()

	if (res.ok) {
		localStorage.setItem("auth", token)
		return { data, message }
	}
	return { message }
}

export const registerHandler = async form => {
	const res = await fetch(`${url}/api/auth/register`, options("POST", form))
	console.log(res)
	const { message, data, token } = await res.json()

	if (res.ok) {
		localStorage.setItem("auth", token)
		return { data, message }
	}
	return { message }
}
