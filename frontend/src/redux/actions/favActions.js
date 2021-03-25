import client from "../../utlis/client"
import {
	LOADING_FAV_ANIMES,
	LOADING_FAV_CHARACTERS,
	PENDING_FAV_ANIME_FINISHED,
	PENDING_FAV_ANIME_STARTED,
	PENDING_FAV_CHARACTER_FINISHED,
	PENDING_FAV_CHARACTER_STARTED,
	SET_FAV_ANIMES,
	SET_FAV_CHARACTERS,
	SHOW_MESSAGE,
} from "../types"

export const getFavAnimes = () => {
	return async dispatch => {
		dispatch(startLoadingFavAnimes())

		const { data, message, ok } = await client("/user/favorite_animes")
		if (ok) {
			dispatch({ type: SET_FAV_ANIMES, payload: data })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: ok },
			})
		}
		dispatch(finishLoadingFavAnimes())
	}
}

export const getFavCharacters = () => {
	return async dispatch => {
		dispatch(startLoadingFavCharacters())
		const { data, message, ok } = await client("/user/favorite_characters")
		if (ok) {
			dispatch({ type: SET_FAV_CHARACTERS, payload: data })
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: ok },
			})
		}
		dispatch(finishLoadingFavCharacters())
	}
}

export const addToFavAnimes = (anime_id, cover_image, title) => {
	return async dispatch => {
		dispatch(startLoadingFavAnimes())
		const res = await client("/user/favorite_animes", "POST", {
			anime_id,
			cover_image,
			title,
		})
		const { message } = await res.json()
		dispatch(finishLoadingFavAnimes())

		if (res.ok) return dispatch(getFavAnimes())

		dispatch({
			type: SHOW_MESSAGE,
			payload: { text: message, isSuccess: res.ok },
		})
	}
}
export const addToFavCharacters = characterData => {
	return async dispatch => {
		dispatch(startLoadingFavCharacters())
		const { character_id, cover_image, name } = characterData
		const res = await client("/user/favorite_characters", "POST", {
			character_id,
			cover_image: cover_image,
			name,
			created_at: Math.floor(Date.now() / 1000),
		})
		const { message } = await res.json()

		dispatch(finishLoadingFavCharacters())

		if (res.ok) return dispatch(getFavCharacters())
		dispatch({
			type: SHOW_MESSAGE,
			payload: { text: message, isSuccess: res.ok },
		})
	}
}
export const removeFavAnime = anime_id => {
	return async dispatch => {
		dispatch(startPendingFavAnime(anime_id))
		const res = await client(`/user/favorite_animes/${anime_id}`, "DELETE")
		const { message } = await res.json()
		if (res.ok) {
			dispatch(getFavAnimes())
		} else {
			dispatch(finishPendingFavAnime(anime_id))
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
	}
}

export const removeFavCharacter = character_id => {
	return async dispatch => {
		dispatch(startPendingFavCharacter(character_id))
		const res = await client(
			`/user/favorite_characters/${character_id}`,
			"DELETE"
		)
		const { message } = await res.json()
		if (res.ok) {
			dispatch(getFavCharacters())
		} else {
			dispatch(finishPendingFavCharacter(character_id))
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
	}
}

const startPendingFavAnime = anime_id => ({
	type: PENDING_FAV_ANIME_STARTED,
	payload: { anime_id, boolean: true },
})
const finishPendingFavAnime = anime_id => ({
	type: PENDING_FAV_ANIME_FINISHED,
	payload: { anime_id, boolean: false },
})
const startPendingFavCharacter = character_id => ({
	type: PENDING_FAV_CHARACTER_STARTED,
	payload: character_id,
})
const finishPendingFavCharacter = character_id => ({
	type: PENDING_FAV_CHARACTER_FINISHED,
	payload: character_id,
})

const startLoadingFavAnimes = () => ({
	type: LOADING_FAV_ANIMES,
	payload: true,
})
const finishLoadingFavAnimes = () => ({
	type: LOADING_FAV_ANIMES,
	payload: false,
})
const startLoadingFavCharacters = () => ({
	type: LOADING_FAV_CHARACTERS,
	payload: true,
})
const finishLoadingFavCharacters = () => ({
	type: LOADING_FAV_CHARACTERS,
	payload: false,
})
