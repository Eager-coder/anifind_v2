import styled from "styled-components"
import Avatar from "./Avatar"
import Credentials from "./Credentials"

export default function Settings() {
	return (
		<SettingsContainer>
			<h1>Settings</h1>
			<div>
				<Avatar />
				<Credentials />
			</div>
		</SettingsContainer>
	)
}

const SettingsContainer = styled.div`
	width: 100%;
`
