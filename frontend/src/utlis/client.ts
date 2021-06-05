export const base_url = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:80/api"

export type ClientType = {
	ok: boolean
	message: string
	data?: object | Array<any> | any
	status?: number
}
export type Method = "GET" | "POST" | "PUT" | "DELETE"
const customFetch = (url: string, method: Method = "GET", body?: object): Promise<ClientType> => {
	return new Promise(async (resolve, _reject) => {
		const accessToken = localStorage.getItem("accessToken") || ""
		try {
			const response1 = await fetchWrapper(url, method, body, accessToken)
			if (response1.status !== 401) {
				return resolve(response1)
			}
			if (!accessToken) {
				return resolve({ message: "Please log in to continue", ok: false })
			}
			const authResponse: any = await fetchWrapper("/user/auth/refresh_token", "POST")
			if (authResponse.ok) {
				localStorage.setItem("accessToken", authResponse.data.accessToken)
				const response2 = await fetchWrapper(url, method, body, authResponse.data.accessToken)
				resolve(response2)
			} else {
				resolve({ message: "Please log in to continue", ok: false })
			}
		} catch (error) {
			resolve({ message: "Something went wrong", ok: false })
		}
	})
}
export const fetchWrapper = async (
	url: string,
	method: string = "GET",
	body?: object,
	accessToken?: string
): Promise<ClientType> => {
	try {
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
	} catch (error) {
		console.log(error)
		return { ok: false, ...error }
	}
}
export default customFetch
