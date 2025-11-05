"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const like_blog_1 = __importDefault(require("../../controllers/v1/like/like_blog"));
const unlike_blog_1 = __importDefault(require("../../controllers/v1/like/unlike_blog"));
const router = (0, express_1.Router)();
router.post('/blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), like_blog_1.default);
router.delete('/blog/:blogId', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), unlike_blog_1.default);
exports.default = router;
