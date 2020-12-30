import { useState, useContext, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { loginHandler } from "../api/user/auth"
import { getFavorites } from "../api/user/favorite"
import UserContext from "../UserContext"
import { PrimaryBtn } from "../components/ButtonStyles"
import ModalMessage from "../components/ModalMessage"

export default function Login() {
	const [form, setForm] = useState({ email: null, password: null })
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState({ text: null, isSuccess: false })
	const { user, setUser } = useContext(UserContext)
	const history = useHistory()

	useEffect(() => {
		if (user.isLoggedIn) {
			history.push("/me/profile")
		}
	}, [user])

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		const { data: userData, message, isSuccess } = await loginHandler(form)
		setLoading(false)
		setMessage({ text: message, isSuccess })
		if (userData) {
			const favorites = await getFavorites()
			setUser({ ...userData, favorites, isLoggedIn: true, isLoading: false })
		}
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
					/>
					<input
						name="password"
						type="password"
						onChange={handleChange}
						placeholder="Password"
						required
					/>
					<PrimaryBtn
						disabled={loading}
						type="submit"
						style={{ fontSize: "1rem", padding: "8px 24px" }}>
						Log in
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
