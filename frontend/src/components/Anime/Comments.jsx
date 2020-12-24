import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { getComments, postComment } from "../../api/user/comment"
import UserContext from "../../UserContext"
import { formatDistanceToNow } from "date-fns"

export default function Comments({ page_id }) {
	const [allComments, setAllComments] = useState(null)
	const [text, setText] = useState("")
	const { user } = useContext(UserContext)

	useEffect(() => {
		getComments(page_id).then(data => {
			setAllComments(data)
		})
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

	return (
		<Container>
			<h2>Comments</h2>
			<form onSubmit={handleSubmit}>
				<textarea
					name="comment"
					onChange={e => setText(e.target.value)}
					value={text}
					placeholder="Add your comment"></textarea>
				<br />
				<button type="submit">Send</button>
			</form>
			<div className="all-comments">
				{allComments &&
					allComments.map((item, index) => (
						<div key={index} className="comment-box">
							<div className="user-data">
								<img src={item.avatar} alt="" />
								<span className="username">{item.username}</span>
								<span className="date">
									{formatDistanceToNow(new Date(item.created_at * 1000))} ago
								</span>
							</div>
							<p className="comment">{item.text}</p>
						</div>
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
	.all-comments {
		margin-top: 20px;
	}
	.comment-box {
		border-radius: 4px;
		padding: 15px;
		margin: 10px 0;
		color: ${({ theme }) => theme.text};
		background: ${({ theme }) => theme.commentBg};
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
				margin-left: auto;
			}
		}
		p {
			margin-top: 15px;
		}
	}
`
