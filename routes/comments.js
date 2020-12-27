const { Router } = require("express")
const pool = require("../utlis/db")
const router = Router()

router.get("/", async (req, res) => {
	try {
		const { page_id } = req.query
		if (!page_id) return res.status(404).json({ message: "Page not found" })
		const { rows: allComments } = await pool.query(`
			SELECT users.username, users.avatar, comments.is_edited,
				comments.text, comments.created_at,
				comments.comment_id, comments.user_id 
			FROM comments, users WHERE comments.page_id = '${page_id}' 
				AND comments.user_id = users.user_id
			ORDER BY comments.created_at DESC
		`)
		res.json({ data: allComments })
	} catch (e) {
		console.error("~GET COMMENT~", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
