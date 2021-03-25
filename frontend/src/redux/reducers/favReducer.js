import {
	LOADING_FAV_ANIMES,
	PENDING_FAV_ANIME_STARTED,
	PENDING_FAV_ANIME_FINISHED,
	PENDING_FAV_CHARACTER_STARTED,
	PENDING_FAV_CHARACTER_FINISHED,
	SET_FAV_ANIMES,
	SET_FAV_CHARACTERS,
	LOADING_FAV_CHARACTERS,
} from "../types"

const initialState = {
	anime: {
		isLoading: false,
		list: null,
	},
	characters: {
		isLoading: false,
		list: null,
	},
}
export const favReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOADING_FAV_ANIMES:
			return {
				...state,
				anime: {
					...state.anime,
					isLoading: action.payload,
				},
			}
		case LOADING_FAV_CHARACTERS:
			return {
				...state,
				characters: {
					...state.characters,
					isLoading: action.payload,
				},
			}
		case SET_FAV_ANIMES:
			return {
				...state,
				anime: {
					list: action.payload.map(item => ({ ...item, pending: false })),
					isLoading: false,
				},
			}
		case SET_FAV_CHARACTERS:
			return {
				...state,
				characters: {
					list: action.payload.map(item => ({ ...item, pending: false })),
					isLoading: false,
				},
			}
		case PENDING_FAV_ANIME_STARTED:
		case PENDING_FAV_ANIME_FINISHED:
			const { anime_id, boolean } = action.payload
			return {
				...state,
				anime: {
					...state.anime,
					list: state.anime.list.map(item => ({
						...item,
						pending: item.anime_id == anime_id ? boolean : item.pending,
					})),
				},
			}

		case PENDING_FAV_CHARACTER_STARTED:
		case PENDING_FAV_CHARACTER_FINISHED: {
			const { character_id, boolean } = action.payload
			return {
				...state,
				characters: {
					...state.characters,
					list: state.characters.list.map(item => ({
						...item,
						pending: item.character_id == character_id ? boolean : item.pending,
					})),
				},
			}
		}

		default:
			return state
	}
}
