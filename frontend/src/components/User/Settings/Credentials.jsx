import { useState } from "react"
import styled from "styled-components"
import Modal from "../../Modal"
import ModalMessage from "../../ModalMessage"
import { PrimaryBtn, GreenBtn, RedBtn } from "../../ButtonStyles"
import {
	changeUsername,
	changeEmail,
	changePassword,
} from "../../../api/user/user.update"

export default function Credentials({ user, setUser }) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [changeType, setChangeType] = useState(null)
	const [message, setMessage] = useState({ text: null, isSuccess: null })

	const handleChange = async type => {
		setIsModalOpen(true)
		setChangeType(type)
	}

	return (
		<Container>
			<div className="username">
				<div className="top">
					<h2>Username</h2>
					<GreenBtn onClick={() => handleChange("username")}>Change</GreenBtn>
				</div>
				<div className="data">{user.username}</div>
			</div>
			<div className="email">
				<div className="top">
					<h2>Email</h2>
					<GreenBtn onClick={() => handleChange("email")}>Change</GreenBtn>
				</div>
				<div className="data">{user.email}</div>
			</div>
			<div className="password">
				<div className="top">
					<h2>Password</h2>
					<GreenBtn onClick={() => handleChange("password")}>Change</GreenBtn>
				</div>
				<div className="data">********</div>
			</div>
			{isModalOpen && (
				<ChangeModal
					type={changeType}
					user={user}
					setUser={setUser}
					setIsModalOpen={setIsModalOpen}
					setMessage={setMessage}
				/>
			)}
			<ModalMessage setMessage={setMessage} message={message} />
		</Container>
	)
}

const ChangeModal = ({ user, setUser, type, setIsModalOpen, setMessage }) => {
	const [newUsername, setNewUsername] = useState("")
	const [newEmail, setNewEmail] = useState("")
	const [oldPass, setOldPass] = useState("")
	const [newPass, setNewPass] = useState("")
	const [newPass2, setNewPass2] = useState("")
	const [loading, setLoading] = useState(false)

	const handleUsername = async () => {
		if (newUsername.trim() || newUsername !== user.username) {
			setLoading(true)
			const { data, message, isSuccess } = await changeUsername(newUsername)
			setMessage({ text: message, isSuccess })
			setLoading(false)
			if (isSuccess) {
				setUser({ ...user, username: data })
				setIsModalOpen(false)
			}
		}
	}
	const handleEmail = async () => {
		if (newEmail.trim() || newEmail !== user.email) {
			setLoading(true)
			const { data, message, isSuccess } = await changeEmail(newEmail)
			setMessage({ text: message, isSuccess })
			setLoading(false)
			if (isSuccess) {
				setUser({ ...user, email: data })
				setIsModalOpen(false)
			}
		}
	}
	const handlePassword = async () => {
		setLoading(true)
		if (!oldPass.trim() || !newPass.trim() || !newPass2.trim()) {
			setLoading(false)
			return setMessage({
				text: "Please fill all the fields",
				isSuccess: false,
			})
		} else if (newPass !== newPass2) {
			setLoading(false)
			return setMessage({
				text: "Passwords don't match",
				isSuccess: false,
			})
		} else {
			const { message, isSuccess } = await changePassword(oldPass, newPass)
			setMessage({ text: message, isSuccess })
			setLoading(false)
			if (isSuccess) {
				setIsModalOpen(false)
			}
		}
	}
	if (type === "username")
		return (
			<Modal>
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
						onClick={() => setIsModalOpen(false)}
						disabled={loading}>
						Cancel
					</GreenBtn>
					<PrimaryBtn
						className="submit"
						onClick={handleUsername}
						disabled={loading}>
						Submit
					</PrimaryBtn>
				</div>
			</Modal>
		)
	if (type === "email")
		return (
			<Modal>
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
						onClick={() => setIsModalOpen(false)}
						disabled={loading}>
						Cancel
					</GreenBtn>
					<PrimaryBtn
						className="submit"
						onClick={handleEmail}
						disabled={loading}>
						Submit
					</PrimaryBtn>
				</div>
			</Modal>
		)
	if (type === "password")
		return (
			<Modal>
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
						onClick={() => setIsModalOpen(false)}
						disabled={loading}>
						Cancel
					</GreenBtn>
					<PrimaryBtn
						className="submit"
						onClick={handlePassword}
						disabled={loading}>
						Submit
					</PrimaryBtn>
				</div>
			</Modal>
		)

	return null
}

const Container = styled.div`
	.top {
		display: flex;
		justify-content: space-between;
		margin-top: 40px;
	}
	.data {
		border-radius: 4px;
		padding: 10px;
		margin: 10px 0;
		color: ${({ theme }) => theme.text};
		background: ${({ theme }) => theme.commentBg};
	}
`
const Input = styled.input`
	display: block;
	width: 300px;
	height: 30px;
	font-size: 1.1rem;
	padding: 0 5px;
	border-radius: 4px;
	margin: 25px 0;
`
