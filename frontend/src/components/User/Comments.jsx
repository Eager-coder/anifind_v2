import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { getUserComments } from "../../api/user/comment"
import { formatRelative } from "date-fns"
import Modal from "../../components/Modal"
import { deleteComment, updateComment } from "../../api/user/comment"
import { PrimaryBtn, GreenBtn, RedBtn } from "../ButtonStyles"
import EmptyState from "../EmptyState"
export default function Comments({ user, setUser }) {
	useEffect(() => {
		getUserComments().then(comments => setUser({ ...user, comments }))
	}, [])
	return (
		<CommentsContainer>
			<h1>All comments</h1>
			<div>
				{user?.comments?.length ? (
					user.comments.map(item => (
						<Comment
							key={item.comment_id}
							item={item}
							user={user}
							setUser={setUser}
						/>
					))
				) : (
					<EmptyState
						src="/assets/images/empty_comments.png"
						header="You have no comments"
					/>
				)}
			</div>
		</CommentsContainer>
	)
}

const Comment = ({ item, user, setUser }) => {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [editedComment, setEditedComment] = useState(item.text)

	const deleteHandler = async comment_id => {
		const { isSuccess } = await deleteComment(comment_id)
		if (isSuccess) {
			setIsDeleteOpen(false)
			getUserComments().then(comments => setUser({ ...user, comments }))
		}
	}

	const editHandler = async comment_id => {
		if (editedComment != item.text || !editedComment) {
			const { isSuccess } = await updateComment(editedComment, comment_id)
			if (isSuccess) {
				setIsEditOpen(false)
				getUserComments().then(comments => setUser({ ...user, comments }))
			}
		}
	}
	return (
		<CommentBox>
			<p className="comment">{item.text}</p>
			<div className="meta">
				<span>
					Commented on <Link to={`/anime/${item.page_id}`}>Anime</Link>
				</span>
				<span className="date">
					{formatRelative(new Date(item.created_at * 1000), new Date())}{" "}
					{item.is_edited && "(edited)"}
				</span>
			</div>
			<GreenBtn
				className="edit"
				style={{ marginRight: "15px" }}
				onClick={() => setIsEditOpen(true)}>
				Edit
			</GreenBtn>
			<RedBtn className="delete" onClick={() => setIsDeleteOpen(true)}>
				Delete
			</RedBtn>
			{isDeleteOpen && (
				<Modal>
					<h2>Delete comment</h2>
					<p>
						Are you sure you want to delete the comment? <br />
						<span>{item.text}</span>
					</p>
					<div className="buttons">
						<GreenBtn onClick={() => setIsDeleteOpen(false)} className="cancel">
							Cancel
						</GreenBtn>
						<PrimaryBtn
							onClick={() => deleteHandler(item.comment_id)}
							className="submit">
							Delete
						</PrimaryBtn>
					</div>
				</Modal>
			)}
			{isEditOpen && (
				<Modal>
					<h2>Edit comment</h2>
					<textarea
						style={{ height: "100px", padding: "5px" }}
						defaultValue={editedComment}
						onChange={e => setEditedComment(e.target.value)}></textarea>
					<div className="buttons">
						<GreenBtn
							className="cancel"
							onClick={() => {
								setIsEditOpen(false)
								setEditedComment(item.text)
							}}>
							Cancel
						</GreenBtn>
						<PrimaryBtn
							className="submit"
							onClick={() => editHandler(item.comment_id)}>
							Submit
						</PrimaryBtn>
					</div>
				</Modal>
			)}
		</CommentBox>
	)
}

const CommentsContainer = styled.section`
	width: 100%;
`
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
