import { useState, memo, useContext, FC, ChangeEvent } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn } from "../components/styles/ButtonStyles"
import { ClipLoader } from "react-spinners"
import { UserContext } from "../context/UserContext"
import { AppContext } from "../context/AppContext"
import { H1 } from "../components/styles/Styles"

const Login: FC = () => {
	const [form, setForm] = useState({ email: null, password: null })
	const history = useHistory()
	const { client } = useContext(AppContext)
	const { user, loadingUser, setUser, setAccessToken } = useContext(UserContext)
	const { isLoading } = user

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async () => {
		loadingUser(true)
		const { data, ok } = await client("/user/auth/login", {
			method: "POST",
			body: form,
			shouldShowMessage: "default",
		})
		if (ok) {
			setAccessToken(data.accessToken)
			setUser().then(() => history.push("/"))
		}

		loadingUser(false)
	}
	return (
		<LoginEl>
			<div className="form-container">
				<H1>Log in</H1>
				<form>
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
					<PrimaryBtn disabled={isLoading} isLoading={isLoading} onClick={handleSubmit}>
						{isLoading ? <ClipLoader color="#fff" size="25" /> : "Log in"}
					</PrimaryBtn>
					<p>
						Don't have an accound? <Link to="/register">Sign up</Link>
					</p>
				</form>
			</div>
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
