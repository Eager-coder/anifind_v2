// import { useState } from "react"
// import { H2 } from "../styles/Styles"

// export default function UpdatePassword() {
// 	// password update
// 	const [oldPassword, setOldPass] = useState("")
// 	const [newPassword, setNewPass] = useState("")
// 	const updatePassword = async e => {
// 		e.preventDefault()
// 		const res = await fetch("http://localhost:80/api/user/update/password", {
// 			headers: {
// 				Accept: "application/json",
// 				"Content-Type": "application/json",
// 			},
// 			method: "PUT",
// 			body: JSON.stringify({
// 				email: user.email,
// 				oldPassword,
// 				newPassword,
// 				token: localStorage.getItem("auth"),
// 			}),
// 		})
// 		if (res.ok) {
// 			localStorage.removeItem("auth")
// 			setUser(null)
// 		}
// 		const json = await res.json()
// 		console.log(json)
// 	}
// 	return (
// 		<div className="password-update">
// 			<H2>Update password</H2>
// 			<form onSubmit={updatePassword}>
// 				<input
// 					defaultValue={oldPassword}
// 					placeholder="old pass"
// 					onChange={e => setOldPass(e.target.value)}
// 					type="password"
// 					name="password"
// 				/>
// 				<input
// 					defaultValue={newPassword}
// 					onChange={e => setNewPass(e.target.value)}
// 					type="password"
// 					name="password"
// 				/>
// 				<button type="submit">update</button>
// 			</form>
// 		</div>
// 	)
// }
