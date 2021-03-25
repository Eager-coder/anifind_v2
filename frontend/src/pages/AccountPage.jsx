import { useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import styled from "styled-components"
import Favorites from "../components/Account/Favorites"
import Sidebar from "../components/Account/Sidebar"
import Profile from "../components/Account/Profile"
import Comments from "../components/Account/Comments"
import Discussions from "../components/Account/Discussions"
import Settings from "../components/Account/Settings/Settings"
import Loading from "../components/Loading"
import { useDispatch, useSelector } from "react-redux"
// import { getFavAnimes } from "../redux/actions/favActions"
import Social from "../components/Account/Social"

export default function User() {
	const { category } = useParams()
	const history = useHistory()
	const { isLoading, isLoggedIn } = useSelector(state => state.user)

	useEffect(() => {
		if (!isLoggedIn && !isLoading) {
			history.push("/login")
		}
	}, [isLoggedIn, isLoading])

	return (
		<Container>
			<div className="flex">
				<Sidebar category={category} />
				{category === "profile" && <Profile />}
				{category === "favorites" && <Favorites />}
				{category === "comments" && <Comments />}
				{category === "discussions" && <Discussions />}
				{category === "settings" && <Settings />}
				{category === "social" && <Social />}
			</div>
		</Container>
	)
}

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
		margin: 20px auto;
		.flex {
			display: block;
		}
		h1 {
			font-size: 2rem;
		}
	}
`
