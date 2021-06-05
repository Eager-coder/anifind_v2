"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsLoggedIn = exports.checkAuth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var chalk_1 = require("chalk");
function checkAuth(req, res, next) {
    var _a;
    try {
        var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return res.status(401).json({ message: "Unautorized" });
        var decoded = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.locals.user = decoded;
        next();
    }
    catch (e) {
        console.error(chalk_1.bgRed("VERIFY TOKEN"), e.message);
        res.status(401).json({ message: "Unautorized" });
    }
}
exports.checkAuth = checkAuth;
function checkIsLoggedIn(req, res, next) {
    var _a;
    res.locals.user = {};
    try {
        var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token)
            return (res.locals.user.isLoggedIn = false);
        var decoded = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        res.locals.user = __assign(__assign({}, decoded), { isLoggedIn: true });
    }
    catch (e) {
        res.locals.user.isLoggedIn = false;
    }
    finally {
        next();
    }
}
exports.checkIsLoggedIn = checkIsLoggedIn;
