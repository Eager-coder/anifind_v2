import { useState, useEffect } from "react"
import styled from "styled-components"

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
export default function Profile({ user }) {
	return (
		<ProfileContainer>
			<h1>Profile</h1>
			<div className="top">
				<div className="avatar">
					<img src={user.avatar} alt="" />
				</div>
				<div className="text">
					<h2>{user.username}</h2>
					<p>Member since December 2020</p>
				</div>
			</div>
			<div className="about-user">
				<h2>About me</h2>
				<p>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet
					libero sit sint perferendis natus sed adipisci voluptas praesentium
					recusandae. Similique quasi accusantium odit error voluptatem?
				</p>
			</div>
		</ProfileContainer>
	)
}
