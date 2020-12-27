import { api_url, options } from "../../utlis/constants"

export const getProfile = async () => {
	const res = await fetch(`${api_url}/api/user/profile`, options())
	const { data } = await res.json()
	return data
}
