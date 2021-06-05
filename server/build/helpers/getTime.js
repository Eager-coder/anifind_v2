"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieExpDate = exports.getUnixTimeNow = void 0;
var getUnixTimeNow = function () {
    return Math.floor(Date.now() / 1000);
};
exports.getUnixTimeNow = getUnixTimeNow;
var getCookieExpDate = function () {
    return new Date(Date.now() + 14 * 86400 * 1000);
};
exports.getCookieExpDate = getCookieExpDate;
