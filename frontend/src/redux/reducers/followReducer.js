import {
	LOADING_FOLLOWERS,
	LOADING_FOLLOWINGS,
	SET_FOLLOWERS,
	SET_FOLLOWINGS,
} from "../types"

const initialState = {
	followers: {
		list: null,
		isLoading: false,
	},
	followings: {
		list: null,
		isLoading: false,
	},
}

export const followReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_FOLLOWERS:
			return {
				...state,
				followers: { ...state.followers, list: action.payload },
			}
		case SET_FOLLOWINGS:
			return {
				...state,
				followings: { ...state.followings, list: action.payload },
			}
		case LOADING_FOLLOWERS:
			return {
				...state,
				followers: { ...state.followers, isLoading: action.payload },
			}
		case LOADING_FOLLOWINGS:
			return {
				...state,
				followings: { ...state.followings, isLoading: action.payload },
			}
		default:
			return state
	}
}
