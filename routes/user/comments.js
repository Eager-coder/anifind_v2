const { Router } = require("express")
const pool = require("../../utlis/db")
const router = Router()
const checkAuth = require("../../middleware/auth.middleware")

router.get("/", checkAuth, async (req, res) => {
	try {
		const { user_id } = req.user
		const { rows } = await pool.query(`
			SELECT comments.text, comments.created_at, comments.comment_id, 
				comments.page_id, comments.user_id, comments.is_edited
			FROM comments, users WHERE comments.user_id = '${user_id}' 
				AND comments.user_id = users.user_id
			ORDER BY comments.created_at DESC
		`)
		res.json({ data: rows })
	} catch (e) {
		console.error("GET USER COMMENT", e)
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
			VALUES ('${comment.replace(/'/g, "''")}', '${date}', '${user_id}', '${page_id}')
		`)
		const { rows: allComments } = await pool.query(`
			SELECT users.username, users.avatar,
				comments.text, comments.created_at,
				comments.comment_id, comments.user_id, comments.is_edited
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

router.put("/", checkAuth, async (req, res) => {
	try {
		const { user_id } = req.user
		const { newComment, comment_id } = req.body
		if (!newComment || !comment_id)
			return res.status(400).json({ message: "No comment found" })
		await pool.query(`
			UPDATE comments SET text = '${newComment.replace(/'/g, "''")}', is_edited = true
			WHERE comment_id = '${comment_id}' AND user_id = '${user_id}'
		`)

		res.json({ message: "Comment has been edited" })
	} catch (e) {
		console.error("Update COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.delete("/:comment_id", checkAuth, async (req, res) => {
	try {
		const { user_id } = req.user
		const { comment_id } = req.params

		const { rows } = await pool.query(`
		SELECT * FROM comments WHERE user_id = '${user_id}' 
		AND comment_id = '${comment_id}'
	`)
		if (
			rows[0].comment_id === Number(comment_id) &&
			rows[0].user_id == Number(user_id)
		) {
			await pool.query(`
				DELETE FROM comments WHERE 
					comment_id = '${comment_id}' AND user_id = '${user_id}'
			`)
			res.json({ message: "Comment deleted" })
		} else {
			res.status(400).json({ message: "Something went wrong" })
		}
	} catch (e) {
		console.error("DELETE COMMENT", e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

module.exports = router
