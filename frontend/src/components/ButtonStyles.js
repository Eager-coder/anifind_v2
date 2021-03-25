import styled from "styled-components"
import BeatLoader from "react-spinners/BeatLoader"
const ButtonEl = styled.button`
	cursor: pointer;
	background: #70c7a7;
	border-radius: 4px;
	border: none;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	:disabled {
		opacity: 0.6;
	}
	${({ customStyle }) => customStyle}
`
export function PrimaryBtn({
	disabled,
	isLoading,
	onClick,
	spinnerSize,
	customStyle,
	children,
}) {
	return (
		<ButtonEl
			onClick={onClick}
			isLoading={isLoading}
			disabled={disabled}
			customStyle={customStyle}>
			{isLoading ? (
				<BeatLoader color="white" size={spinnerSize || 10} />
			) : (
				children
			)}
		</ButtonEl>
	)
}
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
