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
var auth_middleware_1 = require("../../middleware/auth.middleware");
var chalk_1 = __importDefault(require("chalk"));
var nanoid_1 = require("nanoid");
var getTime_1 = require("../../helpers/getTime");
var query_1 = require("../../helpers/query");
var router = express_1.Router();
router.get("/all", function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var threads, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.default.query("\n\tSELECT \n\t\tusername, avatar, threads.user_id, thread_id, \n\t\ttopic, body, is_edited, threads.created_at \n\tFROM \n\t\tdiscussions.threads, users.users\n\tWHERE \n\t\tthreads.user_id = users.user_id \n\t\tAND threads.is_deleted = FALSE\n\tORDER BY created_at DESC")];
            case 1:
                threads = (_a.sent()).rows;
                return [2 /*return*/, res.json({ data: threads })];
            case 2:
                err_1 = _a.sent();
                console.log("GET DISCUSSIONS", err_1.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// not finished
router.get("/user", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, threads, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n\t\tSELECT \n\t\t\tthread_id, topic, is_edited, created_at \n\t\tFROM discussions.threads\n\t\tWHERE is_deleted = FALSE AND user_id = $1 \n\t\t", [user_id])];
            case 1:
                threads = (_a.sent()).rows;
                res.json({ data: threads });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log("GET USER DISCUSSIONS", error_1.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:thread_id", auth_middleware_1.checkIsLoggedIn, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, _a, isLoggedIn, user_id, thread, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                thread_id = req.params.thread_id;
                _a = res.locals.user, isLoggedIn = _a.isLoggedIn, user_id = _a.user_id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                thread = void 0;
                if (!isLoggedIn) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.default.query(query_1.threadWithUserQuery, [thread_id, user_id])];
            case 2:
                thread = (_b.sent()).rows[0];
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, db_1.default.query(query_1.threadWithoutUserQuery, [thread_id])];
            case 4:
                thread = (_b.sent()).rows[0];
                _b.label = 5;
            case 5:
                res.json({ data: thread });
                return [3 /*break*/, 7];
            case 6:
                error_2 = _b.sent();
                console.log(chalk_1.default.red("GET THREAD"), error_2);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.post("/", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, topic, body, user_id, thread_id, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, topic = _a.topic, body = _a.body;
                user_id = res.locals.user.user_id;
                if (!(topic === null || topic === void 0 ? void 0 : topic.trim()) || !(body === null || body === void 0 ? void 0 : body.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                thread_id = nanoid_1.nanoid(12);
                return [4 /*yield*/, db_1.default.query("INSERT INTO discussions.threads \n\t\t\t(thread_id, user_id, topic, body, created_at) \n\t\t\tVALUES ($1, $2, $3, $4, $5) \n      ", [thread_id, user_id, topic, body, getTime_1.getUnixTimeNow()])];
            case 1:
                _b.sent();
                res.json({ message: "Discussion successfully opened", data: { thread_id: thread_id } });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.log(chalk_1.default.red("POST THREAD"), error_3.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/:thread_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, user_id, _a, body, topic, thread, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                thread_id = req.params.thread_id;
                user_id = res.locals.user.user_id;
                _a = req.body, body = _a.body, topic = _a.topic;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (!(body === null || body === void 0 ? void 0 : body.trim()) || !(topic === null || topic === void 0 ? void 0 : topic.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tSELECT * FROM discussions.threads \n\t\t\t\tWHERE thread_id = $1 AND user_id = $2\n\t\t\t\t", [thread_id, user_id])];
            case 2:
                thread = (_b.sent()).rows[0];
                if (!thread)
                    return [2 /*return*/, res.status(400).json({ message: "No thread found" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tUPDATE discussions.threads \n\t\t\t\tSET topic = $1, body = $2, is_edited = TRUE \n\t\t\t\tWHERE thread_id = $3 AND user_id = $4\n\t\t\t\t", [topic, body, thread_id, user_id])];
            case 3:
                _b.sent();
                res.json({ message: "Updated successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.log(chalk_1.default.red("UPDATE THREAD"), error_4);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.delete("/:thread_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, user_id, thread, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thread_id = req.params.thread_id;
                user_id = res.locals.user.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.query("\n\t\t\t\tSELECT * FROM discussions.threads \n\t\t\t\tWHERE thread_id = $1 AND user_id = $2\n\t\t\t\t", [thread_id, user_id])];
            case 2:
                thread = (_a.sent()).rows[0];
                if (!thread)
                    return [2 /*return*/, res.status(400).json({ message: "No thread found" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tUPDATE \n\t\t\t\tdiscussions.threads \n\t\t\tSET \n\t\t\t\ttopic = '[deleted]', body = '[deleted]', is_deleted = TRUE \n\t\t\tWHERE \n\t\t\t\tthread_id = $1 AND user_id = $2\n\t\t", [thread_id, user_id])];
            case 3:
                _a.sent();
                res.json({ message: "Deleted successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.log(chalk_1.default.red("DELETE THREAD"), error_5);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post("/like/:thread_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, user_id, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                thread_id = req.params.thread_id;
                user_id = res.locals.user.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query("\n      INSERT INTO \n        discussions.thread_likes\n        (thread_id, user_id, liked_at)\n      VALUES\n        ($1, $2, $3)\n    ", [thread_id, user_id, getTime_1.getUnixTimeNow()])];
            case 2:
                _a.sent();
                console.log("thread liked");
                res.json({ message: "Thread liked" });
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.log("LIKE THREAD", error_6.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.delete("/like/:thread_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread_id, user_id, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                thread_id = req.params.thread_id;
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n      DELETE FROM\n\t\t\t\tdiscussions.thread_likes\n\t\t\tWHERE \n\t\t\t\tthread_id = $1 AND user_id = $2\t\n    ", [thread_id, user_id])];
            case 1:
                _a.sent();
                console.log("thread unliked");
                res.json({ message: "Thread unliked" });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.log(chalk_1.default.red("UNLIKE THREAD"), error_7.message);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
