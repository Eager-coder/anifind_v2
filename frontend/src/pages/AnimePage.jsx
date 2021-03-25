import { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import Comments from "../components/Anime/Comments"
import RightSide from "../components/Anime/RightSide"
import LeftSide from "../components/Anime/LeftSide"
import Characters from "../components/Anime/Characters"
import { useDispatch, useSelector } from "react-redux"
import { addToFavAnimes } from "../redux/actions/favActions"
import Loading from "../components/Loading"
import {
	removeCurrentPageType,
	setCurrentPageType,
} from "../redux/actions/pageActions"
import animeQuery from "../api/anime/animeAPI"

export default function Anime({ match }) {
	const dispatch = useDispatch()
	const [isFavorite, setIsFavorite] = useState(false)
	const anime_id = match.params.id
	const user = useSelector(state => state.user)
	const { list: favorites, isLoading } = useSelector(
		state => state.favorites.anime
	)
	const [info, setInfo] = useState(null)

	useEffect(() => {
		dispatch(setCurrentPageType("ANIME"))
		animeQuery(anime_id).then(data => {
			setInfo(data)
		})
		return () => dispatch(removeCurrentPageType())
	}, [])

	useEffect(() => {
		if (user.isLoggedIn) {
			setIsFavorite(checkIsFavorite())
		}
	}, [favorites])

	const checkIsFavorite = () => {
		return favorites?.some(item => item.anime_id == anime_id) || false
	}

	const handleFavorites = async () => {
		dispatch(
			addToFavAnimes(
				anime_id,
				info.coverImage.extraLarge,
				info.title.english || info.title.romaji
			)
		)
	}

	if (info)
		return (
			<Container>
				<div className="flex-container">
					<LeftSide
						handleFavorites={handleFavorites}
						data={info}
						isFavorite={isFavorite}
						isLoading={isLoading}
					/>
					<RightSide
						handleFavorites={handleFavorites}
						data={info}
						isFavorite={isFavorite}
						isLoading={isLoading}
					/>
				</div>
				<Characters data={info} />
				<Comments anime_id={match.params.id} />
			</Container>
		)
	return <Loading size={100} />
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
