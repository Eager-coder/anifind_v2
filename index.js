const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()
const path = require("path")

const app = express()
app.use(cookieParser())

app.use(
	cors({
		allowedHeaders: ["sessionId", "Content-Type"],
		exposedHeaders: ["sessionId"],
		origin: "http://localhost:3000",
		credentials: true,
	})
)
app.use(bodyParser.json({ limit: "3mb" }))
app.use(bodyParser.urlencoded({ limit: "3mb", extended: true }))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/comments", require("./routes/comments"))
app.use("/api/user/comments", require("./routes/user/comments"))
app.use("/api/user/favorites", require("./routes/user/favorites"))
app.use("/api/user/avatar", require("./routes/user/avatar"))
app.use("/api/user/update", require("./routes/user/auth.update"))
app.use("/api/user/profile", require("./routes/user/profile"))

const PORT = process.env.PORT || 80

app.use(express.static("./frontend/build"))
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname + "/frontend/build/index.html"))
)

app.listen(PORT, () =>
	console.log(`Server running on port: http://localhost:${PORT}`)
)
