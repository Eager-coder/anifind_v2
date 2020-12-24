import { useState, useEffect } from "react"
import styled from "styled-components"

const CommentsContainer = styled.section`
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
`
export default function Profile({ user }) {
	return (
		<CommentsContainer>
			<h1>Comments</h1>
			<div className="top"></div>
		</CommentsContainer>
	)
}
