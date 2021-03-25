import { store } from "../index"
import { setToken } from "../redux/actions/authActions"
export const base_url =
	process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000/api"

const client = (url, method = "GET", body = null) => {
	return new Promise(async (resolve, reject) => {
		const accessToken = store.getState().user.accessToken
		const res1 = await customFetch({ url, method, body, accessToken })
		console.log(res1.status, url)
		if (res1.status !== 401) {
			resolve(res1)
			return
		}
		const refreshRes = await customFetch({
			url: "/user/auth/refresh_token",
			method: "POST",
		})
		if (refreshRes.ok) {
			store.dispatch(setToken(refreshRes.data.accessToken))
			const res2 = await customFetch({ url, method, body, accessToken })
			resolve(res2)
			return
		} else {
			reject({ message: "Not authenticated", ok: false })
			return
		}
	})
}
export const customFetch = async ({
	url,
	method = "GET",
	body = null,
	accessToken,
}) => {
	console.log(url, method)
	const res = await fetch(base_url + url, {
		method,
		body: body && JSON.stringify(body),
		credentials: "include",
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
	const json = await res.json()
	return {
		ok: res.ok,
		status: res.status,
		data: json.data,
		message: json.message,
	}
}
export default client
