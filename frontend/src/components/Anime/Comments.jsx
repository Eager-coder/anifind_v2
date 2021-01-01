import { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import {
	getComments,
	postComment,
	deleteComment,
	updateComment,
} from "../../api/user/comment"
import UserContext from "../../UserContext"
import { formatDistanceToNow } from "date-fns"
import Modal from "../Modal"
import { PrimaryBtn, RedBtn, GreenBtn } from "../ButtonStyles"

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
	// const handleDelete = async comment_id => {
	// 	const { message, isSuccess } = await deleteComment(comment_id)
	// 	console.log(message)
	// 	if (isSuccess) {
	// 		const newCommentList = allComments.filter(
	// 			comment => comment.comment_id != comment_id
	// 		)
	// 		setAllComments(newCommentList)
	// 	}
	// }
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
					style={{ fontSize: "1.2rem", padding: "5px 10px" }}>
					Send
				</PrimaryBtn>
			</CommentForm>
			<div className="all-comments">
				{allComments &&
					allComments.map(item => (
						<Comment
							key={item.comment_id}
							item={item}
							user={user}
							allComments={allComments}
							setAllComments={setAllComments}
							page_id={page_id}
						/>
					))}
			</div>
		</Container>
	)
}

const Comment = ({ item, user, setAllComments, page_id }) => {
	const [newComment, setNewComment] = useState(item.text)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDelete = async comment_id => {
		setLoading(true)
		const { isSuccess } = await deleteComment(comment_id)
		if (isSuccess) {
			getComments(page_id).then(data => setAllComments(data))
			setIsDeleteOpen(false)
			setLoading(false)
		}
	}

	const hanldeEdit = async comment_id => {
		if (!newComment || newComment != item.text) {
			setLoading(true)
			const { isSuccess } = await updateComment(newComment, comment_id)
			if (isSuccess) {
				getComments(page_id).then(data => setAllComments(data))
				setIsEditOpen(false)
				setLoading(false)
			}
		}
	}

	return (
		<CommentBox>
			<div className="top-bar">
				<div className="user-data">
					<img src={item.avatar} alt="" />
					<span className="username">{item.username}</span>
					<span className="date">
						{formatDistanceToNow(new Date(item.created_at * 1000))} ago{" "}
						{item.is_edited && "(edited)"}
					</span>
				</div>
				{user?.user_id == item.user_id && (
					<div className="actions">
						{isEditOpen ? (
							<>
								<GreenBtn
									className="cancel"
									onClick={() => setIsEditOpen(false)}
									disabled={loading}>
									Cancel
								</GreenBtn>
								<PrimaryBtn
									className="submit"
									style={{ marginLeft: "15px" }}
									onClick={() => hanldeEdit(item.comment_id)}
									disabled={loading}>
									Submit
								</PrimaryBtn>
							</>
						) : (
							<>
								<GreenBtn
									className="edit"
									onClick={() => setIsEditOpen(true)}
									disabled={loading}>
									Edit
								</GreenBtn>
								<RedBtn
									className="delete"
									style={{ marginLeft: "15px" }}
									onClick={() => setIsDeleteOpen(true)}
									disabled={loading}>
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
			{isDeleteOpen && (
				<Modal>
					<h2>Delete comment</h2>
					<p>
						Are you sure you want to delete the comment? <br />
						<span>{item.text}</span>
					</p>
					<div className="buttons">
						<GreenBtn
							onClick={() => setIsDeleteOpen(false)}
							className="cancel"
							disabled={loading}>
							Cancel
						</GreenBtn>
						<PrimaryBtn
							onClick={() => handleDelete(item.comment_id)}
							className="submit"
							disabled={loading}>
							Delete
						</PrimaryBtn>
					</div>
				</Modal>
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
