import { useEffect, useState } from "react"
import styled from "styled-components"
import { formatDistanceToNow, isAfter } from "date-fns"
import { PrimaryBtn, RedBtn, GreenBtn } from "../ButtonStyles"
import { useDispatch, useSelector } from "react-redux"
import {
	editComment,
	getComments,
	postComment,
} from "../../redux/actions/commentActions"
import LoadingSpinner from "../LoadingSpinner"
import { showModal } from "../../redux/actions/appActions"
import { DELETE_COMMENT } from "../../redux/types"
import { Link } from "react-router-dom"
import {
	fetchAnimeComments,
	syncUserPageComments,
} from "../../redux/actions/pageActions"
export default function Comments({ anime_id }) {
	const allComments = useSelector(state => state.currentPage.comments.data)
	// const [allComments, setAllComments] = useState(null)
	const user = useSelector(state => state.user)
	const { isSending, isLoading } = useSelector(state => state.comments)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(fetchAnimeComments(anime_id))
	}, [])

	const [text, setText] = useState("")
	const handleSubmit = async e => {
		e.preventDefault()
		if (user && text.trim()) {
			dispatch(postComment(text, anime_id)).then(() => {
				setText("")
			})
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
				<PrimaryBtn
					type="submit"
					disabled={isSending}
					style={{ fontSize: "1.2rem", padding: "5px 10px" }}>
					Send
				</PrimaryBtn>
			</CommentForm>
			<div className="all-comments">
				{isLoading ? <LoadingSpinner /> : null}
				{allComments &&
					allComments.map(item => (
						<Comment
							key={item.comment_id}
							item={item}
							user_id={user.user_id}
							allComments={allComments}
							anime_id={anime_id}
						/>
					))}
			</div>
		</Container>
	)
}

const Comment = ({ item, user_id }) => {
	// const [comment, setComment] = useState(item)
	const dispatch = useDispatch()
	const [newComment, setNewComment] = useState(item.text)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const link =
		item.user_id === user_id ? "/me/profile" : `/user/${item.username}`
	useEffect(() => {
		if (isEditOpen && !userComment.pending) {
			setIsEditOpen(false)
		}
	}, [item])
	const userComments = useSelector(state => state.comments.list)
	const userComment = useSelector(state =>
		state.comments.list.filter(item => {
			if (item.user_id == user_id) return item
		})
	)[0]

	useEffect(() => {
		if (userComment?.user_id == item.user_id) console.log(userComment)
	}, [userComments])

	return (
		<CommentBox>
			<div className="top-bar">
				<div className="comment-data">
					<Link to={link} className="user-data">
						<img src={item.avatar} alt="" />
						<span className="username">{item.username}</span>
					</Link>
					<span className="date">
						{formatDistanceToNow(new Date(item.created_at * 1000))} ago{" "}
						{item.is_edited && "(edited)"}
					</span>
				</div>
				{user_id == item.user_id && (
					<div className="actions">
						{isEditOpen ? (
							<>
								<GreenBtn
									className="cancel"
									onClick={() => setIsEditOpen(false)}
									disabled={userComment.pending}>
									Cancel
								</GreenBtn>
								<PrimaryBtn
									className="submit"
									style={{ marginLeft: "15px" }}
									onClick={() => {
										dispatch(editComment(newComment, item)).then(() =>
											setIsEditOpen(false)
										)
									}}
									disabled={userComment.pending}>
									Submit
								</PrimaryBtn>
							</>
						) : (
							<>
								<GreenBtn
									className="edit"
									onClick={() => setIsEditOpen(true)}
									disabled={userComment.pending}>
									Edit
								</GreenBtn>
								<RedBtn
									className="delete"
									style={{ marginLeft: "15px" }}
									onClick={() => dispatch(showModal(DELETE_COMMENT, item))}
									disabled={userComment.pending}>
									Delete
								</RedBtn>
							</>
						)}
					</div>
				)}
			</div>
			{isEditOpen ? (
				<textarea
					name="newComment"
					defaultValue={newComment}
					onChange={e => setNewComment(e.target.value)}></textarea>
			) : (
				<p className="comment">{item.text}</p>
			)}
		</CommentBox>
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
	@media (max-width: 768px) {
		padding: 0 20px;
		h2 {
			font-size: 2rem;
		}
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
	@media (max-width: 768px) {
		textarea {
			font-size: 1rem;
		}
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
	.comment-data {
		width: 100%;
		display: flex;
		align-items: center;
		.user-data {
			display: flex;
			align-items: center;
		}
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
	.actions {
		display: flex;
		align-items: center;
	}
	p {
		margin-top: 15px;
	}
	textarea {
		margin: 5px 0;
		padding: 5px;
		width: 100%;
		font-size: 1rem;
		height: auto;
		border-radius: 4px;
		border: none;
	}
`
