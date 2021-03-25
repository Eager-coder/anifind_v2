import chalk from "chalk"
import { Router } from "express"
import pool from "../config/db"
const router = Router()

router.get("/", async (req, res) => {
	try {
		const { anime_id } = req.query
		if (!anime_id) return res.status(404).json({ message: "Page not found" })
		const { rows: allComments } = await pool.query(
			`
			SELECT users.username, users.avatar, comments.is_edited,
				comments.text, comments.created_at,
				comments.comment_id, comments.user_id, comments.anime_id 
			FROM comments.comments, users.users WHERE comments.anime_id = $1 
				AND comments.user_id = users.user_id
			ORDER BY comments.created_at DESC
			
		`,
			[anime_id]
		)
		res.json({ data: allComments })
	} catch (error) {
		console.error(chalk.red("GET ANIME PAGE COMMENT"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
