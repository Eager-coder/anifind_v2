import { useEffect } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"
import { CSSTransition } from "react-transition-group"
import { useDispatch, useSelector } from "react-redux"
import { HIDE_MESSAGE } from "../redux/types"

export default function ModalMessage() {
	const dispatch = useDispatch()
	const { text, isSuccess } = useSelector(state => state.app.message)

	useEffect(() => {
		if (text) {
			const close = setTimeout(() => {
				dispatch({ type: HIDE_MESSAGE })
			}, 5000)

			return () => clearTimeout(close)
		}
	}, [text])

	return createPortal(
		<CSSTransition
			in={text ? true : false}
			timeout={200}
			classNames="message"
			unmountOnExit>
			<Container isSuccess={isSuccess}>
				<p>{text}</p>
				<span onClick={() => dispatch({ type: HIDE_MESSAGE })}>&#10006;</span>
			</Container>
		</CSSTransition>,
		document.querySelector("#root")
	)
}
const Container = styled.div`
	position: fixed;
	top: 0px;
	left: 50%;
	transform: translate(-50%, 50px);
	background: ${({ isSuccess }) => (isSuccess ? "#c3f1c7" : "#e4c4c4")};
	padding: 10px;
	border-radius: 4px;
	height: max-content;
	width: 400px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	z-index: 2;
	p {
		color: ${({ isSuccess }) => (isSuccess ? "#00915c" : "#C2185B")};
		margin-right: 10px;
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
	@media (max-width: 480px) {
		width: calc(100% - 40px);
		p {
			font-size: 0.9rem;
		}
	}
`
