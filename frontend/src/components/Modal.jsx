import React from "react"
import ReactDom from "react-dom"
import styled from "styled-components"
const ModalContainer = styled.div`
	position: fixed;
	background: rgba(0, 0, 0, 0.5);
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	.container {
		background: ${({ theme }) => theme.commentBg};
		padding: 15px;
		border-radius: 4px;
	}
	.buttons {
		display: flex;
		justify-content: space-between;
		.cancel {
			cursor: pointer;
			color: ${({ theme }) => theme.header};
			border: #70c7a7 1px solid;
			padding: 5px;
			border-radius: 4px;
			background: none;
		}
		.submit {
			cursor: pointer;
			color: white;
			background: #70c7a7;
			padding: 5px;
			border: none;
			border-radius: 4px;
		}
	}
`
export default function Modal({ children }) {
	return ReactDom.createPortal(
		<ModalContainer>
			<div className="container">
				<div className="content">{children}</div>
			</div>
		</ModalContainer>,
		document.querySelector(".App")
	)
}
