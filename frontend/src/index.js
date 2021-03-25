import React from "react"
import { render } from "react-dom"
import { createStore, applyMiddleware, compose } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"

import { Provider } from "react-redux"
import thunk from "redux-thunk"
import { rootReducer } from "./redux/rootReducer"

import App from "./App"

export const store = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
)

render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
)
