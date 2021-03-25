import { useState, useEffect, useRef, memo } from "react"
import styled from "styled-components"
import { format, parseISO } from "date-fns"
import { updateAbout } from "../../redux/actions/userActions"
import { GreenBtn, PrimaryBtn, RedBtn } from "../ButtonStyles"
import { useDispatch, useSelector } from "react-redux"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
import { logout } from "../../redux/actions/authActions"
const Profile = () => {
	const [isEditOpen, setIsEditOpen] = useState(false)
	const user = useSelector(state => state.user)
	const { isLoading } = useSelector(state => state.user)
	const [newAbout, setNewAbout] = useState(user.about.text || "")
	const dispatch = useDispatch()
	const textareaRef = useRef(null)
	const [isLogoutLoading, setIsLogoutLoading] = useState(false)
	useEffect(() => {
		if (isEditOpen) {
			textareaRef.current.focus()
		}
	}, [isEditOpen])

	return (
		<ProfileEl>
			<h1>Profile</h1>
			<div className="top">
				<div className="avatar">
					<img src={user.avatar.url} alt="" />
				</div>
				<div className="text">
					<h2>{user.username}</h2>

					{isLoading || !user.created_at ? (
						<SkeletonTheme highlightColor="#f5f5f5" color="#c4c4c4">
							<Skeleton width="7rem" height="10px" />
						</SkeletonTheme>
					) : (
						<p>Member since {format(parseISO(user.created_at), "MMMM y")}</p>
					)}
				</div>
			</div>
			<div className="about-user">
				<div className="about-header">
					<h2>About me</h2>

					{isEditOpen ? (
						<GreenBtn
							onClick={() => setIsEditOpen(false)}
							style={{ fontSize: "1.1rem" }}
							disabled={isLoading}>
							Cancel
						</GreenBtn>
					) : (
						<GreenBtn
							onClick={() => setIsEditOpen(true)}
							style={{ fontSize: "1.1rem" }}
							disabled={isLoading}>
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
							onClick={() => dispatch(updateAbout(newAbout))}
							style={{ fontSize: "1.1rem" }}
							disabled={isLoading}>
							Submit
						</PrimaryBtn>
					</div>
				) : (
					<>
						{isLoading ? (
							<SkeletonTheme highlightColor="#f5f5f5" color="#c4c4c4">
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
								<Skeleton width="100%" height="10px" />
							</SkeletonTheme>
						) : (
							<p>
								{user.about.text ? user.about.text : "Write about yourself"}
							</p>
						)}
					</>
				)}
				<RedBtn
					onClick={() => {
						setIsLogoutLoading(true)
						dispatch(logout()).then(() => {
							setIsLogoutLoading(false)
							window.location.replace("/")
						})
					}}
					disabled={isLogoutLoading}
					style={{ marginTop: 25 }}>
					Logout
				</RedBtn>
			</div>
		</ProfileEl>
	)
}
export default memo(Profile)

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
