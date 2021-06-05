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
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var auth_middleware_1 = require("../../middleware/auth.middleware");
var generateToken_1 = require("../../helpers/generateToken");
var dotenv_1 = require("dotenv");
var getTime_1 = require("../../helpers/getTime");
dotenv_1.config();
var router = express_1.Router();
router.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, rows, hashedPassword, newUser, user_id, _b, accessToken, refreshToken, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                if (!username || !email || !password)
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields!" })];
                if (password.length < 8)
                    return [2 /*return*/, res.status(400).json({
                            message: "Password must be at least 8 characters long",
                        })];
                return [4 /*yield*/, db_1.default.query("SELECT email FROM users.users WHERE email = $1", [email])];
            case 1:
                rows = (_c.sent()).rows;
                if (rows.length && rows[0].email === email)
                    return [2 /*return*/, res.status(400).json({ message: "User already exists!" })];
                hashedPassword = bcrypt_1.hashSync(password, 10);
                return [4 /*yield*/, db_1.default.query("\n\t\t\tINSERT INTO \n\t\t\t\tusers.users (username, email, password)\n\t\t\tVALUES \n\t\t\t\t($1, $2, $3) \n\t\t\tRETURNING user_id, avatar\n\t\t", [username, email, hashedPassword])];
            case 2:
                newUser = _c.sent();
                user_id = newUser.rows[0].user_id;
                _b = generateToken_1.generateTokens({
                    user_id: user_id,
                    username: username,
                    email: email,
                }), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                res
                    .cookie("refreshToken", refreshToken, {
                    sameSite: "strict",
                    expires: getTime_1.getCookieExpDate(),
                    secure: process.env.NODE_ENV === "production" && true,
                    httpOnly: true,
                })
                    .status(201)
                    .json({
                    message: "You are registered!",
                    data: { accessToken: accessToken },
                });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _c.sent();
                console.error(e_1);
                res.status(500).json({ message: "Something went wrong" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reqEmail, reqPassword, user, isMatch, existingToken, _b, accessToken, refreshToken, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                console.log(req.body);
                _a = req.body, reqEmail = _a.email, reqPassword = _a.password;
                if (!reqEmail || !reqPassword)
                    return [2 /*return*/, res.status(400).json({
                            message: "Please fill all the fields!",
                        })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT * \n\t\t\tFROM \n\t\t\t\tusers.users \n\t\t\tWHERE \n\t\t\t\temail = $1\n\t\t\t", [reqEmail])];
            case 1:
                user = (_c.sent()).rows[0];
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ message: "Username or password is incorrect" })];
                }
                return [4 /*yield*/, bcrypt_1.compare(reqPassword.toString(), user.password)];
            case 2:
                isMatch = _c.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(400).json({
                            message: "Username or password is incorrect!",
                        })];
                existingToken = req.cookies.refreshToken;
                if (!existingToken) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tDELETE FROM \n\t\t\t\tusers.refresh_tokens\n\t\t\tWHERE \n\t\t\t\tuser_id = $1 AND token = $2\n\t\t\t", [user.user_id, existingToken])];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _b = generateToken_1.generateTokens(user), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                return [4 /*yield*/, db_1.default.query("INSERT INTO \n\t\t\t\tusers.refresh_tokens (user_id, token) \n\t\t\tVALUES ($1, $2)", [user.user_id, refreshToken])];
            case 5:
                _c.sent();
                res
                    .cookie("refreshToken", refreshToken, {
                    sameSite: "strict",
                    expires: getTime_1.getCookieExpDate(),
                    secure: process.env.NODE_ENV === "production",
                    httpOnly: true,
                })
                    .json({
                    message: "Welcome back!",
                    data: {
                        accessToken: accessToken,
                    },
                });
                return [3 /*break*/, 7];
            case 6:
                err_1 = _c.sent();
                res.status(500).json({ message: "Something went wrong" });
                console.log("login error", err_1.message);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.delete("/logout", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshToken = req.cookies.refreshToken;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.default.query("DELETE FROM \n\t\t\t\tusers.refresh_tokens \n\t\t\t WHERE \n\t\t\t \ttoken = $1", [refreshToken])];
            case 2:
                _a.sent();
                res.clearCookie("refreshToken").json({ message: "You have logged out" });
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log("logout error", err_2.message);
                return [2 /*return*/, res.status(500).json({ message: "Something went wrong" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get("/", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.status(200).json({ data: res.locals.user });
        return [2 /*return*/];
    });
}); });
router.post("/refresh_token", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, user, existingToken, _a, newAccessToken, newRefreshToken, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                refreshToken = req.cookies.refreshToken;
                if (!refreshToken)
                    return [2 /*return*/, res.status(401).json({ message: "Please log in to continue" })];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                user = jsonwebtoken_1.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                return [4 /*yield*/, db_1.default.query("SELECT * FROM users.refresh_tokens\n\t\t \t WHERE user_id = $1 AND token = $2", [user.user_id, refreshToken])];
            case 2:
                existingToken = (_c.sent()).rows;
                if (((_b = existingToken[0]) === null || _b === void 0 ? void 0 : _b.token) !== refreshToken) {
                    throw new Error("Unauthorized");
                }
                _a = generateToken_1.generateTokens(user), newAccessToken = _a.accessToken, newRefreshToken = _a.refreshToken;
                return [4 /*yield*/, db_1.default.query("UPDATE users.refresh_tokens SET token = $1 \n\t\t\t WHERE user_id = $2 AND token = $3", [newRefreshToken, user.user_id, refreshToken])];
            case 3:
                _c.sent();
                return [2 /*return*/, res
                        .cookie("refreshToken", newRefreshToken, {
                        sameSite: "strict",
                        expires: getTime_1.getCookieExpDate(),
                        secure: process.env.NODE_ENV === "production" && true,
                        httpOnly: true,
                    })
                        .json({ data: { accessToken: newAccessToken } })];
            case 4:
                error_1 = _c.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(401).json({ message: "Please log in to continue" })];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
