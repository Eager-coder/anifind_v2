import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { uploadAvatar } from "../../../redux/actions/userActions"
import { SHOW_MESSAGE } from "../../../redux/types"
import { PrimaryBtn } from "../../ButtonStyles"

export default function Avatar() {
	const inputRef = useRef()
	const [fileInput, setFileInput] = useState("")
	const [previewImg, setPreviewImg] = useState(null)
	const [b64Img, setB64Img] = useState(null)
	const [message, setMessage] = useState(null)
	const avatar = useSelector(state => state.user.avatar)
	const dispatch = useDispatch()

	const handleFileInput = e => {
		const file = e.target.files[0]
		if (!file) return
		if (file.size / 1024 > 1500) {
			setFileInput("")
			return dispatch({
				type: SHOW_MESSAGE,
				payload: { text: "Image size must not exceed 1.5MB", isSuccess: false },
			})
		}
		setMessage(null)
		setFileInput(e.target.value)
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onloadend = () => {
			setB64Img(reader.result)
			setPreviewImg(reader.result)
		}
		reader.onerror = () => {
			dispatch({
				type: SHOW_MESSAGE,
				payload: { text: "Something went wrong", isSuccess: false },
			})
		}
	}

	const handleSubmit = async () => {
		setMessage("Loading...")
		setFileInput("")
		if (!b64Img)
			return dispatch({
				type: SHOW_MESSAGE,
				payload: { text: "Please select an image", isSuccess: false },
			})
		dispatch(uploadAvatar(b64Img))
	}
	return (
		<Container>
			<h2>Avatar</h2>
			<div className="avatar">
				<InputSquare className="image" onClick={() => inputRef.current.click()}>
					<div className="line">
						<p>{message ? message : "Click to choose an image"}</p>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							defaultValue={fileInput}
							onChange={handleFileInput}
						/>
					</div>
				</InputSquare>
				{previewImg ? (
					<img className="image" src={previewImg} />
				) : (
					<img className="image" src={avatar} alt="" />
				)}
			</div>
			<PrimaryBtn disabled={!fileInput} onClick={handleSubmit}>
				Save
			</PrimaryBtn>
		</Container>
	)
}
const Container = styled.div`
	.avatar {
		display: flex;
		margin-bottom: 20px;
	}
	img {
		object-fit: cover;
		margin-left: 20px;
		border-radius: 4px;
	}
	.image {
		width: 250px;
		height: 250px;
	}
	@media (max-width: 1024px) {
		.image {
			width: 200px;
			height: 200px;
		}
	}
	@media (max-width: 480px) {
		.image {
			width: 130px;
			height: 130px;
		}
	}
`
const InputSquare = styled.div`
	cursor: pointer;
	border-radius: 4px;
	background: ${({ theme }) => theme.commentBg};
	padding: 20px;
	.line {
		width: 100%;
		height: 100%;
		border: 2px gray dashed;
		display: flex;
		justify-content: center;
		align-items: center;
		input {
			display: none;
		}
		p {
			text-align: center;
		}
	}
	@media (max-width: 480px) {
		padding: 10px;

		.line {
			p {
				font-size: 0.9rem;
			}
		}
	}
`
