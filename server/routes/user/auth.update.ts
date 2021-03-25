import { Router } from "express"
import pool from "../../config/db"
const router = Router()
import { compare, hashSync } from "bcrypt"
import checkAuth from "../../middleware/auth.middleware"
const query = pool.query

router.put("/username", checkAuth, async (req, res) => {
	const { data: newUsername } = req.body
	const { user_id } = res.locals.user
	if (!newUsername)
		return res.status(400).json({ message: "Please fill all the fields" })
	try {
		await query(`UPDATE users SET username = '${newUsername}' 
			WHERE user_id = '${user_id}'`)
		res.json({ message: "Username has been changed!", data: newUsername })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/email", checkAuth, async (req, res) => {
	const { data: newEmail } = req.body
	const { user_id } = res.locals.user
	if (!newEmail)
		return res.status(400).json({ message: "Please fill all the fields" })
	try {
		const { rows } = await query(`SELECT email FROM users.users`)
		const isExisting = rows.some(item => item.email === newEmail)
		if (isExisting)
			return res.status(400).json({ message: "Email is not available" })

		await query(`UPDATE users SET email = '${newEmail}' 
			WHERE user_id = '${user_id}'
		`)
		res.json({ message: "Email has been updated!", data: newEmail })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/password", checkAuth, async (req, res) => {
	const { email, user_id } = res.locals.user

	const { oldPassword, newPassword } = req.body.data
	if (!oldPassword || !newPassword)
		return res.status(400).json({ message: "Please fill all the fields" })
	if (oldPassword === newPassword)
		return res
			.status(400)
			.json({ message: "Current and new passwords cannot be the same" })
	if (newPassword.length < 8)
		return res
			.status(400)
			.json({ message: "Password must be at least 8 characters long" })
	try {
		const { rows } = await query(`
			SELECT password FROM users.users WHERE email = '${email}' 
			AND user_id = '${user_id}'
    `)

		const isMatch = await compare(oldPassword, rows[0].password)

		if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

		const newHashedPassword = hashSync(newPassword, 10)

		await query(`
			UPDATE users.users SET password = '${newHashedPassword}' 
			WHERE email = '${email}' AND user_id = '${user_id}'
    `)
		return res.json({ message: "Password has been changed!" })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

export default router
