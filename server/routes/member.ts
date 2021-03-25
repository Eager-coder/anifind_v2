import { Router } from "express"
import pool from "../config/db"
const router = Router()
// const checkAuth = require("../middleware/auth.middleware")
import { bgRed } from "chalk"

router.get("/:username", async (req, res) => {
	// const { user_id } = res.locals.user
	const { username } = req.params

	try {
		const { rows: user } = await pool.query(
			`
      SELECT user_id, username, avatar, about,  
      created_at, about FROM users.users 
			WHERE username = $1`,
			[username]
		)

		const { rows: favorites } = await pool.query(
			`
      SELECT anime_id, cover_image, title 
      FROM favorites.favorite_anime WHERE user_id = $1`,
			[user[0].user_id]
		)
		res.json({ data: { user: user[0], favorites } })
	} catch (e) {
		console.error(bgRed("GET PROFILE"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
