import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import styled from "styled-components"
import searchAPI from "../api/anime/searchAPI"
import SearchSection from "../components/Search/SearchSection"
import InfiniteScroll from "react-infinite-scroll-component"
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"
const SearchPage = styled.div`
	.grid {
		margin: 0 auto;
		max-width: 1200px;
		padding: 0 50px;
		display: grid;
		grid-template-columns: repeat(5, auto);
		justify-content: space-between;
		row-gap: 30px;
	}
	@media (max-width: 950px) {
		.grid {
			grid-template-columns: repeat(4, auto);
		}
	}
	@media (max-width: 768px) {
		.grid {
			padding: 0 20px;
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: repeat(3, auto);
		}
	}
	@media (max-width: 560px) {
		.grid {
			grid-template-columns: repeat(2, auto);
		}
	}
`

export default function Search() {
	const [result, setResult] = useState([])
	const [page, setPage] = useState(1)
	const location = useLocation()
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
	const getData = async (params, prevResult) => {
		const urlParams = new URLSearchParams(params)
		const entries = urlParams.entries()
		const newParams = Object.fromEntries(entries)
		const data = await searchAPI({ ...newParams, page })
		setResult(prevResult.concat(data.media))
	}
	useEffect(() => {
		setPage(1)
		setResult([])
		getData(location.search, [])
	}, [location])

	useEffect(() => {
		if (page > 1) {
			getData(location.search, result)
		}
	}, [page])
	return (
		<SearchPage>
			<SearchSection />

			<InfiniteScroll
				dataLength={result.length}
				next={() => setPage(prev => prev + 1)}
				hasMore={true}>
				<div className="grid">
					{result.length
						? result.map((e, index) => <Card item={e} key={index} />)
						: array.map(item => (
								<CardBox>
									<SkeletonTheme highlightColor="#a7dac7" color="#cad4de">
										<Skeleton key={item} className="mask" />
									</SkeletonTheme>
									<br />
									<SkeletonTheme highlightColor="#a7dac7" color="#cad4de">
										<Skeleton width="120px" height="15px" key={item} />
									</SkeletonTheme>
								</CardBox>
						  ))}
				</div>
			</InfiniteScroll>
		</SearchPage>
	)
}
const CardBox = styled.div`
	width: 180px;
	a {
		display: block;
		color: ${({ theme }) => theme.text};
	}
	img,
	.mask {
		width: 100%;
		height: 255px;
		object-fit: cover;
		border-radius: 8px;
		background: ${({ bgColor }) => bgColor};
	}
	@media (max-width: 1100px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 950px) {
		width: 180px;
		img,
		.mask {
			height: 255px;
		}
	}
	@media (max-width: 900px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 720px) {
		width: 130px;
		img,
		.mask {
			height: 180px;
		}
	}
	@media (max-width: 640px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
	@media (max-width: 560px) {
		width: 200px;
		img,
		.mask {
			height: 280px;
		}
	}

	@media (max-width: 480px) {
		width: 180px;
		img,
		.mask {
			height: 255px;
		}
	}
	@media (max-width: 420px) {
		width: 150px;
		img,
		.mask {
			height: 210px;
		}
	}
`
const Card = ({ item }) => {
	const [loaded, setLoaded] = useState(false)
	const title = item.title.english ? item.title.english : item.title.romaji
	const image = item.coverImage.extraLarge
	const bgColor = item.coverImage.color

	return (
		<CardBox bgColor={bgColor}>
			<Link to={`/anime/${item.id}`}>
				<img
					style={loaded ? {} : { display: "none" }}
					src={image}
					alt=""
					onLoad={() => setLoaded(true)}
				/>
				{loaded ? null : <div className="mask"></div>}
				<p>{title}</p>
			</Link>
		</CardBox>
	)
}
