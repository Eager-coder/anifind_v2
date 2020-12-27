const { Router } = require("express")
const pool = require("../utlis/db")
const { sign } = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const router = Router()
const checkAuth = require("../middleware/auth.middleware")

router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body
		if (!username || !email || !password)
			return res.status(400).json({ message: "Please fill all the fields!" })
		if (password.length <= 8)
			return res.status(400).json({
				message: "Password must be at least 8 characters long",
			})
		const { rows } = await pool.query(
			`SELECT email FROM users WHERE email = '${email}'`
		)
		if (rows.length && rows[0].email === email)
			return res.status(400).json({ message: "User already exists!" })

		const hashedPassword = bcrypt.hashSync(password, 10)

		const newUser = await pool.query(`
			INSERT INTO users (username, email, password)
			VALUES ('${username}','${email}','${hashedPassword}') 
			RETURNING user_id, avatar
		`)

		const { user_id, avatar } = newUser.rows[0]

		const token = sign(
			{ user_id, username, email, avatar },
			process.env.JWT_SECRET,
			{
				expiresIn: "3d",
			}
		)
		res
			.cookie("auth", token, {
				expiresIn: 3600 * 1000 * 48,
				httpOnly: true,
			})
			.status(201)
			.json({
				message: "You are registered!",
				data: { username, email, avatar },
			})
	} catch (e) {
		console.error(e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/login", async (req, res) => {
	try {
		const { email: reqEmail, password: reqPassword } = req.body
		if (!reqEmail || !reqPassword)
			return res.status(400).json({
				message: "Please fill all the fields!",
			})

		const { rows } = await pool.query(
			`SELECT * FROM users WHERE email = '${reqEmail}'`
		)
		if (!rows.length) return res.status(404).json({ message: "User not found" })
		const isMatch = await bcrypt.compare(
			reqPassword.toString(),
			rows[0].password
		)
		if (isMatch) {
			const { user_id, username, email, avatar } = rows[0]
			const token = sign(
				{ user_id, username, email, avatar },
				process.env.JWT_SECRET,
				{
					expiresIn: "2d",
				}
			)
			res
				.cookie("auth", token, {
					expiresIn: 3600 * 1000 * 48,
					httpOnly: true,
				})
				.status(200)
				.json({
					message: "Welcome back!",
					data: { user_id, username, email, avatar },
				})
		} else {
			res.status(400).json({
				message: "Password is incorrect!",
			})
		}
	} catch (e) {
		res.status(500).json({ message: "Something went wrong" })
		console.log("login error", e)
	}
})

router.delete("/logout", checkAuth, async (req, res) => {
	res.clearCookie("auth").json({ message: "You have logged out" })
})

router.get("/", checkAuth, async (req, res) => {
	res.status(200).json({ data: req.user })
})

module.exports = router
