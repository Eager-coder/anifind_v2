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
export default function EmptyState() {
	return (
		<EmptyEl>
			<img src="/assets/images/no_results.png" alt="" />
			<h2>No results found</h2>
		</EmptyEl>
	)
}
