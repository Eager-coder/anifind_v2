import { verify } from "jsonwebtoken"
import { bgRed } from "chalk"
import { NextFunction, Request, Response } from "express"

export function checkAuth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.split(" ")[1]
		if (!token) return res.status(401).json({ message: "Unautorized" })
		const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET!)
		res.locals.user = decoded
		next()
	} catch (e) {
		console.error(bgRed("VERIFY TOKEN"), e.message)
		res.status(401).json({ message: "Unautorized" })
	}
}

export function checkIsLoggedIn(req: Request, res: Response, next: NextFunction) {
	res.locals.user = {}
	try {
		const token = req.headers.authorization?.split(" ")[1]
		if (!token) return (res.locals.user.isLoggedIn = false)
		const decoded: Object = verify(token, process.env.ACCESS_TOKEN_SECRET!)
		res.locals.user = { ...decoded, isLoggedIn: true }
	} catch (e) {
		res.locals.user.isLoggedIn = false
	} finally {
		next()
	}
}
