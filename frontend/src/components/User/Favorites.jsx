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
		grid-template-columns: repeat(auto-fit, 120px);
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
	return (
		<Container>
			<h1>Your favorites</h1>
			{user?.favorites?.length ? (
				<div className="list">
					{user.favorites.map(item => (
						<Card key={item.id} item={item} user={user} setUser={setUser} />
					))}
				</div>
			) : (
				<p>
					You have no favorites. Why not to browse <Link to="/">anime</Link>?
				</p>
			)}
		</Container>
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
		if (!data) return null
		setUser({ ...user, favorites: data })
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
