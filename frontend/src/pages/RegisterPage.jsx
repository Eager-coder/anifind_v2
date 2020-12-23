import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import UserContext from "../UserContext"
import styled from "styled-components"
import { registerHandler } from "../api/user/auth"
const Div = styled.div`
	h1 {
		margin-top: 50px;
		text-align: center;
	}
	form {
		margin: 0 auto;
		margin-top: 50px;
		width: 500px;
		display: flex;
		flex-direction: column;
		input {
			width: 100%;
			margin: 10px 0;
			height: 40px;
			font-size: 1.2rem;
		}
		button {
			width: 200px;
			height: 50px;
			align-self: center;
		}
	}
`
export default function Register() {
	const { user, setUser } = useContext(UserContext)

	const [form, setForm] = useState({
		username: null,
		email: null,
		password: null,
		password2: null,
	})
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}
	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		const { message, data } = await registerHandler(form)
		setLoading(false)
		setMessage(message)
		if (data) {
			setUser(data)
		}
	}
	return (
		<Div>
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
				<button disabled={loading} type="submit">
					Register
				</button>
				<span>{message}</span>
				<Link to="/login">Login</Link>
			</form>
		</Div>
	)
}
