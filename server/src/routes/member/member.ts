import { Request, Response, Router } from "express"
import pool from "../../config/db"
const router = Router()
import { bgRed } from "chalk"
import { checkAuth, checkIsLoggedIn } from "../../middleware/auth.middleware"

router.get("/:username", checkIsLoggedIn, async (req: Request, res: Response) => {
	// const { user_id } = res.locals.user
	const { username } = req.params

	try {
		const { rows: user } = await pool.query(
			`
      SELECT 
				user_id, username, avatar AS avatar_url, about, created_at 
			FROM 
				users.users 
			WHERE 
				username = $1`,
			[username]
		)
		if (!user.length) {
			return res.status(404).json({ message: "User not found" })
		}
		const { rows: favorite_anime } = await pool.query(
			`
      SELECT 
				anime_id, cover_image, title 
      FROM 
				favorites.favorite_anime 
			WHERE 
				user_id = $1`,
			[user[0].user_id]
		)
		const { rows: favorite_characters } = await pool.query(
			`
      SELECT 
				character_id, cover_image, name 
      FROM 
				favorites.favorite_characters 
			WHERE 
				user_id = $1`,
			[user[0].user_id]
		)
		const { rows: followers } = await pool.query(
			`
				SELECT 
					username, avatar
				FROM users.users
				LEFT JOIN follows.follows
					ON users.user_id = follows.follower_id
				WHERE 
					follows.followed_id = $1
			`,
			[user[0].user_id]
		)
		const { rows: following } = await pool.query(
			`
				SELECT 
					username, avatar
				FROM users.users
				LEFT JOIN follows.follows
					ON users.user_id = follows.followed_id
				WHERE 
					follows.follower_id = $1
			`,
			[user[0].user_id]
		)
		const { rows: threads } = await pool.query(
			`
		SELECT 
			thread_id, topic, is_edited, created_at 
		FROM discussions.threads
		WHERE is_deleted = FALSE AND user_id = $1 
		`,
			[user[0].user_id]
		)
		let isFollowing = false
		if (res.locals.user.isLoggedIn) {
			const { rows: isExisting } = await pool.query(
				`
			SELECT 
				follower_id
			FROM 
				follows.follows 
			WHERE follower_id = $1 AND followed_id = $2`,
				[res.locals.user.user_id, user[0].user_id]
			)
			if (isExisting.length) isFollowing = true
		}
		res.json({
			data: {
				user: user[0],
				favorite_anime,
				favorite_characters,
				threads,
				followers,
				following,
				isFollowing,
			},
		})
	} catch (e) {
		console.error(bgRed("GET PROFILE"), e)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/:username", checkAuth, async (req: Request, res: Response) => {
	try {
		const { username } = req.params

		const { rows: user } = await pool.query(
			`
		SELECT user_id FROM users.users 
		WHERE username = $1`,
			[username]
		)
		if (!user.length) {
			return res.status(404).json({ message: "User not found" })
		}
		await pool.query(
			`
			INSERT INTO follows.follows 
				(follower_id, followed_id) 
			VALUES ($1, $2)
			ON CONFLICT (follower_id, followed_id) DO NOTHING
		`,
			[res.locals.user.user_id, user[0].user_id]
		)
		res.json({ message: "You are following" })
	} catch (error) {
		console.error(bgRed("POST MEMNER"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.delete("/:username", checkAuth, async (req: Request, res: Response) => {
	try {
		const { username } = req.params
		const { rows: user } = await pool.query(
			`
		SELECT user_id FROM users.users 
		WHERE username = $1`,
			[username]
		)
		if (!user.length) {
			return res.status(404).json({ message: "User not found" })
		}
		await pool.query(
			`
		DELETE FROM follows.follows 
		WHERE 
			follower_id = $1 AND followed_id = $2`,
			[res.locals.user.user_id, user[0].user_id]
		)
		res.json({ message: "Removed from following" })
	} catch (error) {
		console.error(bgRed("DELETE MEMNER"), error.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})
export default router
