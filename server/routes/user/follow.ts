import { Router } from "express"
import pool from "../../config/db"
const router = Router()
const checkAuth = require("../../middleware/auth.middleware").default

router.get("/following", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { rows: followList } = await pool.query(
			`SELECT follows.followed_id as followed_id, 
         username, avatar 
      FROM follows.follows, users.users
      WHERE follows.follower_id = $1 AND 
			users.user_id = follows.followed_id`,
			[user_id]
		)
		res.json({ data: followList })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Somthing went wrong" })
	}
})

router.post("/:following_id", checkAuth, async (req: any, res) => {
	try {
		const { user_id: follower_id } = res.locals.user
		const { following_id } = req.params
		await pool.query(
			`INSERT INTO follows.follows
		(follower_id, followed_id) VALUES ($1, $2)`,
			[follower_id, following_id]
		)
		res.json({ message: "You are following" })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.get("/followers", checkAuth, async (req: any, res) => {
	try {
		const { user_id } = res.locals.user
		const { rows: followerList } = await pool.query(
			`SELECT follows.follower_id as follower_id, 
      username, avatar 
      FROM follows.follows, users.users
      WHERE followed_id = $1 AND users.user_id = follows.follower_id`,
			[user_id]
		)
		res.json({ data: followerList })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: "Somthing went wrong" })
	}
})

export default router
