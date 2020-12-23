import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import animeAPI from "../api/anime/animeAPI"
import Comments from "../components/Anime/Comments"
import { addToFavorites } from "../api/user/favorite"
import UserContext from "../UserContext"
import RightSide from "../components/Anime/RightSide"
import LeftSide from "../components/Anime/LeftSide"
import Characters from "../components/Anime/Characters"

export default function Anime({ match }) {
	const [data, setData] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)
	const { user, setUser } = useContext(UserContext)
	const page_id = match.params.id

	useEffect(() => {
		animeAPI(page_id).then(data => setData(data))
		setIsFavorite(checkIsFavorite())
	}, [user])

	const checkIsFavorite = () => {
		return user?.favorites?.some(item => item.page_id == page_id)
	}

	const handleFavorites = async () => {
		if (user) {
			const { data: favorites, message } = await addToFavorites(
				user.user_id,
				page_id,
				data.coverImage.extraLarge,
				data.title.english || data.title.romaji
			)
			if (data) {
				setIsFavorite(true)
				user.favorites = favorites
				setUser(user)
				return
			}
			return console.log(message)
		}
	}

	if (data)
		return (
			<Container>
				<div className="flex-container">
					<LeftSide
						handleFavorites={handleFavorites}
						data={data}
						isFavorite={isFavorite}
					/>
					<RightSide
						handleFavorites={handleFavorites}
						data={data}
						isFavorite={isFavorite}
					/>
				</div>
				<Characters data={data} />
				<Comments page_id={match.params.id} />
			</Container>
		)
	return <div>Loading</div>
}

const Container = styled.div`
	padding: 50px 0;
	.flex-container {
		width: 100%;
		max-width: 1200px;
		padding: 0 50px;
		margin: auto;
		display: flex;
	}

	@media screen and (max-width: 768px) {
		padding: 20px 0;
		.flex-container {
			flex-direction: column-reverse;
			padding: 0 20px;
		}
	}

	@media screen and (max-width: 480px) {
		padding: 0;
		.flex-container {
		}
	}
`
