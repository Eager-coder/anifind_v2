import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { loginHandler } from "../api/user/auth"
import UserContext from "../UserContext"

const Div = styled.div`
	max-width: 1100px;
	padding: 0 50px;
	margin: auto;
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
		align-items: center;
		input {
			width: 100%;
			margin: 10px 0;
			height: 40px;
			font-size: 1.2rem;
		}
		button {
			width: 200px;
			height: 50px;
		}
	}
`
export default function Login() {
	const [form, setForm] = useState({ email: null, password: null })
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState(null)
	const { user, setUser } = useContext(UserContext)
	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		const { data, message } = await loginHandler(form)
		setLoading(false)
		setMessage(message)
		if (data) {
			setUser(data)
		}
	}

	return (
		<Div>
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
				<button disabled={loading} type="submit">
					Log in
				</button>
				<Link to="/register">register</Link>
				<span>{message}</span>
			</form>
		</Div>
	)
}
