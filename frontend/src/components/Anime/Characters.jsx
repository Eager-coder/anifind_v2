import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

export default function Characters({ data }) {
	return (
		<Section>
			<h2>Main characters</h2>
			<div className="characters-container">
				{data.characters.edges.map(
					({
						node: {
							name: { full: name },
							image,
						},
					}) => (
						<div className="character-card" key={name}>
							<img src={image.large} alt={name} />
							<p>{name}</p>
						</div>
					)
				)}
			</div>
		</Section>
	)
}
const Section = styled.section`
	max-width: 1200px;
	padding: 0 50px;
	margin: 20px auto;
	h2 {
		margin: 20px 0;
		padding: 0;
		font-size: 2.5rem;
		font-weight: 600;
		color: ${({ theme }) => theme.header};
	}
	.characters-container {
		display: grid;
		grid-template-columns: repeat(6, minmax(120px, 1fr));
		justify-content: space-between;
		column-gap: 20px;
		row-gap: 20px;
		.character-card {
			img {
				border-radius: 5px;
				width: 100%;
				height: 210px;
				object-fit: cover;
			}
			p {
				color: ${({ theme }) => theme.text};
			}
		}
	}
	@media screen and (max-width: 1024px) {
		.characters-container {
			grid-template-columns: repeat(5, minmax(120px, 1fr));
		}
	}
	@media screen and (max-width: 900px) {
		.characters-container {
			.character-card {
				img {
					height: 200px;
				}
			}
		}
	}
	@media screen and (max-width: 768px) {
		padding: 0 20px;
		h2 {
			margin: 20px 0;
			font-size: 1.8rem;
			font-weight: 600;
		}
		.characters-container {
			grid-template-columns: repeat(4, minmax(100px, 1fr));
		}
	}
	@media screen and (max-width: 620px) {
		.characters-container {
			grid-template-columns: repeat(4, minmax(80px, 1fr));
			.character-card {
				img {
					height: 150px;
				}
			}
		}
	}
	@media screen and (max-width: 480px) {
		.characters-container {
			grid-template-columns: repeat(3, 1fr);
			.character-card {
				p {
					font-size: 0.8rem;
				}
				img {
					height: 170px;
				}
			}
		}
	}
	@media screen and (max-width: 400px) {
		.characters-container {
			grid-template-columns: repeat(3, 1fr);
			.character-card {
				img {
					height: 140px;
				}
			}
		}
	}
`
