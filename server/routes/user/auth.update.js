const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const bcrypt = require("bcrypt")
const checkAuth = require("../../middleware/auth.middleware")
router.put("/email", checkAuth, async (req, res) => {})

router.put("/password", checkAuth, async (req, res) => {
	const { email, oldPassword, newPassword } = req.body
	if (!email || !oldPassword || !newPassword)
		return res.status(400).json({ message: "No email or password" })

	if (newPassword.length < 8)
		return res
			.status(400)
			.json({ message: "Password must be at least 8 characters long" })
	try {
		const { rows } = await pool.query(`
      SELECT password FROM users WHERE email = '${email}'
    `)

		const isMatch = await bcrypt.compare(oldPassword, rows[0].password)

		if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

		const newHashedPassword = bcrypt.hashSync(newPassword, 10)

		await pool.query(`
      UPDATE users SET password = '${newHashedPassword}' WHERE email = '${email}'    
    `)
		return res.json({ message: "Password changed!" })
	} catch (e) {
		console.error("auth update", e)
		res.status(500).json({ message: "Someting went wrong" })
	}
})

module.exports = router
