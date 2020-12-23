import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
const Section = styled.section`
	width: 35%;
	img {
		width: 100%;
		border-radius: 5px;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
	}
	.details {
		margin: 20px 0;
		padding: 5px 20px;
		border-radius: 3px;
		background-color: white;
		box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
		li {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin: 10px 0;
			color: black;
			font-size: 1.1rem;
			span {
				color: #4c5264;
				font-size: 1rem;
			}
		}
	}
	@media screen and (max-width: 768px) {
		width: 100%;
		.details {
			margin: 0;
			padding: 10px 20px;
			border-radius: 0;
			box-shadow: none;
			li {
				margin: 5px 0;
				font-size: 1rem;
				span {
					font-size: 0.9rem;
				}
			}
		}
		.desktop-img {
			display: none;
		}
	}
	@media screen and (max-width: 480px) {
		.details {
			padding: 5px 10px;
			li {
				font-size: 0.9rem;
				span {
					font-size: 0.85rem;
				}
			}
		}
	}
`
export default function LeftSide({ data, handleFavorites, isFavorite }) {
	return (
		<Section>
			<img className="desktop-img" src={data.coverImage.extraLarge} alt="" />
			<button
				disabled={isFavorite}
				className="add-btn"
				onClick={() => handleFavorites()}>
				{isFavorite ? "Added" : "Add to Favorites"}
			</button>
			<ul className="details">
				<li>
					Season
					<span>
						{data.season} {data.seasonYear}
					</span>
				</li>
				<li>
					Format <span>{data.format}</span>
				</li>
				<li>
					Episodes <span>{data.episodes}</span>
				</li>
				<li>
					Duration <span>{data.duration} min</span>
				</li>
				<li>
					Status <span>{data.status}</span>
				</li>
				<li>
					Studio <span>{data.studios?.edges[0]?.node?.name}</span>
				</li>
			</ul>
		</Section>
	)
}
