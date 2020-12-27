import React, { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import UserContext from "../UserContext"
import UploadAvatar from "../components/User/UploadAvatar"
import Favorites from "../components/User/Favorites"
import Sidebar from "../components/User/Sidebar"
import Profile from "../components/User/Profile"
import Comments from "../components/User/Comments"
import Discussions from "../components/User/Discussions"
import Settings from "../components/User/Settings/Settings"
import { logout } from "../api/user/auth"
const Container = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: 50px auto;
	.flex {
		display: flex;
	}
	img.avatar {
		width: 100px;
	}
	.preview-img {
		height: 200px;
	}
`
export default function User() {
	const { user, setUser } = useContext(UserContext)
	const { category } = useParams()
	const handleLogout = async () => {
		const { message, isSuccess } = await logout()
		if (isSuccess) return setUser(null)
	}

	if (user)
		return (
			<Container>
				<div className="flex">
					<Sidebar category={category} />
					{category === "profile" && <Profile user={user} setUser={setUser} />}
					{category === "favorites" && (
						<Favorites user={user} setUser={setUser} />
					)}
					{category === "comments" && (
						<Comments user={user} setUser={setUser} />
					)}
					{category === "discussions" && (
						<Discussions user={user} setUser={setUser} />
					)}
					{category === "settings" && (
						<Settings user={user} setUser={setUser} />
					)}
				</div>
				<button onClick={handleLogout}>Logout</button>
			</Container>
		)
	return <div>Loading...</div>
}
