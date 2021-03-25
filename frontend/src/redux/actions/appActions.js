import {
	HIDE_MODAL,
	SHOW_MODAL,
	CHANGE_USERNAME_MODAL,
	SHOW_MESSAGE,
} from "../types"

export const hideModal = () => {
	return {
		type: HIDE_MODAL,
	}
}

export const showModal = (modalType, props) => {
	return {
		type: SHOW_MODAL,
		payload: { modalType, props },
	}
}

export const showMessage = (text, isSuccess) => {
	return {
		type: SHOW_MESSAGE,
		payload: { text, isSuccess },
	}
}
