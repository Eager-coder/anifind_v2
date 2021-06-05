import chalk from "chalk"
import { Router, Request, Response } from "express"
import pool from "../../config/db"
import { getUnixTimeNow } from "../../helpers/getTime"
import { checkAuth } from "../../middleware/auth.middleware"
const router = Router()

router.get("/user", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { rows } = await pool.query(
			`
			SELECT anime_comments.text, anime_comments.created_at, anime_comments.comment_id, 
				anime_comments.anime_id, anime_comments.user_id, anime_comments.is_edited
			FROM comments.anime_comments, users.users WHERE anime_comments.user_id = $1 
				AND anime_comments.user_id = users.user_id
			ORDER BY anime_comments.created_at DESC
			`,
			[user_id]
		)
		res.json({ data: rows })
	} catch (e) {
		console.error("GET USER COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.get("/:anime_id", async (req, res) => {
	console.log(req.params)
	try {
		const { anime_id } = req.params
		if (!anime_id) return res.status(404).json({ message: "Page not found" })
		const { rows: allComments } = await pool.query(
			`
			SELECT users.username, users.avatar, anime_comments.is_edited,
				anime_comments.text, anime_comments.created_at,
				anime_comments.comment_id, anime_comments.user_id, anime_comments.anime_id 
			FROM comments.anime_comments, users.users WHERE anime_comments.anime_id = $1 
				AND anime_comments.user_id = users.user_id
			ORDER BY anime_comments.created_at DESC
			
		`,
			[anime_id]
		)
		res.json({ data: allComments })
	} catch (error) {
		console.error(chalk.red("GET ANIME PAGE COMMENT"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/:anime_id", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { anime_id } = req.params
		const { comment } = req.body

		if (!comment) return res.status(404).json({ message: "No comment" })
		await pool.query(
			`
			INSERT INTO comments.anime_comments 
				(text, created_at, user_id, anime_id) 
			VALUES 
				($1, $2, $3, $4)
		`,
			[comment, getUnixTimeNow(), user_id, anime_id]
		)
		res.json({ message: "Comment has added" })
	} catch (e) {
		console.error("~POST COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/:comment_id", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { comment_id } = req.params
		const { newComment } = req.body
		if (!newComment || !comment_id) return res.status(400).json({ message: "No comment found" })
		await pool.query(
			`
			UPDATE comments.anime_comments SET text = $1, is_edited = true
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

router.delete("/:comment_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { comment_id } = req.params
		const { rows } = await pool.query(
			`
			SELECT comment_id
			FROM 
				comments.anime_comments 
			WHERE 
				user_id = $1 AND comment_id = $2
		`,
			[user_id, comment_id]
		)

		if (!rows.length) {
			return res.status(404).json({ message: "Comment not found" })
		}

		await pool.query(
			`
			DELETE FROM 
				comments.anime_comments 
			WHERE 
				comment_id = $1 AND user_id = $2
		`,
			[comment_id, user_id]
		)

		res.json({ message: "Comment deleted" })
	} catch (error) {
		console.error("DELETE ANIME COMMENT", error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
