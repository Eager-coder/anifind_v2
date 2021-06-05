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
var bcrypt_1 = require("bcrypt");
var auth_middleware_1 = require("../../middleware/auth.middleware");
router.put("/username", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUsername, user_id, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                newUsername = req.body.newUsername;
                user_id = res.locals.user.user_id;
                if (!(newUsername === null || newUsername === void 0 ? void 0 : newUsername.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tUPDATE users.users SET username = $1 \n\t\t\tWHERE user_id = $2", [newUsername, user_id])];
            case 1:
                _a.sent();
                res.json({ message: "Username has been changed!" });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error("AUTH UPDATE USERNAME", e_1.message);
                res.status(500).json({ message: "Someting went wrong" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.put("/email", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newEmail, user_id, rows, isExisting, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                newEmail = req.body.newEmail;
                user_id = res.locals.user.user_id;
                if (!(newEmail === null || newEmail === void 0 ? void 0 : newEmail.trim()))
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT email FROM users.users WHERE email = $1", [newEmail === null || newEmail === void 0 ? void 0 : newEmail.trim()])];
            case 2:
                rows = (_a.sent()).rows;
                isExisting = rows.some(function (item) { return item.email === newEmail; });
                if (isExisting)
                    return [2 /*return*/, res.status(400).json({ message: "Email is not available" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tUPDATE users.users SET email = $1 \n\t\t\tWHERE user_id = $2\n\t\t", [newEmail, user_id])];
            case 3:
                _a.sent();
                res.json({ message: "Email has been updated!" });
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                console.error("AUTH UPDATE EMAIL", e_2.message);
                res.status(500).json({ message: "Someting went wrong" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.put("/password", auth_middleware_1.checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, _a, oldPassword, newPassword, rows, isMatch, newHashedPassword, e_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                user_id = res.locals.user.user_id;
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                oldPassword = (oldPassword === null || oldPassword === void 0 ? void 0 : oldPassword.trim()) || null;
                newPassword = (newPassword === null || newPassword === void 0 ? void 0 : newPassword.trim()) || null;
                if (!oldPassword || !newPassword)
                    return [2 /*return*/, res.status(400).json({ message: "Please fill all the fields" })];
                if (oldPassword === newPassword)
                    return [2 /*return*/, res.status(400).json({ message: "Current and new passwords cannot be the same" })];
                if (newPassword.length < 8)
                    return [2 /*return*/, res.status(400).json({ message: "Password must be at least 8 characters long" })];
                return [4 /*yield*/, db_1.default.query("\n\t\t\tSELECT password FROM users.users \n\t\t\tWHERE user_id = $1\n    ", [user_id])];
            case 1:
                rows = (_b.sent()).rows;
                return [4 /*yield*/, bcrypt_1.compare(oldPassword, rows[0].password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch)
                    return [2 /*return*/, res.status(400).json({ message: "Incorrect password" })];
                newHashedPassword = bcrypt_1.hashSync(newPassword, 10);
                return [4 /*yield*/, db_1.default.query("\n\t\t\tUPDATE users.users SET password = $1 \n\t\t\tWHERE user_id = $2\n    ", [newHashedPassword, user_id])];
            case 3:
                _b.sent();
                return [2 /*return*/, res.json({ message: "Password has been changed!" })];
            case 4:
                e_3 = _b.sent();
                console.error("AUTH UPDATE PASSWORD", e_3.message);
                res.status(500).json({ message: "Someting went wrong" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
