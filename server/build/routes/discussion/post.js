"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var express_1 = require("express");
var nanoid_1 = require("nanoid");
var db_1 = __importDefault(require("../../config/db"));
var getNestedPosts_1 = __importDefault(require("../../helpers/getNestedPosts"));
var getTime_1 = require("../../helpers/getTime");
var auth_middleware_1 = require("../../middleware/auth.middleware");
var router = express_1.Router();
router.get("/:thread_id", auth_middleware_1.checkIsLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, _a, isLoggedIn, user_id, posts, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                thread_id = req.params.thread_id;
                _a = res.locals.user, isLoggedIn = _a.isLoggedIn, user_id = _a.user_id;
                posts = void 0;
                if (!isLoggedIn) return [3 /*break*/, 2];
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\t\tSELECT \n\t\t\t\t\t\tposts.post_id, posts.user_id, parent_id, body, is_edited, \n\t\t\t\t\t\tis_deleted, posts.created_at, users.avatar, users.username ,\n\t\t\t\t\t\tEXISTS (\n\t\t\t\t\t\t\tSELECT 1 FROM discussions.post_likes WHERE post_likes.user_id = $2 \n\t\t\t\t\t\t\tAND post_likes.post_id = posts.post_id) AS is_liked,\n\t\t\t\t\t\tCOUNT(post_likes) AS like_count\n\t\t\t\t\tFROM \n\t\t\t\t\t\tdiscussions.posts \n\t\t\t\t\tLEFT JOIN users.users\n\t\t\t\t\t\tON users.user_id = posts.user_id\n\t\t\t\t\tLEFT JOIN discussions.post_likes\n\t\t\t\t\t\tON  posts.post_id = post_likes.post_id  \n\t\t\t\t\tWHERE \n\t\t\t\t\t\tthread_id = $1\n\t\t\t\t\tGROUP BY posts.post_id, users.user_id", [thread_id, user_id])];
            case 1:
                posts = (_b.sent()).rows;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT \n\t\t\t\tpost_id, posts.user_id, parent_id, body, is_edited, \n\t\t\t\tis_deleted, posts.created_at, users.avatar, users.username \n\t\t\tFROM \n\t\t\t\tdiscussions.posts \n\t\t\tLEFT JOIN users.users\n\t\t\t\tON users.user_id = posts.user_id\n      WHERE \n\t\t\t\tthread_id = $1", [thread_id])];
            case 3:
                posts = (_b.sent()).rows;
                _b.label = 4;
            case 4:
                res.json({ data: getNestedPosts_1.default(posts) });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.log(chalk_1.default.red("GET posts"), error_1.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post("/:thread_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, _a, body, parent_id, user_id, thread, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                thread_id = req.params.thread_id;
                _a = req.body, body = _a.body, parent_id = _a.parent_id;
                user_id = res.locals.user.user_id;
                if (!(thread_id === null || thread_id === void 0 ? void 0 : thread_id.trim()) || !(body === null || body === void 0 ? void 0 : body.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT thread_id \n\t\t\tFROM discussions.threads \n\t\t\tWHERE thread_id = $1 AND is_deleted = FALSE\n\t\t\t", [thread_id])];
            case 1:
                thread = (_b.sent()).rows[0];
                if (!thread)
                    return [2 /*return*/, res.status(400).json({ message: "Thread does not exist" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tINSERT INTO discussions.posts \n    \t\t(post_id, thread_id, user_id, parent_id, body, created_at)\n    \tVALUES \n\t\t\t\t($1, $2, $3, $4, $5, $6)\n    ", [nanoid_1.nanoid(12), thread_id, user_id, parent_id, body, getTime_1.getUnixTimeNow()])];
            case 2:
                _b.sent();
                res.json({ message: "Post created" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.log(chalk_1.default.red("POST posts"), error_2.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.put("/:post_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post_id, body, user_id, post, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                post_id = req.params.post_id;
                body = req.body.body;
                user_id = res.locals.user.user_id;
                if (!(body === null || body === void 0 ? void 0 : body.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT \n\t\t\t\tpost_id \n\t\t\tFROM \n\t\t\t\tdiscussions.posts \n\t\t\tWHERE \n\t\t\t\tpost_id = $1 AND user_id = $2 AND is_deleted = FALSE\n\t\t\t", [post_id, user_id])];
            case 1:
                post = (_a.sent()).rows[0];
                if (!post)
                    return [2 /*return*/, res.status(400).json({ message: "Post does not exist" })];
                return [4 /*yield*/, db_1.default.query("\n\t\tUPDATE \n\t\t\tdiscussions.posts \n\t\tSET \n\t\t\tbody = $1, is_edited = TRUE \n\t\tWHERE post_id = $2 AND user_id = $3", [body, post_id, user_id])];
            case 2:
                _a.sent();
                res.json({ message: "Post updated!" });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.log(chalk_1.default.red("PUT post"), error_3.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete("/:post_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post_id, user_id, post, childPost, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                post_id = req.params.post_id;
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT \n\t\t\t\tpost_id, parent_id\n\t\t\tFROM \n\t\t\t\tdiscussions.posts \n\t\t\tWHERE \n\t\t\t\tpost_id = $1 AND user_id = $2 AND is_deleted = FALSE\n\t\t\t", [post_id, user_id])];
            case 1:
                post = (_a.sent()).rows[0];
                if (!post)
                    return [2 /*return*/, res.status(400).json({ message: "Post does not exist" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tSELECT post_id FROM discussions.posts \n\t\t\t\tWHERE parent_id = $1 LIMIT 1\n\t\t\t", [post.post_id])];
            case 2:
                childPost = (_a.sent()).rows;
                if (!childPost.length) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tUPDATE \n\t\t\t\t\tdiscussions.posts \n\t\t\t\tSET \n\t\t\t\t\tbody = '[deleted]', is_deleted = TRUE\n\t\t\t\tWHERE \n\t\t\t\t\tpost_id = $1 AND user_id = $2", [post_id, user_id])];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, db_1.default.query("\n\t\t\t\tDELETE FROM discussions.posts \n\t\t\t\tWHERE post_id = $1 AND user_id = $2", [post_id, user_id])];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.json({ message: "Post deleted" });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _a.sent();
                console.log(chalk_1.default.red("DELETE post"), error_4.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post("/like/:post_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post_id, user_id, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                post_id = req.params.post_id;
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n      INSERT INTO \n        discussions.post_likes\n        (post_id, user_id, liked_at)\n      VALUES\n        ($1, $2, $3)\n    ", [post_id, user_id, getTime_1.getUnixTimeNow()])];
            case 1:
                _a.sent();
                res.json({ message: "Post liked" });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log(chalk_1.default.red("LIKE POST"), error_5.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/unlike/:post_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post_id, user_id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                post_id = req.params.post_id;
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n     DELETE FROM\n\t\t\t\tdiscussions.post_likes\n\t\t\tWHERE \n\t\t\t\tpost_id = $1 AND user_id = $2\t\n    ", [post_id, user_id])];
            case 1:
                _a.sent();
                res.json({ message: "Post uniked" });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.log(chalk_1.default.red("UNLIKE POST"), error_6.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
