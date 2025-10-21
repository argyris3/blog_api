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
const comment_1 = __importDefault(require("../../../models/comment"));
const getCommentsByBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    try {
        const blog = yield blog_1.default.findOne({ slug }).select('_id').exec();
        if (!blog) {
            res.status(404).json({
                code: 'NotFound',
                message: 'Blog not found!',
            });
            return;
        }
        const allComments = yield comment_1.default.find({ blog: blog._id })
            .populate('blog', 'banner.url title slug')
            .populate('user', 'username firstName lastName')
            .lean()
            .exec();
        res.status(201).json({
            comments: allComments,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error retrieving comments', err);
    }
});
exports.default = getCommentsByBlog;
