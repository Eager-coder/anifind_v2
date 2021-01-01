import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import styled from "styled-components"
import searchAPI from "../api/anime/searchAPI"
import SearchSection from "../components/Search/SearchSection"
import InfiniteScroll from "react-infinite-scroll-component"
import EmptyState from "../components/Search/EmptyState"
import { Card, SkeletonCard } from "../components/Search/Card"
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

export default function Search() {
	const [result, setResult] = useState([])
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(false)
	const [hasNextPage, sethasNextPage] = useState(true)
	const location = useLocation()

	const getData = async (params, prevResult) => {
		setLoading(true)
		const urlParams = new URLSearchParams(params)
		const entries = urlParams.entries()
		const newParams = Object.fromEntries(entries)
		const data = await searchAPI({ ...newParams, page })
		sethasNextPage(data.pageInfo.hasNextPage)
		setResult(prevResult.concat(data.media))
		setLoading(false)
	}
	useEffect(() => {
		if (location.search.length) {
			setPage(1)
			setResult([])
			getData(location.search, [])
		}
	}, [location])

	useEffect(() => {
		if (page > 1) {
			getData(location.search, result)
		}
	}, [page])

	const SearchResults = () => {
		if ((!loading && !result.length) || !location.search.length)
			return <EmptyState />
		return (
			<div className="grid">
				{!loading && result.length
					? result.map(item => <Card item={item} key={item.id} />)
					: array.map(num => <SkeletonCard item={num} key={num} />)}
			</div>
		)
	}
	return (
		<SearchPage>
			<SearchSection />
			<InfiniteScroll
				dataLength={result.length}
				next={() => setPage(prev => prev + 1)}
				hasMore={true}
				pullDownToRefreshThreshold={0}
				hasMore={hasNextPage}>
				<SearchResults />
			</InfiniteScroll>
		</SearchPage>
	)
}

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
