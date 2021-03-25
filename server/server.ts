import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import favAnimeRouter from "./routes/favorites/favorite_animes"
import favCharacterRouter from "./routes/favorites/favorite_characters"
import authUpdateRouter from "./routes/user/auth.update"
import authRouter from "./routes/user/auth"
import profileRouter from "./routes/user/profile"
import commentRouter from "./routes/comments/comments"
import animeCommentRouter from "./routes/comments"
import memberRouter from "./routes/member"
import followRouter from "./routes/user/follow"
import discussionsRouter from "./routes/discussions/discussions"
import discussionPostsRouter from "./routes/discussions/posts"

const app = express()
app.use(cookieParser())

app.use(
	cors({
		allowedHeaders: ["sessionId", "Content-Type"],
		exposedHeaders: ["sessionId"],
		credentials: true,
	})
)
app.use(express.json({ limit: "3mb" }))
app.use(express.urlencoded({ limit: "3mb", extended: true }))
app.use("/api/user/auth", authRouter)
app.use("/api/comments", animeCommentRouter)
app.use("/api/user/comments", commentRouter)
app.use("/api/user/favorite_animes", favAnimeRouter)
app.use("/api/user/update", authUpdateRouter)
app.use("/api/user/profile", profileRouter)
app.use("/api/member", memberRouter)
app.use("/api/user/favorite_characters", favCharacterRouter)
app.use("/api/user/follow", followRouter)
app.use("/api/discussions", discussionsRouter)
app.use("/api/discussions/posts", discussionPostsRouter)
const PORT = process.env.PORT || 80

app.use(express.static("./frontend/build"))
app.get("*", (req, res) =>
	res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
