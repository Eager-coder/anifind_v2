import React, { useState } from "react"
import styled from "styled-components"
import getUrlObj from "../../utlis/getUrlObj"
const Div = styled.div`
	width: 100%;
	margin-top: 50px;
	h2 {
		font-size: 2.5rem;
		color: ${({ theme }) => theme.header};
		margin-bottom: 10px;
	}
	.input-container {
		width: 100%;
		height: 40px;
		position: relative;
		border: none;
		box-shadow: ${({ theme }) => theme.boxShadow};
		border-radius: 7px;
		background-color: white;
		img {
			width: 23px;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			left: 15px;
			filter: invert(0.7);
		}
		input {
			height: 100%;
			width: 100%;
			border: none;
			background: transparent;
			font-size: 1.1rem;
			font-weight: 300;
			padding-left: 50px;
			color: #4c5264;
		}
	}

	@media (max-width: 768px) {
		margin: 20px 0;
		h2 {
			font-size: 1.7rem;
		}
		.input-container {
			height: 30px;
			input {
				font-size: 1rem;
				padding-left: 40px;
			}
			img {
				left: 10px;
			}
		}
	}
`

export default function SearchBox({ location, history }) {
	const [query, setQuery] = useState(getUrlObj(location.search).query || "")

	const handleSubmit = e => {
		if (e.key === "Enter" && query) {
			const newParams = { ...getUrlObj(location.search), query }
			const url = new URLSearchParams(newParams).toString()
			history.push("/search?" + url)
		}
	}
	return (
		<Div>
			<h2>Search anime</h2>
			<div className="input-container">
				<img
					src="https://img.icons8.com/ios-glyphs/100/000000/search.png"
					alt="search"
				/>
				<input
					type="text"
					value={query}
					onChange={e => setQuery(() => e.target.value.trim())}
					onKeyDown={handleSubmit}
				/>
			</div>
		</Div>
	)
}
