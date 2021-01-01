import styled from "styled-components"

const EmptyEl = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	img {
		max-width: 200px;
		margin-bottom: 20px;
	}
`
export default function EmptyState({ src, header }) {
	return (
		<EmptyEl>
			<img src={src} alt="" />
			<h2>{header}</h2>
		</EmptyEl>
	)
}
