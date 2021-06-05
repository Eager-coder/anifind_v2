import { Request, Response, Router } from "express"
import pool from "../../config/db"
import { checkAuth, checkIsLoggedIn } from "../../middleware/auth.middleware"
import chalk from "chalk"
import { nanoid } from "nanoid"
import getNestedPosts from "../../helpers/getNestedPosts"
import { getUnixTimeNow } from "../../helpers/getTime"
import { threadWithoutUserQuery, threadWithUserQuery } from "../../helpers/query"
const router = Router()

router.get("/all", async (_req: Request, res: Response) => {
	try {
		const { rows: threads } = await pool.query(`
	SELECT 
		username, avatar, threads.user_id, thread_id, 
		topic, body, is_edited, threads.created_at 
	FROM 
		discussions.threads, users.users
	WHERE 
		threads.user_id = users.user_id 
		AND threads.is_deleted = FALSE
	ORDER BY created_at DESC`)
		return res.json({ data: threads })
	} catch (err) {
		console.log("GET DISCUSSIONS", err.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
// not finished
router.get("/user", checkAuth, async (req: Request, res: Response) => {
	try {
		const { user_id } = res.locals.user
		const { rows: threads } = await pool.query(
			`
		SELECT 
			thread_id, topic, is_edited, created_at 
		FROM discussions.threads
		WHERE is_deleted = FALSE AND user_id = $1 
		`,
			[user_id]
		)
		res.json({ data: threads })
	} catch (error) {
		console.log("GET USER DISCUSSIONS", error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.get("/:thread_id", checkIsLoggedIn, async (req, res) => {
	const { thread_id } = req.params
	const { isLoggedIn, user_id } = res.locals.user
	try {
		let thread

		if (isLoggedIn) {
			thread = (await pool.query(threadWithUserQuery, [thread_id, user_id])).rows[0]
		} else {
			thread = (await pool.query(threadWithoutUserQuery, [thread_id])).rows[0]
		}
		res.json({ data: thread })
	} catch (error) {
		console.log(chalk.red("GET THREAD"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/", checkAuth, async (req: Request, res: Response) => {
	try {
		const { topic, body } = req.body
		const { user_id } = res.locals.user
		if (!topic?.trim() || !body?.trim())
			return res.status(400).json({ message: "Please fill all the fields" })
		const thread_id = nanoid(12)
		await pool.query(
			`INSERT INTO discussions.threads 
			(thread_id, user_id, topic, body, created_at) 
			VALUES ($1, $2, $3, $4, $5) 
      `,
			[thread_id, user_id, topic, body, getUnixTimeNow()]
		)
		res.json({ message: "Discussion successfully opened", data: { thread_id } })
	} catch (error) {
		console.log(chalk.red("POST THREAD"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/:thread_id", checkAuth, async (req: Request, res: Response) => {
	const { thread_id } = req.params
	const { user_id } = res.locals.user
	const { body, topic } = req.body
	try {
		if (!body?.trim() || !topic?.trim())
			return res.status(400).json({ message: "Please fill all the fields" })

		const {
			rows: [thread],
		} = await pool.query(
			`
				SELECT * FROM discussions.threads 
				WHERE thread_id = $1 AND user_id = $2
				`,
			[thread_id, user_id]
		)
		if (!thread) return res.status(400).json({ message: "No thread found" })

		await pool.query(
			`
				UPDATE discussions.threads 
				SET topic = $1, body = $2, is_edited = TRUE 
				WHERE thread_id = $3 AND user_id = $4
				`,
			[topic, body, thread_id, user_id]
		)
		res.json({ message: "Updated successfully" })
	} catch (error) {
		console.log(chalk.red("UPDATE THREAD"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.delete("/:thread_id", checkAuth, async (req: Request, res: Response) => {
	const { thread_id } = req.params
	const { user_id } = res.locals.user
	try {
		const {
			rows: [thread],
		} = await pool.query(
			`
				SELECT * FROM discussions.threads 
				WHERE thread_id = $1 AND user_id = $2
				`,
			[thread_id, user_id]
		)
		if (!thread) return res.status(400).json({ message: "No thread found" })

		await pool.query(
			`
			UPDATE 
				discussions.threads 
			SET 
				topic = '[deleted]', body = '[deleted]', is_deleted = TRUE 
			WHERE 
				thread_id = $1 AND user_id = $2
		`,
			[thread_id, user_id]
		)
		res.json({ message: "Deleted successfully" })
	} catch (error) {
		console.log(chalk.red("DELETE THREAD"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/like/:thread_id", checkAuth, async (req: Request, res: Response) => {
	const { thread_id } = req.params
	const { user_id } = res.locals.user
	try {
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
		console.log("thread liked")

		res.json({ message: "Thread liked" })
	} catch (error) {
		console.log("LIKE THREAD", error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.delete("/like/:thread_id", checkAuth, async (req: Request, res: Response) => {
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
		console.log("thread unliked")

		res.json({ message: "Thread unliked" })
	} catch (error) {
		console.log(chalk.red("UNLIKE THREAD"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
