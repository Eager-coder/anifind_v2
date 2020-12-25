import React from "react"
import styled from "styled-components"
const SettingsContainer = styled.div`
	h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
	}
`
export default function Settings() {
	return (
		<SettingsContainer>
			<h1>Settings</h1>
		</SettingsContainer>
	)
}
