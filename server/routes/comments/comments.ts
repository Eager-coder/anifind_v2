import { Router } from "express"
import pool from "../../config/db"
const router = Router()
import checkAuth from "../../middleware/auth.middleware"
import chalk from "chalk"
router.get("/", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { rows } = await pool.query(
			`
			SELECT comments.text, comments.created_at, comments.comment_id, 
				comments.anime_id, comments.user_id, comments.is_edited
			FROM comments.comments, users.users WHERE comments.user_id = $1 
				AND comments.user_id = users.user_id
			ORDER BY comments.created_at DESC
			`,
			[user_id]
		)
		res.json({ data: rows })
	} catch (e) {
		console.error("GET USER COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.get("/anime/:anime_id", async (req, res) => {
	try {
		const { anime_id } = req.params
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

router.post("/", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { comment, anime_id } = req.body
		if (!comment) return res.status(404).json({ message: "No comment" })
		const date = Math.floor(new Date().getTime() / 1000)
		// const escapedComment = comment.replace(/'/g, "''")
		await pool.query(
			`
			INSERT INTO comments.comments (text, created_at, user_id, anime_id) 
			VALUES ($1, $2, $3, $4)
		`,
			[comment, date, user_id, anime_id]
		)
		res.json({ message: "Comment has added" })
	} catch (e) {
		console.error("~POST COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { newComment, comment_id } = req.body
		if (!newComment || !comment_id)
			return res.status(400).json({ message: "No comment found" })
		await pool.query(
			`
			UPDATE comments.comments SET text = $1, is_edited = true
			WHERE comment_id = $2 AND user_id = $3
		`,
			[newComment, comment_id, user_id]
		)

		res.json({ message: "Comment has been edited" })
	} catch (e) {
		console.error("Update COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:comment_id", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { comment_id } = req.params

		const { rows } = await pool.query(`
			SELECT * FROM comments.comments WHERE user_id = '${user_id}' 
			AND comment_id = '${comment_id}'
		`)
		if (
			rows[0].comment_id === Number(comment_id) &&
			rows[0].user_id == Number(user_id)
		) {
			await pool.query(`
				DELETE FROM comments.comments WHERE 
				comment_id = '${comment_id}' AND user_id = '${user_id}'
			`)
			res.json({ message: "Comment deleted" })
		} else {
			res.status(400).json({ message: "Something went wrong" })
		}
	} catch (e) {
		console.error("DELETE COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
