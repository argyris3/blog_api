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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("../../../lib/winston");
const blog_1 = __importDefault(require("../../../models/blog"));
const user_1 = __importDefault(require("../../../models/user"));
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, banner, status } = req.body;
        const userId = req.userId;
        const slug = req.params.slug;
        const user = yield user_1.default.findById(userId).select('role').exec();
        const blog = yield blog_1.default.findOne({ slug }).select('-__v').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found',
            });
            return;
        }
        if (blog.author !== userId && (user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
            res.status(403).json({
                code: 'AuthorizationError',
                message: 'Access denied, insufficient permissions',
            });
            winston_1.logger.warn('A user tried to update a blog without permission', {
                userId,
                blog,
            });
            return;
        }
        if (title)
            blog.title = title;
        if (content)
            blog.content = content;
        if (banner)
            blog.banner = banner;
        if (status)
            blog.status = status;
        yield blog.save();
        winston_1.logger.info('Blog updated', {
            blog,
        });
        res.status(200).json({
            blog,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error while updating blog', err);
    }
});
exports.default = updateBlog;
