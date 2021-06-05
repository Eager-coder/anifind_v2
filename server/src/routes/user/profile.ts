import { Request, Response, Router } from "express"
import pool from "../../config/db"
const router = Router()
import { checkAuth } from "../../middleware/auth.middleware"
import chalk from "chalk"
import cloudinary from "../../config/cloudinary"

router.get("/", checkAuth, async (req: Request, res: Response) => {
	const { user_id } = res.locals.user
	try {
		const { rows } = await pool.query(`
      SELECT user_id, username, email, created_at, avatar AS avatar_url, about 
			FROM users.users WHERE user_id = '${user_id}'
    `)
		res.json({ data: rows[0] })
	} catch (e) {
		console.error(chalk.bgRed("GET PROFILE"), e.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/about", checkAuth, async (req: Request, res: Response) => {
	const { user_id } = res.locals.user
	const { newAbout } = req.body
	try {
		await pool.query(
			`
			UPDATE users.users SET about = $1
			WHERE user_id = $2
		`,
			[newAbout, user_id]
		)

		res.json({ message: "Successfully uploaded!" })
	} catch (e) {
		console.error(chalk.bgRed("PUT ABOUT"), e.message)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.put("/avatar", checkAuth, async (req: Request, res: Response) => {
	try {
		const fileStr = req.body.data
		const { url } = await cloudinary.uploader.upload(fileStr, {
			folder: "anifind/user",
			width: 400,
			quality: "auto",
			fetch_format: "auto",
			crop: "scale",
		})
		await pool.query(`
      UPDATE users.users SET avatar = '${url}' WHERE user_id = ${res.locals.user.user_id}
		`)
		res.json({ message: "Image uploaded", avatar: url })
	} catch (err) {
		console.error("avatar error:", err)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
