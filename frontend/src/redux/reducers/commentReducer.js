import {
	LOADING_COMMENTS,
	SET_COMMENTS,
	PENDING_COMMENT,
	SENDING_COMMENT,
} from "../types"

const initialState = {
	list: [],
	isLoading: false,
	isSending: false,
}

export const commentReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOADING_COMMENTS:
			return { ...state, isLoading: action.payload }

		case SET_COMMENTS:
			return { ...state, list: action.payload }

		case PENDING_COMMENT:
			const { comment_id, pending } = action.payload
			return {
				...state,
				list: state.list.map(item => ({
					...item,
					pending: item.comment_id == comment_id ? pending : item.pending,
				})),
			}
		case SENDING_COMMENT:
			return {
				...state,
				isSending: action.payload,
			}
		default:
			return state
	}
}
