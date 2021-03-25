import ClipLoader from "react-spinners/ClipLoader"
import styled from "styled-components"

const LoadingEl = styled.div`
	width: 100%;
	padding-top: ${({ padding }) => padding || "0"}px;
	display: flex;
	justify-content: center;
	align-items: center;
`
export default function LoadingSpinner({ size, padding }) {
	return (
		<LoadingEl padding={padding}>
			<ClipLoader color="#70c7a7" size={size || 50} />
		</LoadingEl>
	)
}
