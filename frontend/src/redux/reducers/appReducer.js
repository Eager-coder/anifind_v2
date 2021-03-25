import { SHOW_MESSAGE, HIDE_MESSAGE, SHOW_MODAL, HIDE_MODAL } from "../types"
const initialModal = {
	isOpen: false,
	type: null,
}
const initialState = {
	loading: false,
	message: {
		text: null,
		isSuccess: false,
	},
	modal: initialModal,
}

export const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case SHOW_MESSAGE:
			const { text, isSuccess } = action.payload
			return {
				...state,
				message: { text, isSuccess },
			}
		case HIDE_MESSAGE:
			return { ...state, message: { text: null, isSuccess: null } }
		case SHOW_MODAL:
			return {
				...state,
				modal: {
					isOpen: true,
					type: action.payload.modalType,
					props: action.payload.props,
				},
			}
		case HIDE_MODAL:
			return { ...state, modal: initialModal }
		default:
			return state
	}
}
