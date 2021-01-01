import { api_url, options } from "../../utlis/constants"

export const addToFavorites = async (page_id, cover_image, title) => {
	const res = await fetch(
		`${api_url}/api/user/favorites`,
		options("POST", {
			page_id,
			cover_image,
			title,
		})
	)
	const { message } = await res.json()
	return { message, isSuccess: res.ok }
}

export const getFavorites = async () => {
	try {
		const res = await fetch(`${api_url}/api/user/favorites/`, options())
		const { data } = await res.json()
		return { data, isSuccess: res.ok }
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
