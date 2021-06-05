import chalk from "chalk"
import { Request, Response, Router } from "express"
import pool from "../../config/db"
import { getUnixTimeNow } from "../../helpers/getTime"
import { checkAuth } from "../../middleware/auth.middleware"

const router = Router()

router.post("/thread/:thread_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { thread_id } = req.params
		const { user_id } = res.locals.user
		await pool.query(
			`
      INSERT INTO 
        discussions.thread_likes
        (thread_id, user_id, liked_at)
      VALUES
        ($1, $2, $3)
    `,
			[thread_id, user_id, getUnixTimeNow()]
		)
		res.json({ message: "Thread liked" })
	} catch (error) {
		console.log(chalk.red("LIKE THREAD"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/thread/:thread_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { thread_id } = req.params
		const { user_id } = res.locals.user
		await pool.query(
			`
      DELETE FROM
				discussions.thread_likes
			WHERE 
				thread_id = $1 AND user_id = $2	
    `,
			[thread_id, user_id]
		)
		res.json({ message: "Thread unliked" })
	} catch (error) {
		console.log(chalk.red("UNLIKE THREAD"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/post/:post_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { post_id } = req.params
		const { user_id } = res.locals.user
		await pool.query(
			`
      INSERT INTO 
        discussions.post_likes
        (post_id, user_id, liked_at)
      VALUES
        ($1, $2, $3)
    `,
			[post_id, user_id, getUnixTimeNow()]
		)
		res.json({ message: "Post liked" })
	} catch (error) {
		console.log(chalk.red("LIKE POST"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/post/:post_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { post_id } = req.params
		const { user_id } = res.locals.user
		await pool.query(
			`
     DELETE FROM
				discussions.post_likes
			WHERE 
				post_id = $1 AND user_id = $2	
    `,
			[post_id, user_id]
		)
		res.json({ message: "Post uniked" })
	} catch (error) {
		console.log(chalk.red("UNLIKE POST"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
