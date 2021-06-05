import chalk from "chalk"
import { Request, Response, Router } from "express"
import { nanoid } from "nanoid"
import pool from "../../config/db"
import getNestedPosts, { Post } from "../../helpers/getNestedPosts"
import { getUnixTimeNow } from "../../helpers/getTime"
import { checkAuth, checkIsLoggedIn } from "../../middleware/auth.middleware"

const router = Router()

router.get("/:thread_id", checkIsLoggedIn, async (req: Request, res: Response) => {
	try {
		const { thread_id } = req.params
		const { isLoggedIn, user_id } = res.locals.user
		let posts: Array<Post>

		if (isLoggedIn) {
			posts = (
				await pool.query(
					`
					SELECT 
						posts.post_id, posts.user_id, parent_id, body, is_edited, 
						is_deleted, posts.created_at, users.avatar, users.username ,
						EXISTS (
							SELECT 1 FROM discussions.post_likes WHERE post_likes.user_id = $2 
							AND post_likes.post_id = posts.post_id) AS is_liked,
						COUNT(post_likes) AS like_count
					FROM 
						discussions.posts 
					LEFT JOIN users.users
						ON users.user_id = posts.user_id
					LEFT JOIN discussions.post_likes
						ON  posts.post_id = post_likes.post_id  
					WHERE 
						thread_id = $1
					GROUP BY posts.post_id, users.user_id`,
					[thread_id, user_id]
				)
			).rows
		} else {
			posts = (
				await pool.query(
					`
			SELECT 
				post_id, posts.user_id, parent_id, body, is_edited, 
				is_deleted, posts.created_at, users.avatar, users.username 
			FROM 
				discussions.posts 
			LEFT JOIN users.users
				ON users.user_id = posts.user_id
      WHERE 
				thread_id = $1`,
					[thread_id]
				)
			).rows
		}

		res.json({ data: getNestedPosts(posts) })
	} catch (error) {
		console.log(chalk.red("GET posts"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/:thread_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { thread_id } = req.params
		const { body, parent_id } = req.body
		const { user_id } = res.locals.user

		if (!thread_id?.trim() || !body?.trim())
			return res.status(400).json({ message: "Please fill all the fields" })
		const {
			rows: [thread],
		} = await pool.query(
			`
			SELECT thread_id 
			FROM discussions.threads 
			WHERE thread_id = $1 AND is_deleted = FALSE
			`,
			[thread_id]
		)
		if (!thread) return res.status(400).json({ message: "Thread does not exist" })

		await pool.query(
			`
			INSERT INTO discussions.posts 
    		(post_id, thread_id, user_id, parent_id, body, created_at)
    	VALUES 
				($1, $2, $3, $4, $5, $6)
    `,
			[nanoid(12), thread_id, user_id, parent_id, body, getUnixTimeNow()]
		)
		res.json({ message: "Post created" })
	} catch (error) {
		console.log(chalk.red("POST posts"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/:post_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { post_id } = req.params
		const { body } = req.body
		const { user_id } = res.locals.user
		if (!body?.trim()) return res.status(400).json({ message: "Please fill all the fields" })
		const {
			rows: [post],
		} = await pool.query(
			`
			SELECT 
				post_id 
			FROM 
				discussions.posts 
			WHERE 
				post_id = $1 AND user_id = $2 AND is_deleted = FALSE
			`,
			[post_id, user_id]
		)
		if (!post) return res.status(400).json({ message: "Post does not exist" })
		await pool.query(
			`
		UPDATE 
			discussions.posts 
		SET 
			body = $1, is_edited = TRUE 
		WHERE post_id = $2 AND user_id = $3`,
			[body, post_id, user_id]
		)
		res.json({ message: "Post updated!" })
	} catch (error) {
		console.log(chalk.red("PUT post"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:post_id", checkAuth, async (req: Request, res: Response) => {
	try {
		const { post_id } = req.params
		const { user_id } = res.locals.user
		const {
			rows: [post],
		} = await pool.query(
			`
			SELECT 
				post_id, parent_id
			FROM 
				discussions.posts 
			WHERE 
				post_id = $1 AND user_id = $2 AND is_deleted = FALSE
			`,
			[post_id, user_id]
		)
		if (!post) return res.status(400).json({ message: "Post does not exist" })
		const { rows: childPost } = await pool.query(
			`
				SELECT post_id FROM discussions.posts 
				WHERE parent_id = $1 LIMIT 1
			`,
			[post.post_id]
		)
		if (childPost.length) {
			await pool.query(
				`
				UPDATE 
					discussions.posts 
				SET 
					body = '[deleted]', is_deleted = TRUE
				WHERE 
					post_id = $1 AND user_id = $2`,
				[post_id, user_id]
			)
		} else {
			await pool.query(
				`
				DELETE FROM discussions.posts 
				WHERE post_id = $1 AND user_id = $2`,
				[post_id, user_id]
			)
		}

		res.json({ message: "Post deleted" })
	} catch (error) {
		console.log(chalk.red("DELETE post"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/like/:post_id", checkAuth, async (req: Request, res: Response) => {
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

router.delete("/unlike/:post_id", checkAuth, async (req: Request, res: Response) => {
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
