const { verify } = require("jsonwebtoken")
const chalk = require("chalk")
module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization
		if (!token) return res.status(401).json({ message: "Access denied" })
		const decoded = verify(token, process.env.JWT_SECRET)
		req.user = decoded
		next()
	} catch (e) {
		console.error(chalk.bgRed("VERIFY TOKEN"), e)
		res.status(401).send()
	}
}
