import React, { useState, useContext } from "react"
import styled from "styled-components"
import UserContext from "../UserContext"
import UploadAvatar from "../components/User/UploadAvatar"
import Favorites from "../components/User/Favorites"
import Sidebar from "../components/User/Sidebar"
const Container = styled.div`
	max-width: 1100px;
	padding: 0 50px;
	margin: auto;
	img.avatar {
		width: 100px;
	}
	.preview-img {
		height: 200px;
	}
`
export default function User() {
	const { user, setUser } = useContext(UserContext)
	const handleClick = () => {
		localStorage.removeItem("auth")
		setUser(null)
	}
	// password update
	const [oldPassword, setOldPass] = useState("")
	const [newPassword, setNewPass] = useState("")
	const updatePassword = async e => {
		e.preventDefault()
		const res = await fetch("http://localhost:80/api/user/update/password", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify({
				email: user.email,
				oldPassword,
				newPassword,
				token: localStorage.getItem("auth"),
			}),
		})
		if (res.ok) {
			localStorage.removeItem("auth")
			setUser(null)
		}
		const json = await res.json()
		console.log(json)
	}

	if (user)
		return (
			<Container>
				<Sidebar />
				<h1>Hello, {user.username}</h1>
				<img className="avatar" src={user.avatar} alt="" />
				<button onClick={handleClick}>Logout</button>
				<UploadAvatar user={user} setUser={setUser} />
				<div className="password-update">
					<h2>Update password</h2>
					<form onSubmit={updatePassword}>
						<input
							defaultValue={oldPassword}
							placeholder="old pass"
							onChange={e => setOldPass(e.target.value)}
							type="password"
							name="password"
						/>
						<input
							defaultValue={newPassword}
							onChange={e => setNewPass(e.target.value)}
							type="password"
							name="password"
						/>
						<button type="submit">update</button>
					</form>
				</div>
				<Favorites />
			</Container>
		)
	return <div>Loading...</div>
}
