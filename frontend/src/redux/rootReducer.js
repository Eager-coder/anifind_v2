import { combineReducers } from "redux"
import { userReducer } from "./reducers/userReducer"
import { appReducer } from "./reducers/appReducer"
// import { profileReducer } from "./reducers/profileReducer"
import { commentReducer } from "./reducers/commentReducer"
import { favReducer } from "./reducers/favReducer"
import { pageReducer } from "./reducers/pageReducer"
import { memberReducer } from "./reducers/memberReducer"
import { REMOVE_USER } from "./types"
import { followReducer } from "./reducers/followReducer"
import { discussionReducer } from "./reducers/discussionReducer"

export const mainReducer = combineReducers({
	user: userReducer,
	// profile: profileReducer,
	app: appReducer,
	comments: commentReducer,
	favorites: favReducer,
	currentPage: pageReducer,
	member: memberReducer,
	follow: followReducer,
	discussions: discussionReducer,
})

export const rootReducer = (state, action) => {
	if (action.type === REMOVE_USER) state = undefined
	return mainReducer(state, action)
}
