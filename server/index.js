const express = require("express")
const app = express()
const bodyParser = require("body-parser")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json({ limit: "3mb" }))
app.use(bodyParser.urlencoded({ limit: "3mb", extended: true }))
app.use(cookieParser())
app.use("/api/auth", require("./routes/auth"))
app.use("/api/user/comment", require("./routes/user/comment"))
app.use("/api/user/favorites", require("./routes/user/favorites"))
app.use("/api/user/avatar", require("./routes/user/avatar"))
app.use("/api/user/update", require("./routes/user/auth.update"))

const PORT = process.env.PORT || 80
console.log()

app.use(express.static("../frontend/build"))
app.listen(PORT, () =>
	console.log(`Server running on port: http://localhost:${PORT}`)
)
