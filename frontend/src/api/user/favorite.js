import { api_url } from "../../utlis/constants"

const options = (method = "GET", body) => {
	return {
		method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify(body) || null,
		credentials: "include",
	}
}

export const addToFavorites = async (user_id, page_id, cover_image, title) => {
	try {
		const res = await fetch(`${api_url}/api/user/favorites`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
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

export const getFavorites = async () => {
	try {
		const res = await fetch(`${api_url}/api/user/favorites/`, options())
		const { data } = await res.json()
		if (res.ok) {
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
			`${api_url}/api/user/favorites/${page_id}`,
			options("DELETE")
		)
		const json = await res.json()

		return json
	} catch (e) {
		return { message: e }
	}
}
