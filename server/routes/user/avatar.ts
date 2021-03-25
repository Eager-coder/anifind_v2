import { Router } from "express"
const router = Router()
import checkAuth from "../../middleware/auth.middleware"
import { uploader } from "../../config/cloudinary"
import { query } from "../../config/db"

router.post("/", checkAuth, async (req, res) => {
	try {
		const fileStr = req.body.data
		const { url } = await uploader.upload(fileStr, {
			folder: "anifind/user",
			width: 400,
			quality: "auto",
			fetch_format: "auto",
			crop: "scale",
		})
		await query(`
      UPDATE users SET avatar = '${url}' WHERE user_id = ${res.locals.user.user_id}
		`)
		res.json({ message: "Image uploaded", avatar: url })
	} catch (err) {
		console.error("avatar error:", err)
		res.status(500).json({ message: "Something went wrong" })
	}
})

export default router
