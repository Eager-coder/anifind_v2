import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	removeCurrentPageType,
	setCurrentPageType,
} from "../redux/actions/pageActions"
import Loading from "../components/Loading"
import styled, { css } from "styled-components"
import marked from "marked"
import characterQuery from "../api/anime/characterAPI"
import { Link } from "react-router-dom"
import { PrimaryBtn } from "../components/ButtonStyles"
import { addToFavCharacters } from "../redux/actions/favActions"
marked.setOptions({ breaks: true })

export default function CharacterPage({ match }) {
	const character_id = match.params.id
	const dispatch = useDispatch()
	const [data, setData] = useState(null)
	const [isFavorite, setIsFavorite] = useState(false)
	const [list, setList] = useState(null)
	const [paragraph, setParagraph] = useState("")
	const { isLoading, list: favorites } = useSelector(
		state => state.favorites.characters
	)
	const user = useSelector(state => state.user)

	useEffect(() => {
		dispatch(setCurrentPageType("CHARACTER"))
		characterQuery(character_id).then(data => setData(data))
		return () => dispatch(removeCurrentPageType())
	}, [])

	useEffect(() => {
		if (data?.description.length) {
			const descArray = data.description
				.replaceAll("~!", "~")
				.replaceAll("!~", "~")
				.split(/\n{2,}/g)
			if (descArray[0] && descArray[1]) {
				setList(marked(descArray[0]))
				setParagraph(marked(descArray.slice(1).join("\n\n")))
			}
		}
	}, [data])
	useEffect(() => {
		if (user.isLoggedIn) {
			setIsFavorite(checkIsFavorite())
		}
	}, [user, favorites])
	const addToFav = () => {
		const favData = {
			character_id,
			name: data.name.full,
			cover_image: data.image.extraLarge || data.image.large,
		}
		dispatch(addToFavCharacters(favData))
	}
	const checkIsFavorite = () => {
		return favorites?.some(item => item.character_id == character_id) || false
	}
	if (data)
		return (
			<CharacterPageEl>
				<div className="top">
					<div className="image">
						<img src={data.image.large} alt="" />
						<PrimaryBtn
							customStyle={PrimaryBtnStyle}
							onClick={addToFav}
							disabled={isFavorite}
							isLoading={isLoading}>
							{isFavorite ? "Added to Favorites" : "Add to Favorites"}
						</PrimaryBtn>
					</div>
					<div className="text">
						<h1>{data.name.full}</h1>

						<div
							dangerouslySetInnerHTML={{
								__html: marked(data.description),
							}}></div>
					</div>
				</div>

				{/* <div
					className="about"
					dangerouslySetInnerHTML={{ __html: paragraph }}></div> */}
				<h2>Appears in</h2>
				<RelationCardList>
					{data.media.edges.map(({ node }) => (
						<RelationCard key={node.id}>
							<Link to={`/anime/${node.id}`}>
								<img
									src={node.coverImage.extraLarge || node.coverImage.large}
									alt=""
								/>
								<br />
								<p>{node.title.english || node.title.romaji}</p>
							</Link>
						</RelationCard>
					))}
				</RelationCardList>
			</CharacterPageEl>
		)
	return <Loading />
}

const CharacterPageEl = styled.div`
	max-width: 1200px;
	padding: 50px;
	margin: auto;
	.top {
		display: flex;
		width: 100%;
		height: max-content;
		.text {
			width: 70%;
			h1 {
				font-size: 2.5rem;
			}
			p {
				font-size: 1.1rem;
			}
		}
		.image {
			width: 30%;
			margin-right: 50px;
			img {
				border-radius: 7px;
				width: 100%;
				height: auto;
			}
		}
	}
	del {
		background-color: ${({ theme }) => theme.text};
		:hover {
			background-color: unset;
			text-decoration: none;
		}
	}
	.about {
		margin-top: 50px;

		p {
			font-size: 1.2rem;
			margin-bottom: 2rem;
			br {
				display: block;
				margin: 10px 0;
				padding: 15px;
				height: 50px;
			}
		}
	}
`
const RelationCardList = styled.section`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	column-gap: 20px;
	row-gap: 20px;
	@media (max-width: 720px) {
		grid-template-columns: repeat(4, 1fr);
	}
	@media (max-width: 640px) {
		grid-template-columns: repeat(3, 1fr);
	}
`
const RelationCard = styled.div`
	width: 100%;
	img {
		border-radius: 7px;
		aspect-ratio: 2 / 3;
		width: 100%;
		height: auto;
		object-fit: cover;
	}
`
const PrimaryBtnStyle = css`
	width: 120px;
	height: 30px;
`
