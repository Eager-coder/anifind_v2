import { useState, useEffect } from "react"
import styled from "styled-components"
import Modal from "../../Modal"
import { PrimaryBtn, GreenBtn, RedBtn } from "../../ButtonStyles"

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
export default function Credentials({ user, setUser }) {
	return (
		<Container>
			<div className="username">
				<div className="top">
					<h2>Username</h2>
					<GreenBtn>Change</GreenBtn>
				</div>
				<div className="data">{user.username}</div>
			</div>
			<div className="email">
				<div className="top">
					<h2>Email</h2>
					<GreenBtn>Change</GreenBtn>
				</div>
				<div className="data">{user.email}</div>
			</div>
			<div className="password">
				<div className="top">
					<h2>Password</h2>
					<GreenBtn>Change</GreenBtn>
				</div>
				<div className="data">**************</div>
			</div>
		</Container>
	)
}
