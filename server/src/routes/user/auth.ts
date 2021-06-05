import { Router } from "express"
import pool from "../../config/db"
import { sign, verify } from "jsonwebtoken"
import { hashSync, compare } from "bcrypt"
import { checkAuth } from "../../middleware/auth.middleware"
import { generateTokens } from "../../helpers/generateToken"
import { Request, Response } from "express"
import { config } from "dotenv"
import { getCookieExpDate } from "../../helpers/getTime"
config()
const router = Router()

router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body
		if (!username || !email || !password)
			return res.status(400).json({ message: "Please fill all the fields!" })
		if (password.length < 8)
			return res.status(400).json({
				message: "Password must be at least 8 characters long",
			})
		const { rows } = await pool.query(`SELECT email FROM users.users WHERE email = $1`, [email])
		if (rows.length && rows[0].email === email)
			return res.status(400).json({ message: "User already exists!" })

		const hashedPassword = hashSync(password, 10)

		const newUser = await pool.query(
			`
			INSERT INTO 
				users.users (username, email, password)
			VALUES 
				($1, $2, $3) 
			RETURNING user_id, avatar
		`,
			[username, email, hashedPassword]
		)

		const { user_id } = newUser.rows[0]
		const { accessToken, refreshToken } = generateTokens({
			user_id,
			username,
			email,
		})

		res
			.cookie("refreshToken", refreshToken, {
				sameSite: "strict",
				expires: getCookieExpDate(),
				secure: process.env.NODE_ENV! === "production" && true,
				httpOnly: true,
			})
			.status(201)
			.json({
				message: "You are registered!",
				data: { accessToken },
			})
	} catch (e) {
		console.error(e)
		res.status(500).json({ message: "Something went wrong" })
	}
})

router.post("/login", async (req, res) => {
	try {
		console.log(req.body)
		const { email: reqEmail, password: reqPassword } = req.body
		if (!reqEmail || !reqPassword)
			return res.status(400).json({
				message: "Please fill all the fields!",
			})

		const {
			rows: [user],
		} = await pool.query(
			`
			SELECT * 
			FROM 
				users.users 
			WHERE 
				email = $1
			`,
			[reqEmail]
		)
		if (!user) {
			return res.status(400).json({ message: "Username or password is incorrect" })
		}

		const isMatch = await compare(reqPassword.toString(), user.password)
		if (!isMatch)
			return res.status(400).json({
				message: "Username or password is incorrect!",
			})

		const existingToken = req.cookies.refreshToken
		if (existingToken) {
			await pool.query(
				`
			DELETE FROM 
				users.refresh_tokens
			WHERE 
				user_id = $1 AND token = $2
			`,
				[user.user_id, existingToken]
			)
		}
		const { accessToken, refreshToken } = generateTokens(user)

		await pool.query(
			`INSERT INTO 
				users.refresh_tokens (user_id, token) 
			VALUES ($1, $2)`,
			[user.user_id, refreshToken]
		)

		res
			.cookie("refreshToken", refreshToken, {
				sameSite: "strict",
				expires: getCookieExpDate(),
				secure: process.env.NODE_ENV! === "production",
				httpOnly: true,
			})
			.json({
				message: "Welcome back!",
				data: {
					accessToken,
				},
			})
	} catch (err) {
		res.status(500).json({ message: "Something went wrong" })
		console.log("login error", err.message)
	}
})

router.delete("/logout", checkAuth, async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken
	try {
		await pool.query(
			`DELETE FROM 
				users.refresh_tokens 
			 WHERE 
			 	token = $1`,
			[refreshToken]
		)
		res.clearCookie("refreshToken").json({ message: "You have logged out" })
	} catch (err) {
		console.log("logout error", err.message)
		return res.status(500).json({ message: "Something went wrong" })
	}
})

router.get("/", checkAuth, async (req: any, res) => {
	res.status(200).json({ data: res.locals.user })
})

router.post("/refresh_token", async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.status(401).json({ message: "Please log in to continue" })
	try {
		const user: any = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
		const { rows: existingToken } = await pool.query(
			`SELECT * FROM users.refresh_tokens
		 	 WHERE user_id = $1 AND token = $2`,
			[user.user_id, refreshToken]
		)
		if (existingToken[0]?.token !== refreshToken) {
			throw new Error("Unauthorized")
		}
		const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user)

		await pool.query(
			`UPDATE users.refresh_tokens SET token = $1 
			 WHERE user_id = $2 AND token = $3`,
			[newRefreshToken, user.user_id, refreshToken]
		)
		return res
			.cookie("refreshToken", newRefreshToken, {
				sameSite: "strict",
				expires: getCookieExpDate(),
				secure: process.env.NODE_ENV! === "production" && true,
				httpOnly: true,
			})
			.json({ data: { accessToken: newAccessToken } })
	} catch (error) {
		console.log(error)
		return res.status(401).json({ message: "Please log in to continue" })
	}
})
export default router
