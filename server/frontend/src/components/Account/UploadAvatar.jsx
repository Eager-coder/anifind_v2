import { useState } from "react"
import { uploadAvatar } from "../../api/user/user.update"
import styled from "styled-components"
export default function UploadAvatar({ user, setUser }) {
	const [fileInput, setFileInput] = useState("")
	const [previewImg, setPreviewImg] = useState(null)
	const [b64Img, setB64Img] = useState(null)
	const [message, setMessage] = useState(null)

	const handleFileInput = e => {
		const file = e.target.files[0]
		if (file.size / 1024 > 1500) {
			setFileInput("")
			return setMessage("Image size must not exceed 1.5MB")
		}
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

	const handleSubmit = async e => {
		e.preventDefault()
		setMessage("Loading...")
		setPreviewImg(null)
		if (!b64Img) return setMessage("Please select an image")
		const { message, avatar } = await uploadAvatar(b64Img)
		setMessage(message)
		if (avatar) {
			setUser({ ...user, avatar })
		}
	}

	return (
		<div className="img-upload">
			<h1 className="title">Upload an Image</h1>
			<div>{message}</div>
			<form onSubmit={handleSubmit} className="form">
				<input
					type="file"
					accept="image/*"
					onChange={handleFileInput}
					value={fileInput}
					className="form-input"
				/>
				<button className="btn" type="submit">
					Submit
				</button>
			</form>
			{previewImg && (
				<img src={b64Img} alt="chosen" style={{ height: "300px" }} />
			)}
		</div>
	)
}
