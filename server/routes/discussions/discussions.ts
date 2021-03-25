import { Router, Request, Response } from "express"
import pool from "../../config/db"
import checkAuth from "../../middleware/auth.middleware"
import chalk from "chalk"
import { nanoid } from "nanoid"
const router = Router()

interface Post {
	post_id: String
	parent_id: String
	created_at: Number
	children: Array<Post>
}

function getNestedPosts(posts: Array<Post>) {
	let fetchedPosts = new Set()

	function dfs(post: Post) {
		post.children = []
		fetchedPosts.add(post.post_id)
		posts.forEach((post2: Post) => {
			if (!fetchedPosts.has(post2.post_id) && post2.parent_id == post.post_id) {
				post.children.push(dfs(post2))
			}
		})
		post.children.sort(function (a: any, b: any) {
			return a.created_at > b.created_at ? 1 : -1
		})
		return post
	}
	let nested = []
	for (let post of posts) {
		if (!fetchedPosts.has(post.post_id) && post.parent_id === null) {
			nested.push(dfs(post))
		}
	}
	nested.sort(function (a, b) {
		return a.created_at > b.created_at ? 1 : -1
	})
	return nested
}
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
		AND threads.is_deleted = FALSE`)
		return res.json({ data: threads })
	} catch (err) {
		console.log("GET DISCUSSIONS", err.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.get("/thread/:thread_id", async (req, res) => {
	const { thread_id } = req.params
	try {
		const {
			rows: [thread],
		} = await pool.query(
			`
    SELECT 
			username, avatar, threads.user_id, thread_id, 
			topic, body, is_edited, threads.created_at   
		FROM 
			discussions.threads, users.users 
    WHERE thread_id = $1 AND users.user_id = threads.user_id`,
			[thread_id]
		)

		const { rows: posts } = await pool.query(
			`
			SELECT 
				post_id, posts.user_id, parent_id, body, is_edited, 
				is_deleted, posts.created_at, users.avatar, users.username 
			FROM 
				discussions.posts, users.users 
      WHERE 
				thread_id = $1`,
			[thread_id]
		)
		res.json({ data: { thread, posts: getNestedPosts(posts) } })
	} catch (error) {
		console.log(chalk.red("GET THREAD"), error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

// router.post("/", checkAuth, async (req: any, res) => {
// 	const { body, topic } = req.body
// 	const { user_id } = res.locals.user
// 	if (!body?.trim() || !topic?.trim())
// 		return res.status(400).json({ message: "Please fill all the fields" })
// 	console.log(body, topic)
// 	try {
// 		await pool.query(
// 			`
// 			INSERT INTO discussions.threads
// 				(thread_id, user_id, topic, body, created_at)
// 			VALUES ($1, $2, $3, $4, $5)
//       `,
// 			[nanoid(12), user_id, topic, body, Math.floor(Date.now() / 1000)]
// 		)
// 		res.json({ message: "Discussion successfully opened" })
// 	} catch (error) {
// 		console.log(chalk.red("POST THREAD"), error)
// 		res.status(500).json({ message: "Something went wrong" })
// 	}
// })
router.put(
	"/thread/:thread_id",
	checkAuth,
	async (req: Request, res: Response) => {
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
			const { body } = req.body
			if (!body.trim())
				return res.status(400).json({ message: "Noting is written" })

			await pool.query(
				`
				UPDATE discussions.threads 
				SET body = $1 AND is_edited = TRUE 
				WHERE thread_id = $2 AND user_id = $3
				`,
				[body, thread_id, user_id]
			)
			res.json({ message: "Updated successfully" })
		} catch (error) {
			console.log(chalk.red("UPDATE THREAD"), error)
			res.status(500).json({ message: "Something went wrong" })
		}
	}
)
export default router
