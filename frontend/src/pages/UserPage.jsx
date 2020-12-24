import React, { useState, useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import styled from "styled-components"
import UserContext from "../UserContext"
import UploadAvatar from "../components/User/UploadAvatar"
import Favorites from "../components/User/Favorites"
import Sidebar from "../components/User/Sidebar"
import Profile from "../components/User/Profile"
import Comments from "../components/User/Comments"

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
	const handleClick = () => {
		localStorage.removeItem("auth")
		setUser(null)
	}

	if (user)
		return (
			<Container>
				<div className="flex">
					<Sidebar category={category} />
					{category === "profile" && <Profile user={user} />}
					{category === "favorites" && <Favorites />}
				</div>
				<button onClick={handleClick}>Logout</button>
				{/* <UploadAvatar user={user} setUser={setUser} /> */}
			</Container>
		)
	return <div>Loading...</div>
}
