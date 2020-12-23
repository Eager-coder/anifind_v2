const { Router } = require("express")
const router = Router()
const checkAuth = require("../../middleware/auth.middleware")
const cloudinary = require("../../utlis/cloudinary")
const pool = require("../../utlis/db")
const { sign } = require("jsonwebtoken")

router.post("/", checkAuth, async (req, res) => {
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
      UPDATE users SET avatar = '${url}' WHERE user_id = ${req.user.user_id}
		`)
		const { user_id, username, email } = req.user

		const token = sign(
			{ user_id, username, email, avatar: url },
			process.env.JWT_SECRET,
			{
				expiresIn: "3d",
			}
		)

		res.json({ message: "Image uploaded", avatar: url, token })
	} catch (err) {
		console.error("avatar error:", err)
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
