import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useLocation, useHistory } from "react-router-dom"
import SearchBox from "./SearchBox"
import { selectLists } from "./SelectList"
import OptionList from "./OptionList"
import getUrlObj from "../../utlis/getUrlObj"

const Container = styled.div`
	max-width: 1200px;
	padding: 0 50px;
	margin: auto;
	@media (max-width: 768px) {
		padding: 0 20px;
	}
`
const AllFilters = styled.div`
	width: 100%;
	margin: 50px auto;
	.options-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	@media (max-width: 768px) {
		margin: 20px auto;
		.options-container {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
	}
`

export default function SearchSection() {
	const location = useLocation()
	const history = useHistory()
	return (
		<Container>
			<SearchBox location={location} history={history} />
			<AllFilters>
				<div className="options-container">
					{selectLists.map((item, index) => (
						<OptionList
							key={index}
							item={item}
							location={location}
							history={history}
						/>
					))}
				</div>
			</AllFilters>
			<SelectedFilters location={location} history={history} />
		</Container>
	)
}

const FiltersBox = styled.div`
	display: flex;
	margin: 15px 0;
	.filter {
		color: white;
		border-radius: 7px;
		margin-right: 20px;
		background: #4c5264;
		width: max-content;
		display: flex;
		align-items: center;
		height: 25px;
		width: max-content;
		padding: 0 4px;
	}
	img {
		margin-left: 5px;
		width: 15px;
		filter: invert(1);
		height: auto;
	}
`
const SelectedFilters = ({ history, location }) => {
	const [filter, setFilter] = useState([])
	const obj = getUrlObj(location.search)

	useEffect(() => {
		let arr = []
		for (let key in obj) {
			if (obj[key]) {
				arr.push({ type: key, value: obj[key] })
			}
		}
		setFilter(arr)
	}, [location])

	const removeFilter = filter => {
		delete obj[filter.type]
		const url = new URLSearchParams(obj).toString()
		history.push("/search?" + url)
	}

	return (
		<FiltersBox>
			{filter.map((e, index) => (
				<div key={index} className="filter">
					<span>
						<b>{e.type}:</b> {e.value}
					</span>
					<img
						onClick={() => removeFilter(e)}
						src="./assets/icons/x.svg"
						alt=""
					/>
				</div>
			))}
		</FiltersBox>
	)
}