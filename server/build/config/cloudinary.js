"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { v2 as cloudinary } from "cloudinary"
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
exports.default = cloudinary;
