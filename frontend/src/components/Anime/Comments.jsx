import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { getComments, postComment, deleteComment } from "../../api/user/comment"
import UserContext from "../../UserContext"
import { formatDistanceToNow } from "date-fns"

export default function Comments({ page_id }) {
	const [allComments, setAllComments] = useState(null)
	const [text, setText] = useState("")
	const { user } = useContext(UserContext)

	useEffect(() => {
		getComments(page_id).then(data => setAllComments(data))
	}, [])

	const handleSubmit = async e => {
		e.preventDefault()
		if (user && text.trim()) {
			postComment(text, page_id).then(data => {
				setText("")
				setAllComments(data)
			})
		}
	}
	const handleDelete = async comment_id => {
		const { message, isSuccess } = await deleteComment(comment_id)
		console.log(message)
		if (isSuccess) {
			const newCommentList = allComments.filter(
				comment => comment.comment_id != comment_id
			)
			setAllComments(newCommentList)
		}
	}
	return (
		<Container>
			<h2>Comments</h2>
			<CommentForm onSubmit={handleSubmit}>
				<textarea
					name="comment"
					onChange={e => setText(e.target.value)}
					value={text}
					placeholder="Add your comment"></textarea>
				<br />
				<button type="submit">Send</button>
			</CommentForm>
			<div className="all-comments">
				{allComments &&
					allComments.map((item, index) => (
						<CommentBox key={index}>
							<div className="top-bar">
								<div className="user-data">
									<img src={item.avatar} alt="" />
									<span className="username">{item.username}</span>
									<span className="date">
										{formatDistanceToNow(new Date(item.created_at * 1000))} ago
									</span>
								</div>
								{user?.user_id == item.user_id && (
									<div className="actions">
										<button
											className="delete"
											onClick={() => handleDelete(item.comment_id)}>
											Delete
										</button>
									</div>
								)}
							</div>

							<p className="comment">{item.text}</p>
						</CommentBox>
					))}
			</div>
		</Container>
	)
}

const Container = styled.section`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	h2 {
		font-size: 2.5rem;
	}
	.all-comments {
		margin-top: 20px;
	}
`
const CommentForm = styled.form`
	textarea {
		width: 100%;
		height: 100px;
		font-size: 1.2rem;
		border-radius: 4px;
		border: none;
		padding: 10px;
		margin-bottom: 10px;
	}
	button {
		cursor: pointer;
		padding: 5px 10px;
		background: #70c7a7;
		font-size: 1.2rem;
		border-radius: 4px;
		border: none;
	}
`

const CommentBox = styled.div`
	border-radius: 4px;
	padding: 15px;
	margin: 10px 0;
	background: ${({ theme }) => theme.commentBg};
	.top-bar {
		display: flex;
		justify-content: space-between;
	}
	.user-data {
		width: 100%;
		display: flex;
		align-items: center;
		img {
			width: 30px;
			height: 30px;
			object-fit: cover;
			margin-right: 10px;
			border-radius: 4px;
		}
		.username {
			color: #70c7a7;
		}
		.date {
			font-size: 0.85rem;
			margin-left: 20px;
			color: grey;
		}
	}
	p {
		margin-top: 15px;
	}
`
