import { Request, Response, Router } from "express"
import pool from "../../config/db"
import checkAuth from "../../middleware/auth.middleware"
import chalk, { red } from "chalk"
import { nanoid } from "nanoid"
const router = Router()

router.get("/:thread_id", async (req, res) => {
	const { thread_id } = req.params
	try {
		const { rows: thread } = await pool.query(
			`
    SELECT * FROM discussions.threads 
    WHERE thread_id = $1`,
			[thread_id]
		)
		res.json(thread)
	} catch (error) {
		console.log(chalk.red("GET THREAD"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/", checkAuth, async (req: Request, res: Response) => {
	const { topic, body } = req.body
	const { user_id } = res.locals.user
	try {
		await pool.query(
			`INSERT INTO discussions.threads 
			(therad_id, user_id, topic, body, created_at) 
			VALUES ($1, $2, $3, $4, $5) 
      `,
			[nanoid(12), user_id, topic, body, Math.floor(Date.now() / 1000)]
		)
		res.json({ message: "Discussion successfully opened" })
	} catch (error) {
		console.log(red("POST THREAD"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
export default router
