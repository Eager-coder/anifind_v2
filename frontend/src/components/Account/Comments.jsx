import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styled, { css } from "styled-components"
import { formatRelative } from "date-fns"
import Modal from "../../components/Modal"
import { PrimaryBtn, GreenBtn, RedBtn } from "../ButtonStyles"
import EmptyState from "../EmptyState"
import { useDispatch, useSelector } from "react-redux"
import {
	deleteComment,
	getComments,
	editComment,
} from "../../redux/actions/commentActions"
import LoadingSpinner from "../LoadingSpinner"

export default function Comments() {
	const dispatch = useDispatch()

	const { list: comments, isLoading } = useSelector(state => state.comments)

	useEffect(() => {
		if (!comments) {
			dispatch(getComments())
		}
	}, [])

	return (
		<CommentsContainer>
			<h1>All comments</h1>
			{isLoading ? (
				<LoadingSpinner size={50} padding={100} />
			) : comments?.length ? (
				comments.map(item => <Comment key={item.comment_id} item={item} />)
			) : (
				<EmptyState
					src="/assets/images/empty_comments.png"
					header="You have no comments"
				/>
			)}
		</CommentsContainer>
	)
}

const Comment = ({ item }) => {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [editedComment, setEditedComment] = useState(item.text)
	const dispatch = useDispatch()

	useEffect(() => {
		if (!item.pending) {
			setIsEditOpen(false)
			setIsDeleteOpen(false)
		}
	}, [item.pending])

	return (
		<CommentBox>
			<p className="comment">{item.text}</p>
			<div className="meta">
				<span>
					Commented on <Link to={`/anime/${item.anime_id}`}>Anime</Link>
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
						<GreenBtn
							onClick={() => setIsDeleteOpen(false)}
							className="cancel"
							disabled={item.pending}>
							Cancel
						</GreenBtn>
						<PrimaryBtn
							onClick={() => dispatch(deleteComment(item))}
							// className="submit"
							isLoading={item.pending}
							disabled={item.pending}
							spinnerSize={8}
							customStyle={PrimaryBtnStyle}>
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
							disabled={item.pending}
							onClick={() => {
								setIsEditOpen(false)
								setEditedComment(item.text)
							}}>
							Cancel
						</GreenBtn>
						<PrimaryBtn
							// className="submit"
							disabled={item.pending}
							isLoading={item.pending}
							onClick={() => dispatch(editComment(editedComment, item))}
							customStyle={PrimaryBtnStyle}>
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
const PrimaryBtnStyle = css`
	width: max-content;
	height: max-content;
	padding: 5px;
`
