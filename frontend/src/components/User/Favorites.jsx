import { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { removeFavorite } from "../../api/user/favorite"
import UserContext from "../../UserContext"
const Container = styled.section`
	h2 {
		margin: 20px 0;
		font-size: 2rem;
	}
	.list {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
	}
	button {
		cursor: pointer;
		width: max-content;
		border: none;
		border-radius: 4px;
		background-color: rgb(199, 77, 77);
		color: white;
		margin-top: 5px;
		padding: 3px 5px;
		&:disabled {
			background-color: grey;
		}
	}
`

export default function Favorites() {
	const { user, setUser } = useContext(UserContext)

	return user.favorites?.length ? (
		<Container>
			<h2>Your favorites</h2>
			<div className="list">
				{user.favorites.map((item, index) => (
					<Card key={index} item={item} user={user} setUser={setUser} />
				))}
			</div>
		</Container>
	) : (
		<div>You have no favorites. Why not to browse anime?</div>
	)
}

const CardContainer = styled.div`
	display: flex;
	flex-direction: column;
	img {
		width: 120px;
		height: 170px;
		object-fit: cover;
		border-radius: 5px;
	}
`

const Card = ({ item, user, setUser }) => {
	const [message, setMessage] = useState(null)
	const [loading, setloading] = useState(false)

	const handleRemove = async page_id => {
		setloading(true)
		const { data = null, message } = await removeFavorite(page_id)
		setMessage(message)
		if (!data) return
		setUser({ ...user, favorites: data })
		setloading(false)
	}
	return (
		<CardContainer>
			<Link to={`/anime/${item.page_id}`}>
				<img src={item.cover_image} alt="" />
			</Link>
			<Link to={`/anime/${item.page_id}`}>{item.title}</Link>
			<button disabled={loading} onClick={() => handleRemove(item.page_id)}>
				{loading ? "Removing" : "Remove"}
			</button>
		</CardContainer>
	)
}
