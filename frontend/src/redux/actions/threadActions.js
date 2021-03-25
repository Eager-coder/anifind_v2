import client from "../../utlis/client"
import { showMessage } from "./appActions"

export const createThread = ({ topic, body }) => {
	return async dispatch => {
		const { ok, message } = await client("/discussions/thread", "POST", {
			topic,
			body,
		})
		if (message) {
			dispatch(showMessage(message, ok))
		}
		return ok
	}
}
