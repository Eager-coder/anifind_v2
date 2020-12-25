import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { getUserComments } from "../../api/user/comment"
import { formatRelative } from "date-fns"
const CommentsContainer = styled.section`
	width: 100%;
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
	.comment-box {
		border-radius: 4px;
		padding: 15px;
		margin: 10px 0;
		color: ${({ theme }) => theme.text};
		background: ${({ theme }) => theme.commentBg};

		p.comment {
			color: ${({ theme }) => theme.header};
			margin-bottom: 15px;
			font-size: 1rem;
		}
		.meta {
			display: flex;
			justify-content: space-between;
			font-size: 0.9rem;
		}
		img {
			width: 20px;
			margin-left: 20px;
		}
	}
`
export default function Profile({ user, setUser }) {
	useEffect(() => {
		if (!user.comments?.length) {
			getUserComments().then(comments => setUser({ ...user, comments }))
		}
	}, [])
	return (
		<CommentsContainer>
			<h1>All comments</h1>
			<div>
				{user?.comments?.map((item, index) => (
					<div key={index} className="comment-box">
						<p className="comment">{item.text}</p>
						<div className="meta">
							<span>
								Commented on <Link to={`/anime/${item.page_id}`}>Anime</Link>
							</span>
							<span className="date">
								{formatRelative(new Date(item.created_at * 1000), new Date())}
							</span>
						</div>
					</div>
				))}
			</div>
		</CommentsContainer>
	)
}
