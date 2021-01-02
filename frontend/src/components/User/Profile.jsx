import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { format, parseISO } from "date-fns"
import { getProfile } from "../../api/user/profile"
import { updateAbout } from "../../api/user/user.update"
import { GreenBtn, PrimaryBtn } from "../ButtonStyles"
import ModalMessage from "../ModalMessage"

export default function Profile({ user, setUser }) {
	const [newAbout, setNewAbout] = useState(user.about || "")
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState({ text: null, isSuccess: false })

	const textareaRef = useRef(null)

	useEffect(() => {
		if (!user.created_at) {
			getProfile().then(({ created_at, about }) => {
				setUser({
					...user,
					created_at: format(parseISO(created_at), "MMMM y"),
					about,
				})
			})
		}
	}, [])

	useEffect(() => {
		if (isEditOpen) {
			textareaRef.current.focus()
		}
	}, [isEditOpen])

	const handleSubmit = async () => {
		setLoading(true)
		const { data, message, isSuccess } = await updateAbout(newAbout)
		setMessage({ text: message, isSuccess })
		setLoading(false)
		if (isSuccess) {
			setUser({ ...user, about: data })
			setIsEditOpen(false)
		}
	}
	return (
		<ProfileEl>
			<h1>Profile</h1>
			<div className="top">
				<div className="avatar">
					<img src={user.avatar} alt="" />
				</div>
				<div className="text">
					<h2>{user.username}</h2>
					<p>Member since {user?.created_at}</p>
				</div>
			</div>
			<div className="about-user">
				<div className="about-header">
					<h2>About me</h2>
					{isEditOpen ? (
						<GreenBtn
							onClick={() => setIsEditOpen(false)}
							style={{ fontSize: "1.1rem" }}
							disabled={loading}>
							Cancel
						</GreenBtn>
					) : (
						<GreenBtn
							onClick={() => setIsEditOpen(true)}
							style={{ fontSize: "1.1rem" }}
							disabled={loading}>
							Edit
						</GreenBtn>
					)}
				</div>
				{isEditOpen ? (
					<div className="edit-about">
						<textarea
							ref={textareaRef}
							value={newAbout}
							onChange={e => setNewAbout(e.target.value)}></textarea>
						<PrimaryBtn
							onClick={handleSubmit}
							style={{ fontSize: "1.1rem" }}
							disabled={loading}>
							Submit
						</PrimaryBtn>
					</div>
				) : (
					<p>{user.about ? user.about : "Write about yourself"}</p>
				)}
			</div>
			<ModalMessage message={message} setMessage={setMessage} />
		</ProfileEl>
	)
}

const ProfileEl = styled.section`
	width: 100%;

	.top {
		display: flex;
		margin-bottom: 50px;
		.avatar {
			margin-right: 50px;
			img {
				width: 180px;
				height: 180px;
				border-radius: 5px;
				object-fit: cover;
			}
		}
	}
	.about-user {
		.about-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		p {
			background: ${({ theme }) => theme.commentBg};
			border-radius: 4px;
			padding: 10px;
			white-space: pre-line;
		}
	}
	.edit-about {
		width: 100%;
		textarea {
			width: 100%;
			min-height: 200px;
			height: max-content;
			border: none;
			border-radius: 4px;
			padding: 10px;
			margin: 10px 0;
			font-size: 1rem;
			color: ${({ theme }) => theme.text};
			background: ${({ theme }) => theme.commentBg};
		}
	}
	@media (max-width: 480px) {
		.top {
			.avatar {
				margin-right: 30px;
				img {
					width: 130px;
					height: 130px;
				}
			}
			.text {
				p {
					font-size: 0.9rem;
				}
			}
		}
	}
`
