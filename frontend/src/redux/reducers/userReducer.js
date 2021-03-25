import {
	CHANGE_EMAIL,
	CHANGE_USERNAME,
	LOADING_USER,
	SET_ACCESS_TOKEN,
	SET_USER,
	UPLOAD_AVATAR,
} from "../types"

const initialState = {
	isLoggedIn: false,
	isLoading: false,
	username: null,
	email: null,
	created_at: null,
	accessToken: null,
	avatar: {
		url: null,
		isLoading: false,
	},
	about: {
		text: null,
		isLoading: false,
	},
}

export const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_ACCESS_TOKEN:
			return { ...state, accessToken: action.payload, isLoggedIn: true }

		case LOADING_USER:
			return { ...state, isLoading: action.payload }

		case SET_USER: {
			const {
				user_id,
				username,
				email,
				avatar,
				created_at,
				about,
			} = action.payload
			return {
				...state,
				user_id,
				username,
				email,
				created_at,
				avatar: { url: avatar, isLoading: false },
				about: { text: about, isLoading: false },
			}
		}

		case CHANGE_EMAIL:
			return { ...state, email: action.payload }

		case UPLOAD_AVATAR:
			return { ...state, avatar: action.payload }

		case CHANGE_USERNAME:
			return { ...state, username: action.payload }

		default:
			return state
	}
}
