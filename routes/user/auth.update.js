const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const bcrypt = require("bcrypt")
const checkAuth = require("../../middleware/auth.middleware")

router.put("/username", checkAuth, async (req, res) => {
	const { newUsername } = req.body
	const { user_id } = req.user
	try {
		await pool.query(`UPDATE users SET username = '${newUsername}' 
			WHERE user_id = '${user_id}'
		`)
		res.json({ message: "Username has been changed!", data: newUsername })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/email", checkAuth, async (req, res) => {
	const { newEmail } = req.body
	const { user_id } = req.user
	try {
		const { rows } = await pool.query(`SELECT email FROM users`)
		const isExisting = rows.some(item => item.email === newEmail)
		if (isExisting)
			return res.status(400).json({ message: "Email is not available" })

		await pool.query(`UPDATE users SET email = '${newEmail}' 
			WHERE user_id = '${user_id}'
		`)
		res.json({ message: "Email has been updated!", data: newEmail })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

router.put("/password", checkAuth, async (req, res) => {
	const { email, user_id } = req.user

	const { oldPassword, newPassword } = req.body
	if (!oldPassword || !newPassword)
		return res.status(400).json({ message: "Please fill all the fields" })

	if (newPassword.length < 8)
		return res
			.status(400)
			.json({ message: "Password must be at least 8 characters long" })
	try {
		const { rows } = await pool.query(`
			SELECT password FROM users WHERE email = '${email}' 
			AND user_id = '${user_id}'
    `)

		const isMatch = await bcrypt.compare(oldPassword, rows[0].password)

		if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

		const newHashedPassword = bcrypt.hashSync(newPassword, 10)

		await pool.query(`
			UPDATE users SET password = '${newHashedPassword}' 
			WHERE email = '${email}' AND user_id = '${user_id}'
    `)
		return res.json({ message: "Password has been changed!" })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

module.exports = router
