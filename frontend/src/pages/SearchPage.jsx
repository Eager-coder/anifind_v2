import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import searchAPI from "../api/anime/searchAPI"
import SearchSection from "../components/Search/SearchSection"
import InfiniteScroll from "react-infinite-scroll-component"
import EmptyState from "../components/Search/EmptyState"
import { Card, SkeletonCard } from "../components/Search/Card"
import getUrlObj from "../utlis/getUrlObj"
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

export default function Search() {
	const [result, setResult] = useState([])
	const [hasNoResult, setHasNoResult] = useState(false)
	const [page, setPage] = useState(0)
	const [loading, setLoading] = useState(true)
	const [hasNextPage, sethasNextPage] = useState(true)
	const location = useLocation()

	const getData = async () => {
		setLoading(true)
		const urlParams = new URLSearchParams(location.search)
		const entries = urlParams.entries()
		const newParams = Object.fromEntries(entries)
		const data = await searchAPI({ ...newParams, page })
		if (!data.media.length) return setHasNoResult(true)
		setHasNoResult(false)
		sethasNextPage(data.pageInfo.hasNextPage)
		setResult(prevResult => [...prevResult, ...data.media])
		setLoading(false)
	}
	useEffect(() => {
		const { genre, query, format, season, year } = getUrlObj(location.search)
		if (genre || query || format || season || year) {
			setHasNoResult(false)
			setPage(1)
			setResult([])
			getData()
		} else {
			setHasNoResult(true)
		}
	}, [location])

	useEffect(() => {
		if (page > 1) {
			getData()
		}
	}, [page])

	const SearchResults = () => {
		return loading && !result.length
			? array.map(num => <SkeletonCard item={num} key={num} />)
			: result.map(item => <Card item={item} key={item.id} />)
	}
	return (
		<SearchPage>
			<SearchSection />
			{!hasNoResult ? (
				<InfiniteScroll
					className="grid"
					dataLength={result.length}
					next={() => setPage(prev => prev + 1)}
					pullDownToRefreshThreshold={50}
					hasMore={hasNextPage}
					loader={[1, 2, 3, 4, 5, 6].map(num => (
						<SkeletonCard item={num} key={num} />
					))}>
					<SearchResults />
				</InfiniteScroll>
			) : (
				<EmptyState />
			)}
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
