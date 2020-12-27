import styled from "styled-components"

export const PrimaryBtn = styled.button`
	cursor: pointer;
	padding: 5px;
	background: #70c7a7;
	border-radius: 4px;
	border: none;
	color: white;
	:disabled {
		opacity: 0.4;
	}
`
export const GreenBtn = styled.button`
	color: #70c7a7;
	cursor: pointer;
	height: max-content;
	font-size: 0.9rem;
	border: none;
	background: none;
	:disabled {
		opacity: 0.4;
	}
`
export const RedBtn = styled.button`
	color: #c21616;

	cursor: pointer;
	height: max-content;
	font-size: 0.9rem;
	border: none;
	background: none;
	:disabled {
		opacity: 0.4;
	}
`
