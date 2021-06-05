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
var db_1 = __importDefault(require("../../config/db"));
var getTime_1 = require("../../helpers/getTime");
var auth_middleware_1 = require("../../middleware/auth.middleware");
var router = express_1.Router();
router.get("/user", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, rows, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT anime_comments.text, anime_comments.created_at, anime_comments.comment_id, \n\t\t\t\tanime_comments.anime_id, anime_comments.user_id, anime_comments.is_edited\n\t\t\tFROM comments.anime_comments, users.users WHERE anime_comments.user_id = $1 \n\t\t\t\tAND anime_comments.user_id = users.user_id\n\t\t\tORDER BY anime_comments.created_at DESC\n\t\t\t", [user_id])];
            case 1:
                rows = (_a.sent()).rows;
                res.json({ data: rows });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error("GET USER COMMENT", e_1);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:anime_id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var anime_id, allComments, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.params);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                anime_id = req.params.anime_id;
                if (!anime_id)
                    return [2 /*return*/, res.status(404).json({ message: "Page not found" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT users.username, users.avatar, anime_comments.is_edited,\n\t\t\t\tanime_comments.text, anime_comments.created_at,\n\t\t\t\tanime_comments.comment_id, anime_comments.user_id, anime_comments.anime_id \n\t\t\tFROM comments.anime_comments, users.users WHERE anime_comments.anime_id = $1 \n\t\t\t\tAND anime_comments.user_id = users.user_id\n\t\t\tORDER BY anime_comments.created_at DESC\n\t\t\t\n\t\t", [anime_id])];
            case 2:
                allComments = (_a.sent()).rows;
                res.json({ data: allComments });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(chalk_1.default.red("GET ANIME PAGE COMMENT"), error_1);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/:anime_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, anime_id, comment, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                anime_id = req.params.anime_id;
                comment = req.body.comment;
                if (!comment)
                    return [2 /*return*/, res.status(404).json({ message: "No comment" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tINSERT INTO comments.anime_comments \n\t\t\t\t(text, created_at, user_id, anime_id) \n\t\t\tVALUES \n\t\t\t\t($1, $2, $3, $4)\n\t\t", [comment, getTime_1.getUnixTimeNow(), user_id, anime_id])];
            case 1:
                _a.sent();
                res.json({ message: "Comment has added" });
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.error("~POST COMMENT~", e_2);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/:comment_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, comment_id, newComment, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                comment_id = req.params.comment_id;
                newComment = req.body.newComment;
                if (!newComment || !comment_id)
                    return [2 /*return*/, res.status(400).json({ message: "No comment found" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tUPDATE comments.anime_comments SET text = $1, is_edited = true\n\t\t\tWHERE comment_id = $2 AND user_id = $3\n\t\t", [newComment, comment_id, user_id])];
            case 1:
                _a.sent();
                res.json({ message: "Comment has been edited" });
                return [3 /*break*/, 3];
            case 2:
                e_3 = _a.sent();
                console.error("Update COMMENT", e_3);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete("/:comment_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, comment_id, rows, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_id = res.locals.user.user_id;
                comment_id = req.params.comment_id;
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT comment_id\n\t\t\tFROM \n\t\t\t\tcomments.anime_comments \n\t\t\tWHERE \n\t\t\t\tuser_id = $1 AND comment_id = $2\n\t\t", [user_id, comment_id])];
            case 1:
                rows = (_a.sent()).rows;
                if (!rows.length) {
                    return [2 /*return*/, res.status(404).json({ message: "Comment not found" })];
                }
                return [4 /*yield*/, db_1.default.query("\n\t\t\tDELETE FROM \n\t\t\t\tcomments.anime_comments \n\t\t\tWHERE \n\t\t\t\tcomment_id = $1 AND user_id = $2\n\t\t", [comment_id, user_id])];
            case 2:
                _a.sent();
                res.json({ message: "Comment deleted" });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error("DELETE ANIME COMMENT", error_2.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
