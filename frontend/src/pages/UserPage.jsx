import { useContext, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import styled from "styled-components"
import UserContext from "../UserContext"
import Favorites from "../components/User/Favorites"
import Sidebar from "../components/User/Sidebar"
import Profile from "../components/User/Profile"
import Comments from "../components/User/Comments"
import Discussions from "../components/User/Discussions"
import Settings from "../components/User/Settings/Settings"
import { logout } from "../api/user/auth"
import Loading from "../components/Loading"

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
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
	h2 {
		font-size: 1.5rem;
		margin-bottom: 15px;
	}
	@media (max-width: 768px) {
		padding: 0 20px;
		.flex {
			display: block;
		}
		h1 {
			font-size: 2rem;
		}
	}
`
export default function User() {
	const { user, setUser } = useContext(UserContext)
	const { category } = useParams()
	const history = useHistory()

	const handleLogout = async () => {
		const { message, isSuccess } = await logout()
		if (isSuccess) return setUser({ isLoading: false, isLoggedIn: false })
	}

	useEffect(() => {
		if (!user.isLoggedIn && !user.isLoading) {
			history.push("/login")
		}
	}, [user])

	if (user.isLoggedIn && !user.isLoading)
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
	return <Loading size={50} />
}
