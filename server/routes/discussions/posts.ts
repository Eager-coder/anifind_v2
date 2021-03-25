import chalk from "chalk"
import { Request, Response, Router } from "express"
import { nanoid } from "nanoid"
import pool from "../../config/db"
import checkAuth from "../../middleware/auth.middleware"
const router = Router()

router.post("/:thread_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { thread_id } = req.params
		const { body, parent_id } = req.body
		const { user_id } = res.locals.user

		if (!thread_id?.trim() || !body?.trim()) {
			return res.status(400).json({ message: "Please fill all the fields" })
		}

		await pool.query(
			`INSERT INTO discussions.posts 
    (post_id, thread_id, user_id, parent_id, body, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
			[
				nanoid(12),
				thread_id,
				user_id,
				parent_id,
				body,
				Math.floor(Date.now() / 1000),
			]
		)
		res.json({ message: "Post created" })
	} catch (error) {
		console.log(chalk.red("POST posts"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
