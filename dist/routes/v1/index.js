"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = __importDefault(require("../../routes/v1/auth"));
const user_1 = __importDefault(require("../../routes/v1/user"));
const blog_1 = __importDefault(require("../../routes/v1/blog"));
const like_1 = __importDefault(require("../../routes/v1/like"));
const comment_1 = __importDefault(require("../../routes/v1/comment"));
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Api ola good leme!!',
        status: 'ok',
        version: '1.0.0',
        docs: 'https://docs.blog-api.argyrioswebapi.com',
        timeStamp: new Date().toISOString(),
    });
});
router.use('/auth', auth_1.default);
router.use('/users', user_1.default);
router.use('/blogs', blog_1.default);
router.use('/likes', like_1.default);
router.use('/comments', comment_1.default);
exports.default = router;
