import { Router, Request, Response } from "express"
import pool from "../../config/db"
import { checkAuth } from "../../middleware/auth.middleware"
import { bgRed, red } from "chalk"
import { getUnixTimeNow } from "../../helpers/getTime"

const router = Router()

router.get("/", checkAuth, async (req: Request, res: Response) => {
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
router.get("/is_favorite/:anime_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { anime_id } = req.params
		const { rows: existing } = await pool.query(
			`
			SELECT * FROM favorites.favorite_anime 
			WHERE anime_id = $1 AND user_id = $2 LIMIT 1`,
			[anime_id, user_id]
		)
		return res.json({ data: { is_favorite: existing.length > 0 } })
	} catch (error) {
		console.log("IS FAV ANIME EXISTING ", error.message)
		res.status(500).json({ message: "oops!" })
	}
})

router.post("/", checkAuth, async (req: Request, res: Response) => {
	const { user_id } = res.locals.user
	const { anime_id, cover_image, title } = req.body
	try {
		await pool.query(
			`
      INSERT INTO favorites.favorite_anime 
				(anime_id, user_id, cover_image, title, created_at)
			VALUES 
				($1, $2, $3, $4, $5)
		`,
			[anime_id, user_id, cover_image, title, getUnixTimeNow()]
		)

		res.json({ message: "Added to Favorites!" })
	} catch (e) {
		console.error(bgRed("POST FAVORITE ANIME"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:anime_id", checkAuth, async (req: Request, res: Response) => {
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
		// const { rows } = await pool.query(
		// 	`SELECT * FROM favorites.favorite_anime WHERE user_id = '${user_id}'`
		// )
		res.json({ message: "Successfully deleted" })
	} catch (e) {
		console.log(red("DELETE FAVORITES", e))
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
