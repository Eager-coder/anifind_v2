import { useRef, useState } from "react"
import styled from "styled-components"
import { uploadAvatar } from "../../../api/user/user.update"
import { PrimaryBtn } from "../../ButtonStyles"

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
export default function Avatar({ user, setUser }) {
	const inputRef = useRef()
	const [fileInput, setFileInput] = useState("")
	const [previewImg, setPreviewImg] = useState(null)
	const [b64Img, setB64Img] = useState(null)
	const [message, setMessage] = useState(null)

	const handleFileInput = e => {
		const file = e.target.files[0]
		if (!file) return
		if (file.size / 1024 > 1500) {
			setFileInput("")
			return setMessage("Image size must not exceed 1.5MB")
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
			setMessage("Something went wrong!")
		}
	}

	const handleSubmit = async () => {
		setMessage("Loading...")
		setFileInput("")
		if (!b64Img) return setMessage("Please select an image")
		const { message, avatar } = await uploadAvatar(b64Img)
		setMessage(message)
		if (avatar) {
			setUser({ ...user, avatar })
		}
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
					<img className="image" src={user.avatar} alt="" />
				)}
			</div>
			<PrimaryBtn disabled={!fileInput} onClick={handleSubmit}>
				Save
			</PrimaryBtn>
		</Container>
	)
}
