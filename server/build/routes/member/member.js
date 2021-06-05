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
var express_1 = require("express");
var db_1 = __importDefault(require("../../config/db"));
var router = express_1.Router();
var chalk_1 = require("chalk");
var auth_middleware_1 = require("../../middleware/auth.middleware");
router.get("/:username", auth_middleware_1.checkIsLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, favorite_anime, favorite_characters, followers, following, threads, isFollowing, isExisting, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, db_1.default.query("\n      SELECT \n\t\t\t\tuser_id, username, avatar AS avatar_url, about, created_at \n\t\t\tFROM \n\t\t\t\tusers.users \n\t\t\tWHERE \n\t\t\t\tusername = $1", [username])];
            case 2:
                user = (_a.sent()).rows;
                if (!user.length) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                return [4 /*yield*/, db_1.default.query("\n      SELECT \n\t\t\t\tanime_id, cover_image, title \n      FROM \n\t\t\t\tfavorites.favorite_anime \n\t\t\tWHERE \n\t\t\t\tuser_id = $1", [user[0].user_id])];
            case 3:
                favorite_anime = (_a.sent()).rows;
                return [4 /*yield*/, db_1.default.query("\n      SELECT \n\t\t\t\tcharacter_id, cover_image, name \n      FROM \n\t\t\t\tfavorites.favorite_characters \n\t\t\tWHERE \n\t\t\t\tuser_id = $1", [user[0].user_id])];
            case 4:
                favorite_characters = (_a.sent()).rows;
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tSELECT \n\t\t\t\t\tusername, avatar\n\t\t\t\tFROM users.users\n\t\t\t\tLEFT JOIN follows.follows\n\t\t\t\t\tON users.user_id = follows.follower_id\n\t\t\t\tWHERE \n\t\t\t\t\tfollows.followed_id = $1\n\t\t\t", [user[0].user_id])];
            case 5:
                followers = (_a.sent()).rows;
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tSELECT \n\t\t\t\t\tusername, avatar\n\t\t\t\tFROM users.users\n\t\t\t\tLEFT JOIN follows.follows\n\t\t\t\t\tON users.user_id = follows.followed_id\n\t\t\t\tWHERE \n\t\t\t\t\tfollows.follower_id = $1\n\t\t\t", [user[0].user_id])];
            case 6:
                following = (_a.sent()).rows;
                return [4 /*yield*/, db_1.default.query("\n\t\tSELECT \n\t\t\tthread_id, topic, is_edited, created_at \n\t\tFROM discussions.threads\n\t\tWHERE is_deleted = FALSE AND user_id = $1 \n\t\t", [user[0].user_id])];
            case 7:
                threads = (_a.sent()).rows;
                isFollowing = false;
                if (!res.locals.user.isLoggedIn) return [3 /*break*/, 9];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT \n\t\t\t\tfollower_id\n\t\t\tFROM \n\t\t\t\tfollows.follows \n\t\t\tWHERE follower_id = $1 AND followed_id = $2", [res.locals.user.user_id, user[0].user_id])];
            case 8:
                isExisting = (_a.sent()).rows;
                if (isExisting.length)
                    isFollowing = true;
                _a.label = 9;
            case 9:
                res.json({
                    data: {
                        user: user[0],
                        favorite_anime: favorite_anime,
                        favorite_characters: favorite_characters,
                        threads: threads,
                        followers: followers,
                        following: following,
                        isFollowing: isFollowing,
                    },
                });
                return [3 /*break*/, 11];
            case 10:
                e_1 = _a.sent();
                console.error(chalk_1.bgRed("GET PROFILE"), e_1);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
router.post("/:username", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                username = req.params.username;
                return [4 /*yield*/, db_1.default.query("\n\t\tSELECT user_id FROM users.users \n\t\tWHERE username = $1", [username])];
            case 1:
                user = (_a.sent()).rows;
                if (!user.length) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                return [4 /*yield*/, db_1.default.query("\n\t\t\tINSERT INTO follows.follows \n\t\t\t\t(follower_id, followed_id) \n\t\t\tVALUES ($1, $2)\n\t\t\tON CONFLICT (follower_id, followed_id) DO NOTHING\n\t\t", [res.locals.user.user_id, user[0].user_id])];
            case 2:
                _a.sent();
                res.json({ message: "You are following" });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(chalk_1.bgRed("POST MEMNER"), error_1.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete("/:username", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                username = req.params.username;
                return [4 /*yield*/, db_1.default.query("\n\t\tSELECT user_id FROM users.users \n\t\tWHERE username = $1", [username])];
            case 1:
                user = (_a.sent()).rows;
                if (!user.length) {
                    return [2 /*return*/, res.status(404).json({ message: "User not found" })];
                }
                return [4 /*yield*/, db_1.default.query("\n\t\tDELETE FROM follows.follows \n\t\tWHERE \n\t\t\tfollower_id = $1 AND followed_id = $2", [res.locals.user.user_id, user[0].user_id])];
            case 2:
                _a.sent();
                res.json({ message: "Removed from following" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error(chalk_1.bgRed("DELETE MEMNER"), error_2.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
