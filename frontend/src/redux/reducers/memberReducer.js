import {
	DELETE_MEMBER_DATA,
	LOADING_MEMBER_DATA,
	SET_MEMBER_DATA,
} from "../types"

const initialState = {
	info: null,
	isLoading: false,
}

export const memberReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MEMBER_DATA:
			return { ...state, info: action.payload }
		case LOADING_MEMBER_DATA:
			return { ...state, isLoading: action.payload }
		case DELETE_MEMBER_DATA:
			return initialState
		default:
			return state
	}
}
