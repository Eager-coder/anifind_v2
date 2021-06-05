import { Router } from "express"
import pool from "../../config/db"
const router = Router()
import { checkAuth } from "../../middleware/auth.middleware"
import { red } from "chalk"
import { getUnixTimeNow } from "../../helpers/getTime"

router.get("/", checkAuth, async (req: any, res) => {
	const { user_id } = res.locals.user
	try {
		const { rows: characters } = await pool.query(`
    SELECT * FROM favorites.favorite_characters WHERE user_id = '${user_id}'`)
		res.json({ data: characters })
	} catch (error) {
		console.log(red("GET FAV_CHARACTERS", error))
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.get("/is_favorite/:character_id", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { character_id } = req.params
		const { rows: existing } = await pool.query(
			`
    SELECT character_id FROM favorites.favorite_characters 
		WHERE user_id = $1 AND character_id = $2`,
			[user_id, character_id]
		)
		res.json({ data: { is_favorite: existing.length > 0 } })
	} catch (error) {
		console.log(red("GET FAV_CHARACTERS", error))
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/", checkAuth, async (req: any, res) => {
	const { user_id } = res.locals.user
	try {
		const { character_id, cover_image, name } = req.body
		if (!character_id || !user_id || !cover_image || !name)
			return res.status(400).json({ message: "Please fill all the fields" })
		await pool.query(
			`
			INSERT INTO favorites.favorite_characters 
      (character_id, user_id, cover_image, name, created_at) 
			VALUES ($1, $2, $3, $4, $5)
			`,
			[character_id, user_id, cover_image, name, getUnixTimeNow()]
		)
		return res.json({ message: "Added to Favorites" })
	} catch (error) {
		console.log(red("POST FAV_CHARACTERS", error))
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.delete("/:character_id", checkAuth, async (req: any, res) => {
	const { character_id } = req.params
	const { user_id } = res.locals.user
	try {
		await pool.query(
			`
		DELETE FROM favorites.favorite_characters 
		WHERE character_id = $1 AND user_id = $2
	`,
			[character_id, user_id]
		)
		res.json({ message: "Deleted from Favorites" })
	} catch (error) {
		console.log(red("DELETE FAV_CHARACTERS", error))
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
