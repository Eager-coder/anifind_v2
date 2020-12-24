const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()
const path = require("path")

const app = express()
app.use(cookieParser())

// app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(cors())
app.use(bodyParser.json({ limit: "3mb" }))
app.use(bodyParser.urlencoded({ limit: "3mb", extended: true }))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/user/comment", require("./routes/user/comment"))
app.use("/api/user/favorites", require("./routes/user/favorites"))
app.use("/api/user/avatar", require("./routes/user/avatar"))
app.use("/api/user/update", require("./routes/user/auth.update"))

const PORT = process.env.PORT || 80

app.use(express.static("./frontend/build"))
app
	.get("*", (req, res) =>
		res.sendFile(path.join(__dirname + "/frontend/build/index.html"))
	)
	.listen(3000, () => console.log("React on port 3000"))

app.listen(PORT, () =>
	console.log(`Server running on port: http://localhost:${PORT}`)
)
