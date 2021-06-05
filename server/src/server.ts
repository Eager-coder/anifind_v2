import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import favAnimeRouter from "./routes/favorites/favorite_anime"
import favCharacterRouter from "./routes/favorites/favorite_characters"
import authUpdateRouter from "./routes/user/auth.update"
import authRouter from "./routes/user/auth"
import profileRouter from "./routes/user/profile"
import animeCommentRouter from "./routes/comments/anime"
import characterCommentRouter from "./routes/comments/character"
import memberRouter from "./routes/member/member"
import followRouter from "./routes/user/follow"
import postRouter from "./routes/discussion/post"
import threadRouter from "./routes/discussion/thread"
const app = express()

app.use(
	cors({
		origin: ["http://localhost:3000"],
		credentials: true,
	})
)

app.use(cookieParser())

app.use(express.json({ limit: "3mb" }))
app.use(express.urlencoded({ limit: "3mb", extended: true }))
app.use("/api/user/auth", authRouter)
app.use("/api/comments/anime", animeCommentRouter)
app.use("/api/comments/character", characterCommentRouter)
app.use("/api/favorites/anime", favAnimeRouter)
app.use("/api/favorites/character", favCharacterRouter)
app.use("/api/user/update", authUpdateRouter)
app.use("/api/user/profile", profileRouter)
app.use("/api/member", memberRouter)
app.use("/api/user/follow", followRouter)
app.use("/api/discussion/thread", threadRouter)
app.use("/api/discussion/post", postRouter)
const PORT = process.env.PORT

app.use(express.static("./frontend/build"))
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./frontend/build/index.html")))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
