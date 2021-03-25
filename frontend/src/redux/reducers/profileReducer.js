// Depercated
import { SET_PROFILE, LOADING_PROFILE, UPDATE_ABOUT } from "../types"

const initialState = {
	isLoading: false,
}

export const profileReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_PROFILE:
			return { ...action.payload, isLoading: false }
		case LOADING_PROFILE:
			return { ...state, isLoading: action.payload }
		case UPDATE_ABOUT:
			return { ...state, about: action.payload }
		default:
			return state
	}
}
