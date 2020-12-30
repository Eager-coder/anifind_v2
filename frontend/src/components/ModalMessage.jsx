import { useEffect } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"

const Container = styled.div`
	position: fixed;
	top: 0px;
	left: 50%;
	transform: translate(-50%, 50px);
	background: ${({ isSuccess }) => (isSuccess ? "#c3f1c7" : "#e4c4c4")};
	padding: 10px;
	border-radius: 4px;
	height: max-content;
	min-width: 400px;
	max-width: max-content;
	display: flex;
	justify-content: space-between;
	align-items: center;
	p {
		color: ${({ isSuccess }) => (isSuccess ? "#00915c" : "#C2185B")};
	}
	span {
		font-size: 1.2rem;
		cursor: pointer;
		color: #303030;
	}
	&.message-enter {
		transform: translate(-50%, 0px);
		transition: 200ms;
		opacity: 0;
	}
	&.message-enter-active {
		transform: translate(-50%, 50px);
		transition: 200ms;
		opacity: 1;
	}
	&.message-exit {
		transform: translate(-50%, 50px);
		transition: 200ms;
	}
	&.message-exit-active {
		transform: translate(-50%, 0px);
		transition: 200ms;
		opacity: 0;
	}
`

export default function ModalMessage({ message, setMessage }) {
	useEffect(() => {
		const close = setTimeout(() => {
			setMessage({ text: null, isSuccess: false })
		}, 5000)

		return () => clearTimeout(close)
	}, [message])

	return createPortal(
		<CSSTransition
			in={message.text ? true : false}
			timeout={200}
			classNames="message"
			unmountOnExit>
			<Container isSuccess={message.isSuccess}>
				<p>{message.text}</p>
				<span onClick={() => setMessage({ text: null, isSuccess: false })}>
					&#10006;
				</span>
			</Container>
		</CSSTransition>,
		document.querySelector("#root")
	)
}
