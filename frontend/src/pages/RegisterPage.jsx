import { useState, useContext, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import styled from "styled-components"
import { PrimaryBtn } from "../components/ButtonStyles"
import { useDispatch, useSelector } from "react-redux"
import { register } from "../redux/actions/authActions"
import { ClipLoader } from "react-spinners"

export default function Register() {
	const dispatch = useDispatch()
	const { isLoading, isLoggedIn } = useSelector(state => state.user)
	const [form, setForm] = useState({
		username: null,
		email: null,
		password: null,
		password2: null,
	})
	const history = useHistory()

	useEffect(() => {
		if (isLoggedIn) {
			history.goBack()
		}
	}, [isLoggedIn, isLoading])

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}
	const handleSubmit = async e => {
		e.preventDefault()
		dispatch(register(form))
	}
	return (
		<RegisterEl>
			<div className="form-container">
				<h1>Register</h1>
				<form onSubmit={handleSubmit}>
					<input
						name="username"
						type="text"
						required
						placeholder="Username"
						onChange={handleChange}
					/>
					<input
						name="email"
						type="email"
						required
						placeholder="Email"
						onChange={handleChange}
					/>
					<input
						name="password"
						type="password"
						required
						placeholder="Password"
						onChange={handleChange}
					/>
					<input
						name="password2"
						type="password"
						required
						placeholder="Confirm password"
						onChange={handleChange}
					/>
					<PrimaryBtn
						disabled={isLoading}
						type="submit"
						style={{
							fontSize: "1rem",
							width: "120px",
							height: "40px",
						}}>
						{isLoading ? <ClipLoader color="#fff" size="25" /> : "Register"}
					</PrimaryBtn>
					<p>
						Already signed up? <Link to="/login">Log in</Link>
					</p>
				</form>
			</div>
		</RegisterEl>
	)
}

const RegisterEl = styled.div`
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
		}
	}
	@media (max-width: 480px) {
		.form-container {
			padding: 50px 20px;
			margin: 0;
			max-width: 100%;
		}
	}
`
