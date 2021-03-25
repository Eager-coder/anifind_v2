import client from "../../utlis/client"
import {
	LOADING_PAGE_COMMENTS,
	REMOVE_CURRENT_PAGE,
	SET_PAGE_COMMENTS,
	SET_PAGE_TYPE,
} from "../types"

export const fetchAnimeComments = anime_id => {
	return async dispatch => {
		try {
			dispatch({ type: LOADING_PAGE_COMMENTS, payload: true })
			const { data, message, ok } = await client(
				`/comments/?anime_id=${anime_id}`
			)
			if (ok && data?.length) {
				dispatch({ type: SET_PAGE_COMMENTS, payload: data })
			}
			dispatch({ type: LOADING_PAGE_COMMENTS, payload: false })
		} catch (error) {
			console.log(error)
		}
	}
}

export const setCurrentPageType = pageType => {
	return { type: SET_PAGE_TYPE, payload: pageType }
}

export const removeCurrentPageType = pageType => {
	return { type: REMOVE_CURRENT_PAGE, payload: pageType }
}
