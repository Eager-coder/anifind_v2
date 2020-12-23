import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
const Section = styled.section`
	width: 60%;
	margin-left: 50px;
	margin-top: 0px;
	h1 {
		font-size: 3rem;
		font-weight: 900;
		margin-bottom: 10px;
		padding: 0;
		color: ${({ theme }) => theme.header};
	}
	p {
		font-size: 1.1rem;
		margin-bottom: 20px;
		color: ${({ theme }) => theme.text};
	}
	.mobile-img {
		display: none;
		border-radius: 7px;
	}
	.trailer {
		margin: 20px 0;
	}
	.genres {
		display: flex;
		flex-wrap: wrap;
		margin-top: 20px;
		a {
			border: 1px rgba(0, 0, 0, 0.4) solid;
			color: #4c5264;
			background-color: white;
			border-radius: 7px;
			margin: 5px 0;
			margin-right: 10px;
			padding: 2px 5px;
		}
	}
	.add-btn {
		cursor: pointer;
		border: none;
		border-radius: 4px;
		background-color: #70c7a7;
		width: max-content;
		padding: 3px 5px;
		color: whitesmoke;
		transition: 0.2s;
		box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
		&:hover {
			background-color: #5d9e86;
			color: white;
		}
		&:disabled {
			background-color: grey;
		}
	}
	@media screen and (max-width: 768px) {
		width: 100%;
		margin: 0;
		h1 {
			font-size: 2rem;
		}
		.img-and-desc {
			display: flex;
			margin-bottom: 10px;
			p {
				font-size: 1rem;
				width: 70%;
			}
			.mobile-img-cont {
				width: 30%;
				height: auto;
				margin-right: 15px;
				.mobile-img {
					display: block;
					width: 100%;
				}
			}
		}
		.genres {
			margin-top: 5px;
		}

		@media screen and (max-width: 480px) {
			margin-top: 20px;
			h1 {
				font-size: 1.8rem;
			}
			.img-and-desc {
				display: block;
				margin-bottom: 10px;
				p {
					font-size: 0.8rem;
					width: 100%;
					margin-bottom: 0;
					margin-top: 20px;
				}
				.mobile-img-cont {
					width: 100%;
					margin-right: 0px;
				}
			}
			iframe {
				height: 220px;
			}
			.genres {
				li {
					font-size: 0.9rem;
					margin: 5px 5px 5px 0;
					padding: 2px 5px;
				}
			}
		}
	}
`
export default function RightSide({ data, handleFavorites, isFavorite }) {
	return (
		<Section>
			<h1>{data.title.english || data.title.romaji}</h1>
			<div className="img-and-desc">
				<div className="mobile-img-cont">
					<img className="mobile-img" src={data.coverImage.extraLarge} alt="" />
				</div>
				<p dangerouslySetInnerHTML={{ __html: data.description }}></p>
			</div>
			<button
				disabled={isFavorite}
				className="add-btn"
				onClick={() => handleFavorites()}>
				{isFavorite ? "Added" : "Add to Favorites"}
			</button>
			<ul className="genres">
				{data.genres.map((genre, index) => (
					<Link key={index} to={`/search?genre=${genre}`}>
						{genre}
					</Link>
				))}
			</ul>
			{data.trailer && (
				<iframe
					allowFullScreen
					className="trailer"
					title={data.title}
					width="100%"
					height="350px"
					src={`https://www.youtube.com/embed/${data.trailer.id}`}></iframe>
			)}
		</Section>
	)
}
