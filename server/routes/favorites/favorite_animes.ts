import { Router } from "express"
import pool from "../../config/db"
import checkAuth from "../../middleware/auth.middleware"
import { bgRed, red } from "chalk"

const router = Router()

router.get("/", checkAuth, async (req: any, res) => {
	const { user_id } = res.locals.user
	try {
		const { rows } = await pool.query(
			`
      SELECT * FROM favorites.favorite_anime WHERE user_id = $1 
			ORDER BY created_at DESC
		`,
			[user_id]
		)
		res.json({ data: rows })
	} catch (e) {
		console.error(bgRed("GET FAVORITES"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/", checkAuth, async (req: any, res) => {
	const { user_id } = res.locals.user
	const { anime_id, cover_image, title } = req.body
	try {
		await pool.query(
			`
      INSERT INTO favorites.favorite_anime (anime_id, user_id, cover_image, title)
			VALUES ($1, $2, $3, $4 )
		`,
			[anime_id, user_id, cover_image, title]
		)

		res.json({ message: "Added to Favorites!" })
	} catch (e) {
		console.error(bgRed("POST FAVORITE ANIME"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:anime_id", checkAuth, async (req: any, res) => {
	try {
		const { anime_id } = req.params
		const { user_id } = res.locals.user
		if (!anime_id) return res.status(404).json({ message: "Page id not found" })
		await pool.query(
			`
			DELETE FROM favorites.favorite_anime WHERE 
			anime_id = $1 AND user_id = $2
		`,
			[anime_id, user_id]
		)
		const { rows } = await pool.query(
			`SELECT * FROM favorites.favorite_anime WHERE user_id = '${user_id}'`
		)
		res.json({ message: "Successfully deleted", data: rows })
	} catch (e) {
		console.log(red("DELETE FAVORITES", e))
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
