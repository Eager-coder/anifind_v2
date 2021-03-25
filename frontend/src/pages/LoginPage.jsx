import { useState, useEffect, memo } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { useDispatch, useSelector } from "react-redux"
import { PrimaryBtn } from "../components/ButtonStyles"
import ModalMessage from "../components/ModalMessage"
import { login } from "../redux/actions/authActions"
import LoadingSpinner from "../components/LoadingSpinner"
import { ClipLoader } from "react-spinners"
import { getUser } from "../redux/actions/userActions"
import { getFavAnimes, getFavCharacters } from "../redux/actions/favActions"

const Login = () => {
	const [form, setForm] = useState({ email: null, password: null })
	const [message, setMessage] = useState({ text: null, isSuccess: false })
	const history = useHistory()
	const dispatch = useDispatch()
	const { isLoggedIn, isLoading } = useSelector(state => state.user)

	useEffect(() => {
		if (isLoggedIn) {
			history.goBack()
		}
	}, [isLoggedIn])

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		dispatch(login(form.email, form.password)).then(isRegistered => {
			if (isRegistered) {
				dispatch(getUser())
				dispatch(getFavAnimes())
				dispatch(getFavCharacters())
			}
		})
	}
	return (
		<LoginEl>
			<div className="form-container">
				<h1>Log in</h1>

				<form onSubmit={handleSubmit}>
					<input
						name="email"
						type="email"
						onChange={handleChange}
						placeholder="Email"
						required
						autoComplete="email"
					/>
					<input
						name="password"
						type="password"
						onChange={handleChange}
						placeholder="Password"
						required
						autoComplete="password"
					/>
					<PrimaryBtn
						disabled={isLoading}
						type="submit"
						style={{
							fontSize: "1rem",
							width: "120px",
							height: "40px",
						}}>
						{isLoading ? <ClipLoader color="#fff" size="25" /> : "Log in"}
					</PrimaryBtn>
					<p>
						Don't have an accound? <Link to="/register">Sign up</Link>
					</p>
				</form>
			</div>
			<ModalMessage message={message} setMessage={setMessage} />
		</LoginEl>
	)
}

export default memo(Login)

const LoginEl = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	.form-container {
		max-width: 400px;
		margin: auto;
		margin-top: 50px;
		padding: 50px;
		background: ${({ theme }) => theme.commentBg};
		border-radius: 4px;
		h1 {
			text-align: center;
			margin-bottom: 50px;
		}

		form {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			input {
				width: 100%;
				margin: 10px 0;
				height: 35px;
				font-size: 1rem;
				border-radius: 4px;
				padding: 5px 10px;
				border: none;
				background: #edf1f5;
			}
			p {
				margin-top: 50px;
				a {
					color: #70c7a7;
				}
			}
		}
		button {
			margin-top: 30px;
		}
	}
	@media (max-width: 768px) {
		padding: 0;
		margin: 0;
		.form-container {
			padding: 50px;
			margin: 0;
			max-width: 100%;
			height: 80vh;
		}
	}
	@media (max-width: 480px) {
		.form-container {
			padding: 50px 20px;
			margin: 0;
			max-width: 100%;
			height: 80vh;
		}
	}
`
