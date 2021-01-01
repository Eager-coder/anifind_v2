const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const checkAuth = require("../../middleware/auth.middleware")
const chalk = require("chalk")

router.get("/", checkAuth, async (req, res) => {
	const { user_id } = req.user
	try {
		const { rows } = await pool.query(`
      SELECT * FROM favorites WHERE user_id = '${user_id}' ORDER BY created_at DESC
    `)
		res.json({ data: rows })
	} catch (e) {
		console.error(chalk.bgRed("GET FAVORITES"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/", checkAuth, async (req, res) => {
	const { user_id } = req.user
	const { page_id, cover_image, title } = req.body
	try {
		await pool.query(`
      INSERT INTO favorites (page_id, user_id, cover_image, title)
			VALUES ('${page_id}','${user_id}','${cover_image}','${title}')
		`)

		res.json({ message: "Added to Favorites!" })
	} catch (e) {
		console.error(chalk.bgRed("POST FAVORITES"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:page_id", checkAuth, async (req, res) => {
	try {
		const { page_id } = req.params
		const { user_id } = req.user
		if (!page_id) return res.status(404).json({ message: "Page id not found" })
		await pool.query(`
			DELETE FROM favorites WHERE 
			page_id = ${page_id} AND user_id = ${user_id}
		`)
		const { rows } = await pool.query(
			`SELECT * FROM favorites WHERE user_id = '${user_id}'`
		)
		res.json({ message: "Successfully deleted", data: rows })
	} catch (e) {
		console.log(chalk.red("DELETE FAVORITES", e))
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
