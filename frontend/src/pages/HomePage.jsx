import React, { useEffect, useState } from "react"
import styled from "styled-components"
import homeListQuery from "../api/anime/homeListAPI"
import Carousel from "../components/Home/Carousel"
import SearchSection from "../components/Search/SearchSection"

export default function Home() {
	const [trending, setTrending] = useState(null)
	const [top, setTop] = useState(null)

	const getAnimes = async () => {
		try {
			const { top, trending } = await homeListQuery()
			setTrending(trending.media)
			setTop(top.media)
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		getAnimes()
	}, [])
	return (
		<Container>
			<div className="hero">
				<div className="hero-container">
					<h1>
						Discover the world of anime using the world's largest anime database
					</h1>
				</div>
			</div>
			<SearchSection />
			<Carousel header="Popular this season" list={trending} />
			<Carousel header="Top animes of all time" list={top} />
		</Container>
	)
}
const Container = styled.div`
	.hero {
		background: url("/assets/images/background.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		width: 100%;
		height: 400px;
		position: relative;
		.hero-container {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, 0.7);
		}
		h1 {
			max-width: 1200px;
			padding: 100px 50px;
			text-align: center;
			width: 100%;
			margin: auto;
			color: white;
			font-size: 3rem;
		}
	}
	@media (max-width: 1024px) {
		.hero {
			height: 300px;
			h1 {
				font-size: 2.5rem;
			}
		}
	}
	@media (max-width: 768px) {
		.hero {
			height: 200px;
			h1 {
				font-size: 2rem;
				padding: 50px;
			}
		}
	}
	@media (max-width: 480px) {
		.hero {
			height: 200px;
			margin: 0;
			h1 {
				padding: 40px 20px;
				font-size: 1.7rem;
			}
		}
	}
`
