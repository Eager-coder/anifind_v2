import { useState, useEffect } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import {
	removeFavAnime,
	removeFavCharacter,
} from "../../redux/actions/favActions"
import { useDispatch, useSelector } from "react-redux"

export default function Favorites() {
	const list = useSelector(state => state.favorites.anime.list)
	const favCharacters = useSelector(state => state.favorites.characters.list)
	return (
		<Container>
			<h1>Favorites</h1>
			<h2>Anime</h2>
			{list?.length ? (
				<div className="list">
					{list.map(item => (
						<Card key={item.anime_id} item={item} />
					))}
				</div>
			) : (
				<p>
					You have no favorites. Why not to browse <Link to="/">anime</Link>?
				</p>
			)}
			<h2>Chacarters</h2>
			{favCharacters?.length ? (
				<div className="list">
					{favCharacters.map(character => (
						<CharacterCard key={character.character_id} character={character} />
					))}
				</div>
			) : (
				<p>
					You have no favorite characters. Why not to browse{" "}
					<Link to="/">anime</Link>?
				</p>
			)}
		</Container>
	)
}

const Card = ({ item }) => {
	const dispatch = useDispatch()
	const title =
		item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title
	return (
		<CardContainer>
			<Link to={`/anime/${item.anime_id}`}>
				<img src={item.cover_image} alt="" />
				<p>{title}</p>
			</Link>
			<button
				disabled={item.pending}
				onClick={() => dispatch(removeFavAnime(item.anime_id))}>
				{item.pending ? "Removing" : "Remove"}
			</button>
		</CardContainer>
	)
}
const CharacterCard = ({ character }) => {
	const dispatch = useDispatch()
	const name =
		character.name.length > 25
			? character.name.slice(0, 25) + "..."
			: character.name
	return (
		<CardContainer>
			<Link to={`/character/${character.character_id}`}>
				<img src={character.cover_image} alt="" />
				<p>{name}</p>
			</Link>
			<button
				disabled={character.pending}
				onClick={() => dispatch(removeFavCharacter(character.character_id))}>
				{character.pending ? "Removing" : "Remove"}
			</button>
		</CardContainer>
	)
}
const Container = styled.section`
	width: 100%;
	.list {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, 120px);
		column-gap: 20px;
		row-gap: 20px;
		@media (max-width: 640px) {
			grid-template-columns: repeat(3, 1fr);
		}
		@media (max-width: 400px) {
			grid-template-columns: repeat(2, 1fr);
		}
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

const CardContainer = styled.div`
	width: 120px;
	display: flex;
	flex-direction: column;
	img {
		width: 100%;
		/* height: 170px; */
		aspect-ratio: 2 / 3;
		object-fit: cover;
		border-radius: 5px;
	}
	p {
		font-size: 0.9rem;
		height: 30px;
		margin-bottom: 5px;
	}
	@media (max-width: 640px) {
		/* grid-template-columns: repeat(3, 1fr); */
		width: 100%;
	}
`
