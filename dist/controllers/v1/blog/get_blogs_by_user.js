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
const config_1 = __importDefault(require("../../../config"));
const winston_1 = require("../../../lib/winston");
const blog_1 = __importDefault(require("../../../models/blog"));
const user_1 = __importDefault(require("../../../models/user"));
const getBlogsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.userId;
        const limit = parseInt(req.query.limit) || config_1.default.defaultResLimit;
        const offset = parseInt(req.query.offset) || config_1.default.defaultResOffset;
        const query = {};
        const userId = req.params.userId;
        const currentUser = yield user_1.default.findById(currentUserId)
            .select('role')
            .exec();
        if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'user') {
            query.status = 'published';
        }
        const total = yield blog_1.default.countDocuments(Object.assign({ author: userId }, query));
        const blogs = yield blog_1.default.find(Object.assign({ author: userId }, query))
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        res.status(200).json({
            limit,
            offset,
            total,
            blogs,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error while fetching blogs by user', err);
    }
});
exports.default = getBlogsByUser;
