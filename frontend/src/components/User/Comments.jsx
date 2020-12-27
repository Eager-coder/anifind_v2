import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { getUserComments } from "../../api/user/comment"
import { formatRelative } from "date-fns"
import Modal from "../../components/Modal"
import { deleteComment } from "../../api/user/comment"
const CommentsContainer = styled.section`
	width: 100%;
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
`
export default function Comments({ user, setUser }) {
	useEffect(() => {
		if (!user.comments?.length) {
			getUserComments().then(comments => {
				setUser({ ...user, comments })
				console.log(comments)
			})
		}
	}, [])
	return (
		<CommentsContainer>
			<h1>All comments</h1>
			<div>
				{user?.comments?.map(item => (
					<Comment
						key={item.comment_id}
						item={item}
						user={user}
						setUser={setUser}
					/>
				))}
			</div>
		</CommentsContainer>
	)
}
const CommentBox = styled.div`
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
`
const Comment = ({ item, user, setUser }) => {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const deleteHandler = async comment_id => {
		const { message, isSuccess } = await deleteComment(comment_id)
		if (isSuccess) {
			setIsDeleteOpen(false)
			const newCommentList = user.comments.filter(
				comment => comment.comment_id != comment_id
			)
			setUser({ ...user, comments: newCommentList })
		}
	}

	const editHandler = async => {}
	return (
		<CommentBox>
			<p className="comment">{item.text}</p>
			<div className="meta">
				<span>
					Commented on <Link to={`/anime/${item.page_id}`}>Anime</Link>
				</span>
				<span className="date">
					{formatRelative(new Date(item.created_at * 1000), new Date())}
				</span>
			</div>
			<button onClick={() => setIsEditOpen(true)}>Edit</button>
			<button onClick={() => setIsDeleteOpen(true)}>Delete</button>
			{isDeleteOpen && (
				<Modal>
					<h2>Delete comment</h2>
					<p>
						Are you sure you want to delete the comment? <br />
						<p>{item.text}</p>
					</p>
					<div className="buttons">
						<button onClick={() => setIsDeleteOpen(false)} className="cancel">
							Cancel
						</button>
						<button
							onClick={() => deleteHandler(item.comment_id)}
							className="submit">
							Delete
						</button>
					</div>
				</Modal>
			)}
			{isEditOpen && (
				<Modal>
					<h2>Edit comment</h2>
					<textarea
						name="text"
						id=""
						cols="30"
						rows="10"
						defaultValue={item.text}></textarea>
					<div className="buttons">
						<button onClick={() => setIsEditOpen(false)} className="cancel">
							Cancel
						</button>
						<button
							onClick={() => editHandler(item.comment_id)}
							className="submit">
							Submit
						</button>
					</div>
				</Modal>
			)}
		</CommentBox>
	)
}
