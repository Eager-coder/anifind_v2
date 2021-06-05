import { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import styled from "styled-components"
import { AppContext } from "../../context/AppContext"
import { UserContext } from "../../context/UserContext"
import { PrimaryBtn, SecondaryBtn } from "../styles/ButtonStyles"
import UserLink from "../UserLink"
export type CommentType = {
	user_id: number
	comment_id: number
	username: string
	avatar: string
	created_at: number
	is_edited: boolean
	text: string
}
type CommentProps = {
	comment: CommentType
	getComments: () => Promise<void>
}
const Comment: FC<CommentProps> = ({ comment, getComments }) => {
	const [newComment, setNewComment] = useState(comment.text)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [pending, setPending] = useState(false)
	const { user_id } = useContext(UserContext).user
	const { showModal, client } = useContext(AppContext)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (isEditOpen && !pending) {
			setIsEditOpen(false)
		}
	}, [comment])
	useLayoutEffect(() => {
		if (textareaRef.current != null) {
			const scrollHeight = textareaRef.current.scrollHeight
			textareaRef.current.style.height = scrollHeight + "px"
			if (isEditOpen) {
				textareaRef.current.selectionStart = textareaRef.current.value.length
				textareaRef.current.selectionEnd = textareaRef.current.value.length
				textareaRef.current.focus()
			}
		}
	}, [textareaRef.current, isEditOpen])
	const handleEditSubmit = async () => {
		setPending(true)
		const { ok } = await client(`/comments/anime/${comment.comment_id}`, {
			method: "PUT",
			body: { newComment },
			shouldShowMessage: "default",
		})
		if (ok) {
			await getComments()
		}

		setIsEditOpen(false)
		setPending(false)
	}
	const handleEditOpen = () => {
		setIsEditOpen(true)
	}
	return (
		<CommentBox>
			<div className="top-bar">
				<UserLink
					username={comment.username}
					avatar_url={comment.avatar}
					date={comment.created_at}
					isEdited={comment.is_edited}
				/>
				{user_id == comment.user_id && (
					<div className="actions">
						{isEditOpen ? (
							<>
								<SecondaryBtn
									size="small"
									color="red"
									onClick={() => setIsEditOpen(false)}
									disabled={pending}>
									Cancel
								</SecondaryBtn>
								<PrimaryBtn
									customStyle="margin-left: 10px;"
									size="small"
									onClick={handleEditSubmit}
									disabled={pending}>
									Submit
								</PrimaryBtn>
							</>
						) : (
							<>
								<SecondaryBtn size="small" onClick={handleEditOpen} disabled={pending}>
									Edit
								</SecondaryBtn>
								<SecondaryBtn
									color="red"
									size="small"
									customStyle="margin-left: 10px;"
									onClick={() =>
										showModal("DELETE_COMMENT", { getComments, comment, type: "anime" })
									}
									disabled={pending}>
									Delete
								</SecondaryBtn>
							</>
						)}
					</div>
				)}
			</div>
			{isEditOpen ? (
				<textarea
					ref={textareaRef}
					name="newComment"
					defaultValue={newComment}
					onChange={e => setNewComment(e.target.value)}></textarea>
			) : (
				<p className="comment">{comment.text}</p>
			)}
		</CommentBox>
	)
}
export default Comment

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
		white-space: pre-line;
	}
	textarea {
		margin: 5px 0;
		padding: 5px;
		width: 100%;
		font-size: 1rem;
		height: unset;
		border-radius: 4px;
		border: none;
	}
	@media (max-width: 768px) {
		p,
		textarea {
			font-size: 0.9rem;
		}
	}
`
