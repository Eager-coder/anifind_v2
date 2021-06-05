import { Router } from "express"
import pool from "../../config/db"
const router = Router()
import { compare, hashSync } from "bcrypt"
import { checkAuth } from "../../middleware/auth.middleware"

router.put("/username", checkAuth, async (req, res) => {
	try {
		const { newUsername } = req.body
		const { user_id } = res.locals.user
		if (!newUsername?.trim()) return res.status(400).json({ message: "Please fill all the fields" })
		await pool.query(
			`
			UPDATE users.users SET username = $1 
			WHERE user_id = $2`,
			[newUsername, user_id]
		)
		res.json({ message: "Username has been changed!" })
	} catch (e) {
		console.error("AUTH UPDATE USERNAME", e.message)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/email", checkAuth, async (req, res) => {
	const { newEmail } = req.body
	const { user_id } = res.locals.user
	if (!newEmail?.trim()) return res.status(400).json({ message: "Please fill all the fields" })
	try {
		const { rows } = await pool.query(
			`
			SELECT email FROM users.users WHERE email = $1`,
			[newEmail?.trim()]
		)
		const isExisting = rows.some(item => item.email === newEmail)
		if (isExisting) return res.status(400).json({ message: "Email is not available" })

		await pool.query(
			`
			UPDATE users.users SET email = $1 
			WHERE user_id = $2
		`,
			[newEmail, user_id]
		)
		res.json({ message: "Email has been updated!" })
	} catch (e) {
		console.error("AUTH UPDATE EMAIL", e.message)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/password", checkAuth, async (req, res) => {
	try {
		const { user_id } = res.locals.user
		let { oldPassword, newPassword } = req.body
		oldPassword = oldPassword?.trim() || null
		newPassword = newPassword?.trim() || null

		if (!oldPassword || !newPassword)
			return res.status(400).json({ message: "Please fill all the fields" })
		if (oldPassword === newPassword)
			return res.status(400).json({ message: "Current and new passwords cannot be the same" })
		if (newPassword.length < 8)
			return res.status(400).json({ message: "Password must be at least 8 characters long" })
		const { rows } = await pool.query(
			`
			SELECT password FROM users.users 
			WHERE user_id = $1
    `,
			[user_id]
		)

		const isMatch = await compare(oldPassword, rows[0].password)

		if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

		const newHashedPassword = hashSync(newPassword, 10)

		await pool.query(
			`
			UPDATE users.users SET password = $1 
			WHERE user_id = $2
    `,
			[newHashedPassword, user_id]
		)
		return res.json({ message: "Password has been changed!" })
	} catch (e) {
		console.error("AUTH UPDATE PASSWORD", e.message)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

export default router
