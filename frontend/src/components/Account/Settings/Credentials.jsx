import styled from "styled-components"
import { GreenBtn } from "../../ButtonStyles"
import { useDispatch, useSelector } from "react-redux"
import {
	CHANGE_EMAIL,
	CHANGE_PASSWORD,
	CHANGE_USERNAME,
} from "../../../redux/types"
import { showModal } from "../../../redux/actions/appActions"

export default function Credentials() {
	const user = useSelector(state => state.user)
	const dispatch = useDispatch()
	return (
		<Container>
			<div className="username">
				<div className="top">
					<h2>Username</h2>
					<GreenBtn onClick={() => dispatch(showModal(CHANGE_USERNAME))}>
						Change
					</GreenBtn>
				</div>
				<div className="data">{user.username}</div>
			</div>
			<div className="email">
				<div className="top">
					<h2>Email</h2>
					<GreenBtn onClick={() => dispatch(showModal(CHANGE_EMAIL))}>
						Change
					</GreenBtn>
				</div>
				<div className="data">{user.email}</div>
			</div>
			<div className="password">
				<div className="top">
					<h2>Password</h2>
					<GreenBtn onClick={() => dispatch(showModal(CHANGE_PASSWORD))}>
						Change
					</GreenBtn>
				</div>
				<div className="data">********</div>
			</div>
		</Container>
	)
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
