import { FC, useContext, useEffect, useState } from "react"
import styled from "styled-components"
import Comments from "../components/Anime/Comments"
import RightSide from "../components/Anime/RightSide"
import LeftSide from "../components/Anime/LeftSide"
import Characters from "../components/Anime/Characters"
import Loading from "../components/Loading"
import animeQuery from "../api/anime/animeAPI"
import { RouteChildrenProps } from "react-router"
import { AppContext } from "../context/AppContext"

interface RouteProps {
	match: {
		params: {
			id: number
		}
	}
	history: RouteChildrenProps["history"]
}
interface Anime {
	coverImage: {
		extraLarge: string
	}
	title: {
		english: string
		romaji: string
	}
}

const AnimePage: FC<RouteProps> = ({ match, history }) => {
	const anime_id = match.params.id
	const [isLoading, setIsLoading] = useState(true)
	const [anime, setAnime] = useState<Anime | null>(null)
	const { client } = useContext(AppContext)
	const [favAnime, setFavAnime] = useState({ isFavorite: false, isLoading: true })
	console.log("ANimePage rerender")
	const getAnimeData = async () => {
		const anime = await animeQuery(anime_id)
		if (!anime) {
			return history.replace("/404")
		}
		setAnime(anime)
		setIsLoading(false)
		const { data, ok } = await client(`/favorites/anime/is_favorite/${anime_id}`)
		if (ok) {
			setFavAnime({ isFavorite: data.is_favorite, isLoading: false })
		} else {
			setFavAnime({ isFavorite: false, isLoading: false })
		}
	}
	useEffect(() => {
		getAnimeData()
	}, [])

	const handleAddToFavorites = async () => {
		setFavAnime({ isFavorite: false, isLoading: true })
		const { ok } = await client(`/favorites/anime/`, {
			method: "POST",
			body: {
				anime_id,
				cover_image: anime?.coverImage.extraLarge,
				title: anime?.title.english || anime?.title.romaji,
			},
			shouldShowMessage: "error",
		})

		setFavAnime(prev => ({ isFavorite: ok ? true : prev.isFavorite, isLoading: false }))
	}
	const handleRemoveFromFavorites = async () => {
		setFavAnime({ isFavorite: false, isLoading: true })
		const { ok } = await client(`/favorites/anime/${anime_id}`, {
			method: "DELETE",
			shouldShowMessage: "error",
		})

		setFavAnime(prev => ({ isFavorite: ok ? false : prev.isFavorite, isLoading: false }))
	}
	if (!isLoading)
		return (
			<Container>
				<div className="flex-container">
					<LeftSide
						favAnime={favAnime}
						handleAddToFavorites={handleAddToFavorites}
						handleRemoveFromFavorites={handleRemoveFromFavorites}
						data={anime}
						isLoading={isLoading}
					/>
					<RightSide
						favAnime={favAnime}
						handleAddToFavorites={handleAddToFavorites}
						handleRemoveFromFavorites={handleRemoveFromFavorites}
						data={anime}
						isLoading={isLoading}
					/>
				</div>
				<Characters data={anime} />
				<Comments anime_id={match.params.id} />
			</Container>
		)
	return <Loading size={100} />
}
export default AnimePage
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
