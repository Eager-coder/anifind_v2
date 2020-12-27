import { api_url, options } from "../../utlis/constants"

const getComments = async page_id => {
	const res = await fetch(`${api_url}/api/comments/?page_id=${page_id}`)
	const { data } = await res.json()
	return data
}

const getUserComments = async () => {
	const res = await fetch(`${api_url}/api/user/comments`, options())
	const { data } = await res.json()
	return data
}
const postComment = async (comment, page_id) => {
	const res = await fetch(
		`${api_url}/api/user/comments`,
		options("POST", { comment, page_id })
	)
	const { data } = await res.json()
	return data
}

const deleteComment = async comment_id => {
	const res = await fetch(
		`${api_url}/api/user/comments/${comment_id}`,
		options("DELETE")
	)
	const { message } = await res.json()

	return { message, isSuccess: res.ok }
}

export { getComments, postComment, getUserComments, deleteComment }
