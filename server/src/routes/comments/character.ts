import chalk from "chalk"
import { Router, Request, Response } from "express"
import pool from "../../config/db"
import { checkAuth } from "../../middleware/auth.middleware"
import { getUnixTimeNow } from "../../helpers/getTime"
const router = Router()

router.get("/user", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { rows: characters } = await pool.query(
			`
			SELECT 
				username, avatar, is_edited, text, character_comments.created_at, 
				comment_id, users.user_id, character_id
			FROM 
				comments.character_comments 
			LEFT JOIN users.users
			ON users.user_id = character_comments.user_id
			WHERE character_comments.user_id = $1
			ORDER BY character_comments.created_at DESC
		`,
			[user_id]
		)
		res.json({ data: characters })
	} catch (error) {
		console.error(chalk.red("GET USER CHARACTER COMMENT"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.get("/:character_id", async (req, res) => {
	try {
		const { character_id } = req.params
		if (!character_id) {
			return res.status(404).json({ message: "Page not found" })
		}
		const { rows: allComments } = await pool.query(
			`
			SELECT users.username, users.avatar, character_comments.is_edited,
				character_comments.text, character_comments.created_at,
				character_comments.comment_id, character_comments.user_id, character_comments.character_id 
			FROM 
				comments.character_comments, users.users 
			WHERE 
				character_comments.character_id = $1 
				AND character_comments.user_id = users.user_id
			ORDER BY character_comments.created_at DESC
			
		`,
			[character_id]
		)
		res.json({ data: allComments })
	} catch (error) {
		console.error(chalk.red("GET CHARACTER COMMENT"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/:character_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { character_id } = req.params
		const { comment } = req.body

		if (!comment?.trim().length) {
			return res.status(404).json({ message: "No comment" })
		}

		await pool.query(
			`
			INSERT INTO
				comments.character_comments
			 	(text, character_id, user_id, created_at) 
			VALUES 
				($1, $2, $3, $4)
		`,
			[comment, character_id, user_id, getUnixTimeNow()]
		)
		res.json({ message: "Comment has added" })
	} catch (e) {
		console.error("~POST COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.put("/:comment_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { comment_id } = req.params
		const { new_comment } = req.body
		if (!new_comment || !comment_id) {
			return res.status(404).json({ message: "No comment found" })
		}
		const { rows: existingComment } = await pool.query(
			`
		SELECT 
			comment_id FROM comments.character_comments 
		WHERE 
			comment_id = $1 AND user_id = $2
		`,
			[comment_id, user_id]
		)
		if (!existingComment.length) {
			return res.status(404).json({ message: "No comment found" })
		}
		await pool.query(
			`
			UPDATE 
				comments.character_comments 
			SET 
				text = $1, is_edited = true
			WHERE 
				comment_id = $2 AND user_id = $3
		`,
			[new_comment, comment_id, user_id]
		)

		res.json({ message: "Comment has been edited" })
	} catch (error) {
		console.error("UPDATE CHARACTER COMMENT", error.message)
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
				comments.character_comments 
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
				comments.character_comments 
			WHERE 
				comment_id = $1 AND user_id = $2
		`,
			[comment_id, user_id]
		)

		res.json({ message: "Comment deleted" })
	} catch (error) {
		console.error("DELETE CHARACTER COMMENT", error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
export default router
