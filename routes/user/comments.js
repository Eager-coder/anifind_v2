const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const checkAuth = require("../../middleware/auth.middleware")

router.get("/", checkAuth, async (req, res) => {
	try {
		const { user_id } = req.user
		const { rows } = await pool.query(`
			SELECT comments.text, comments.created_at, comments.page_id 
			FROM comments, users WHERE comments.user_id = '${user_id}' 
			AND comments.user_id = users.user_id
			ORDER BY comments.created_at DESC
		`)
		res.json({ data: rows })
	} catch (e) {
		console.error("~GET user COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})
router.post("/", checkAuth, async (req, res) => {
	try {
		const { user_id } = req.user
		const { comment, page_id } = req.body
		if (!comment) return res.status(404).json({ message: "No comment" })
		const date = Math.floor(new Date().getTime() / 1000)
		await pool.query(`
			INSERT INTO comments (text, created_at, user_id, page_id) 
			VALUES ('${comment}', '${date}', '${user_id}', '${page_id}')
		`)
		const { rows: allComments } = await pool.query(`
			SELECT users.username, users.avatar, comments.text, comments.created_at
				FROM comments, users WHERE comments.page_id = '${page_id}' 
				AND comments.user_id = users.user_id
				ORDER BY comments.created_at DESC
		`)
		res.json({ message: comment, data: allComments })
	} catch (e) {
		console.error("~POST COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
