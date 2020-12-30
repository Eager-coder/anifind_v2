const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const checkAuth = require("../../middleware/auth.middleware")
const chalk = require("chalk")

router.get("/", checkAuth, async (req, res) => {
	const { user_id } = req.user
	try {
		const { rows } = await pool.query(`
      SELECT created_at, about FROM users WHERE user_id = '${user_id}'
    `)
		res.json({ data: rows[0] })
	} catch (e) {
		console.error(chalk.bgRed("GET PROFILE"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/about", checkAuth, async (req, res) => {
	const { user_id } = req.user
	const { newAbout } = req.body
	try {
		await pool.query(`
			UPDATE users SET about = '${newAbout.replace(/'/g, "''")}'
			WHERE user_id = '${user_id}'
		`)

		res.json({ message: "Successfully uploaded!", data: newAbout })
	} catch (e) {
		console.error(chalk.bgRed("PUT ABOUT"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
