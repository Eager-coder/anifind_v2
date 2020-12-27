import styled from "styled-components"
const DiscussionsContainer = styled.section`
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
`
export default function Discussions({ user, setUser }) {
	return (
		<DiscussionsContainer>
			<h1>Discussions</h1>
			<p>Coming soon...</p>
		</DiscussionsContainer>
	)
}
