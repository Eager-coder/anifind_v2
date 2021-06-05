"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var favorite_anime_1 = __importDefault(require("./routes/favorites/favorite_anime"));
var favorite_characters_1 = __importDefault(require("./routes/favorites/favorite_characters"));
var auth_update_1 = __importDefault(require("./routes/user/auth.update"));
var auth_1 = __importDefault(require("./routes/user/auth"));
var profile_1 = __importDefault(require("./routes/user/profile"));
var anime_1 = __importDefault(require("./routes/comments/anime"));
var character_1 = __importDefault(require("./routes/comments/character"));
var member_1 = __importDefault(require("./routes/member/member"));
var follow_1 = __importDefault(require("./routes/user/follow"));
var post_1 = __importDefault(require("./routes/discussion/post"));
var thread_1 = __importDefault(require("./routes/discussion/thread"));
var app = express_1.default();
app.use(cors_1.default({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json({ limit: "3mb" }));
app.use(express_1.default.urlencoded({ limit: "3mb", extended: true }));
app.use("/api/user/auth", auth_1.default);
app.use("/api/comments/anime", anime_1.default);
app.use("/api/comments/character", character_1.default);
app.use("/api/favorites/anime", favorite_anime_1.default);
app.use("/api/favorites/character", favorite_characters_1.default);
app.use("/api/user/update", auth_update_1.default);
app.use("/api/user/profile", profile_1.default);
app.use("/api/member", member_1.default);
app.use("/api/user/follow", follow_1.default);
app.use("/api/discussion/thread", thread_1.default);
app.use("/api/discussion/post", post_1.default);
var PORT = process.env.PORT;
app.use(express_1.default.static("../frontend/build"));
app.get("*", function (req, res) { return res.sendFile(path_1.default.join(__dirname, "../frontend/build/index.html")); });
app.listen(PORT, function () { return console.log("Server running on port " + PORT); });
