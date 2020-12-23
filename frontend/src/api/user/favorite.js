const options = (method = "GET", body = null) => {
		return {
			method,
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: localStorage.getItem("auth"),
			},
			body: JSON.stringify({ data: body }) || null,
		}
	},
	url = "http://localhost:80"

export const addToFavorites = async (user_id, page_id, cover_image, title) => {
	try {
		const res = await fetch(`${url}/api/user/favorites/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: localStorage.getItem("auth"),
			},
			body: JSON.stringify({
				page_id,
				cover_image,
				title,
			}),
		})
		const { message, data } = await res.json()
		return { message, data }
	} catch (e) {
		return { message: e.message }
	}
}

export const getFavorites = async user_id => {
	try {
		const res = await fetch(`${url}/api/user/favorites/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: localStorage.getItem("auth"),
			},
		})
		if (res.ok) {
			const { data } = await res.json()
			return data
		}
		return null
	} catch (e) {
		return null
	}
}

export const removeFavorite = async page_id => {
	try {
		const res = await fetch(
			`${url}/api/user/favorites/${page_id}`,
			options("DELETE")
		)
		const json = await res.json()

		return json
	} catch (e) {
		return { message: e }
	}
}
