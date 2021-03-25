import {
	REMOVE_CURRENT_PAGE,
	SET_PAGE_COMMENTS,
	LOADING_PAGE_COMMENTS,
	SET_PAGE_TYPE,
} from "../types"

const initialStore = {
	type: null,
	comments: {
		isLoading: false,
		data: null,
	},
}

export const pageReducer = (state = initialStore, action) => {
	switch (action.type) {
		case LOADING_PAGE_COMMENTS:
			return {
				...state,
				comments: { ...state.comments, isLoading: action.payload },
			}

		case SET_PAGE_COMMENTS:
			return {
				...state,
				comments: { ...state.comments, data: action.payload },
			}
		case SET_PAGE_TYPE:
			return { ...state, type: action.payload }
		case REMOVE_CURRENT_PAGE:
			return initialStore
		default:
			return state
	}
}
