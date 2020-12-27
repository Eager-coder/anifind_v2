import { useState, useEffect } from "react"
import styled from "styled-components"
import { format, parseISO } from "date-fns"
import { getProfile } from "../../api/user/profile"
const ProfileContainer = styled.section`
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
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
		.text {
			h2 {
				font-size: 2rem;
				margin-bottom: 15px;
			}
		}
	}
	.about-user {
		h2 {
			font-size: 2rem;
			margin-bottom: 15px;
		}
		p {
			background: ${({ theme }) => theme.commentBg};
			border-radius: 4px;
			padding: 10px;
		}
	}
`
export default function Profile({ user, setUser }) {
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
	return (
		<ProfileContainer>
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
				<h2>About me</h2>
				<p>{user.about ? user.about : "Write about yourself"}</p>
			</div>
		</ProfileContainer>
	)
}
