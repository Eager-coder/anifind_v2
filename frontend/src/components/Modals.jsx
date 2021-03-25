import { useState } from "react"
import { PrimaryBtn, GreenBtn } from "./ButtonStyles"
import styled, { css } from "styled-components"
import { useDispatch, useSelector } from "react-redux"
import {
	changeUsername,
	changeEmail,
	changePassword,
} from "../redux/actions/authActions"
import { HIDE_MODAL } from "../redux/types"
import { hideModal } from "../redux/actions/appActions"
import { deleteComment } from "../redux/actions/commentActions"
const PrimaryBtnStyle = css`
	padding: 5px;
	/* font-size: 1rem; */
`
export const ChangeUsernameModal = () => {
	const [newUsername, setNewUsername] = useState("")
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.user.isLoading)
	return (
		<>
			<h2>Change username</h2>
			<Input
				type="text"
				value={newUsername}
				onChange={e => setNewUsername(e.target.value)}
				placeholder="New username"
			/>
			<div className="buttons">
				<GreenBtn
					className="cancel"
					onClick={() => dispatch({ type: HIDE_MODAL })}
					disabled={isLoading}>
					Cancel
				</GreenBtn>
				<PrimaryBtn
					// className="submit"
					onClick={() => dispatch(changeUsername(newUsername))}
					disabled={isLoading}
					isLoading={isLoading}
					customStyle={PrimaryBtnStyle}>
					Submit
				</PrimaryBtn>
			</div>
		</>
	)
}
export const ChangeEmailModal = () => {
	const [newEmail, setNewEmail] = useState("")
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.user.isLoading)

	return (
		<>
			<h2>Change email</h2>
			<Input
				type="text"
				value={newEmail}
				onChange={e => setNewEmail(e.target.value)}
				placeholder="New email"
			/>
			<div className="buttons">
				<GreenBtn
					className="cancel"
					onClick={() => dispatch({ type: HIDE_MODAL })}
					disabled={isLoading}>
					Cancel
				</GreenBtn>
				<PrimaryBtn
					// className="submit"
					onClick={() => dispatch(changeEmail(newEmail))}
					disabled={isLoading}
					isLoading={isLoading}
					customStyle={PrimaryBtnStyle}>
					Submit
				</PrimaryBtn>
			</div>
		</>
	)
}
export const ChangePasswordModal = () => {
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.user.isLoading)
	const [oldPass, setOldPass] = useState("")
	const [newPass, setNewPass] = useState("")
	const [newPass2, setNewPass2] = useState("")
	return (
		<>
			<h2>Change password</h2>
			<Input
				type="password"
				value={oldPass}
				onChange={e => setOldPass(e.target.value)}
				placeholder="Current password"
			/>
			<Input
				type="password"
				value={newPass}
				onChange={e => setNewPass(e.target.value)}
				placeholder="New password"
			/>
			<Input
				type="password"
				value={newPass2}
				onChange={e => setNewPass2(e.target.value)}
				placeholder="Confirm new password"
			/>
			<div className="buttons">
				<GreenBtn
					className="cancel"
					onClick={() => dispatch(hideModal())}
					disabled={isLoading}>
					Cancel
				</GreenBtn>
				<PrimaryBtn
					// className="submit"
					onClick={() => dispatch(changePassword(oldPass, newPass, newPass2))}
					disabled={isLoading}
					isLoading={isLoading}
					customStyle={PrimaryBtnStyle}>
					Submit
				</PrimaryBtn>
			</div>
		</>
	)
}
export const DeleteCommentModal = () => {
	const dispatch = useDispatch()
	const item = useSelector(state => state.app.modal.props)
	const comments = useSelector(state => state.comments.list)
	const { pending } = comments.find(
		comment => comment.comment_id === item.comment_id
	)
	return (
		<>
			<h2>Delete comment</h2>
			<p>
				Are you sure you want to delete the comment? <br />
				<span>{item.text}</span>
			</p>
			<div className="buttons">
				<GreenBtn
					onClick={() => dispatch(hideModal())}
					className="cancel"
					disabled={pending}>
					Cancel
				</GreenBtn>
				<PrimaryBtn
					// className="submit"
					onClick={() => dispatch(deleteComment(item))}
					disabled={pending}
					isLoading={pending}
					customStyle={PrimaryBtnStyle}>
					Delete
				</PrimaryBtn>
			</div>
		</>
	)
}

export const EditCommentModal = () => {
	const dispatch = useDispatch()
	return {}
}
const Input = styled.input`
	display: block;
	width: 300px;
	height: 30px;
	font-size: 1.1rem;
	padding: 0 5px;
	border-radius: 4px;
	margin: 25px 0;
`
