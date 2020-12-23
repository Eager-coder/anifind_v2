import { api_url } from "../../utlis/constants"

const getComments = async page_id => {
	const res = await fetch(`${api_url}/api/user/comment/?page_id=${page_id}`)
	const { data } = await res.json()
	return data
}

const postComment = async (comment, page_id) => {
	const res = await fetch(`${api_url}/api/user/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			Authorization: localStorage.getItem("auth"),
		},
		body: JSON.stringify({
			comment,
			page_id,
		}),
	})
	const { data } = await res.json()
	return data
}

export { getComments, postComment }
