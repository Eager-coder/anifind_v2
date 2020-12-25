import { useState, useEffect } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { removeFavorite } from "../../api/user/favorite"
const Container = styled.section`
	width: 100%;
	h1 {
		margin-bottom: 20px;
		font-size: 2.5rem;
	}
	.list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		column-gap: 20px;
		row-gap: 20px;
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

export default function Favorites({ user, setUser }) {
	return user.favorites?.length ? (
		<Container>
			<h1>Your favorites</h1>
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
	width: 120px;
	display: flex;
	flex-direction: column;
	img {
		width: 120px;
		height: 170px;
		object-fit: cover;
		border-radius: 5px;
	}
	p {
		font-size: 0.9rem;
		height: 30px;
		margin-bottom: 5px;
	}
`

const Card = ({ item, user, setUser }) => {
	const [message, setMessage] = useState(null)
	const [loading, setloading] = useState(false)
	const title =
		item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title
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
				<p>{title}</p>
			</Link>
			<button disabled={loading} onClick={() => handleRemove(item.page_id)}>
				{loading ? "Removing" : "Remove"}
			</button>
		</CardContainer>
	)
}
