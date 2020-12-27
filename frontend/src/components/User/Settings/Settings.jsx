import styled from "styled-components"
import Avatar from "./Avatar"
import Credentials from "./Credentials"

export default function Settings({ user, setUser }) {
	return (
		<SettingsContainer>
			<h1>Settings</h1>
			<div>
				<Avatar user={user} setUser={setUser} />
				<Credentials user={user} setUser={setUser} />
			</div>
		</SettingsContainer>
	)
}

const SettingsContainer = styled.div`
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
`
