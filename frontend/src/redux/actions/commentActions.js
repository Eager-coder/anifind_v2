import { store } from "../.."
import client from "../../utlis/client"
import {
	LOADING_COMMENTS,
	SET_COMMENTS,
	SHOW_MESSAGE,
	PENDING_COMMENT,
	SENDING_COMMENT,
} from "../types"
import { fetchAnimeComments } from "./pageActions"
import { hideModal } from "./appActions"

export const getComments = () => {
	return async dispatch => {
		dispatch(startLoadingComments())
		const res = await client("/user/comments")
		const { data, message } = await res.json()
		if (res.ok) {
			dispatch({
				type: SET_COMMENTS,
				payload: data.map(item => ({
					...item,
					pending: false,
				})),
			})
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch(finishLoadingComments())
	}
}
export const postComment = (comment, anime_id) => {
	const pageType = store.getState().currentPage.type

	return async dispatch => {
		dispatch(startSendingComment())
		const res = await client("/user/comments", "POST", { comment, anime_id })
		const { message } = await res.json()
		if (res.ok) {
			dispatch(getComments())
			if (pageType === "ANIME") dispatch(fetchAnimeComments(anime_id))
		}
		if (message) {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: message, isSuccess: res.ok },
			})
		}
		dispatch(finishSendingComment())
	}
}
export const deleteComment = comment => {
	const { comment_id, anime_id } = comment
	const comments = store.getState().currentPage.comments.data

	return async dispatch => {
		dispatch(startPendingComment(comment_id))
		const res = await client(`/user/comments/${comment_id}`, "DELETE")
		const { message } = await res.json()

		if (res.ok) {
			dispatch(getComments())
			if (comments) dispatch(fetchAnimeComments(anime_id))
		}
		dispatch(finishPendingComment(comment_id))
		dispatch({
			type: SHOW_MESSAGE,
			payload: { text: message, isSuccess: res.ok },
		})
		dispatch(hideModal())
	}
}

export const editComment = (newComment, item) => {
	const comments = store.getState().currentPage.comments.data

	const { comment_id, anime_id } = item
	return async dispatch => {
		dispatch(startPendingComment(comment_id))

		const res = await client(`/user/comments`, "PUT", {
			newComment,
			comment_id,
		})
		const { message } = await res.json()
		if (res.ok) {
			dispatch(getComments())
			if (comments) dispatch(fetchAnimeComments(anime_id))
		}
		dispatch(finishPendingComment(comment_id))

		dispatch({
			type: SHOW_MESSAGE,
			payload: { text: message, isSuccess: res.ok },
		})
	}
}

const startPendingComment = comment_id => ({
	type: PENDING_COMMENT,
	payload: { comment_id, pending: true },
})

const finishPendingComment = comment_id => ({
	type: PENDING_COMMENT,
	payload: { comment_id, pending: false },
})

const startLoadingComments = () => ({ type: LOADING_COMMENTS, payload: true })
const finishLoadingComments = () => ({ type: LOADING_COMMENTS, payload: false })

const startSendingComment = () => ({ type: SENDING_COMMENT, payload: true })
const finishSendingComment = () => ({ type: SENDING_COMMENT, payload: false })
