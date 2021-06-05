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
var auth_middleware_1 = require("../../middleware/auth.middleware");
router.get("/", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, following, followers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT \n\t\t\t\tfollowed_id, username, avatar \n      FROM follows.follows\n\t\t\tLEFT JOIN users.users\n\t\t\t\tON users.user_id = follows.followed_id\n      WHERE follows.follower_id = $1  \n\t\t\t", [user_id])];
            case 1:
                following = (_a.sent()).rows;
                return [4 /*yield*/, db_1.default.query("SELECT \n\t\t\t\tfollower_id, username, avatar \n      FROM follows.follows\n\t\t\tLEFT JOIN users.users \n\t\t\t\tON users.user_id = follows.follower_id\n      WHERE followed_id = $1", [user_id])];
            case 2:
                followers = (_a.sent()).rows;
                res.json({ data: { followers: followers, following: following } });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("GET FOLLOW", error_1.message);
                res.status(500).json({ message: "Somthing went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/following", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, followList, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("SELECT follows.followed_id as followed_id, \n         username, avatar \n      FROM follows.follows, users.users\n      WHERE follows.follower_id = $1 AND \n\t\t\tusers.user_id = follows.followed_id", [user_id])];
            case 1:
                followList = (_a.sent()).rows;
                res.json({ data: followList });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                res.status(500).json({ message: "Somthing went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post("/:following_id", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var follower_id, following_id, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                follower_id = res.locals.user.user_id;
                following_id = req.params.following_id;
                return [4 /*yield*/, db_1.default.query("INSERT INTO follows.follows\n\t\t(follower_id, followed_id) VALUES ($1, $2)", [follower_id, following_id])];
            case 1:
                _a.sent();
                res.json({ message: "You are following" });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/followers", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, followerList, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_id = res.locals.user.user_id;
                return [4 /*yield*/, db_1.default.query("SELECT follows.follower_id as follower_id, \n      username, avatar \n      FROM follows.follows, users.users\n      WHERE followed_id = $1 AND users.user_id = follows.follower_id", [user_id])];
            case 1:
                followerList = (_a.sent()).rows;
                res.json({ data: followerList });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                res.status(500).json({ message: "Somthing went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
