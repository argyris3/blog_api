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
const config_1 = __importDefault(require("../../../config"));
const comment_1 = __importDefault(require("../../../models/comment"));
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offset = config_1.default.defaultResOffset, limit = config_1.default.defaultResLimit } = req.query;
    try {
        const comments = yield comment_1.default.find()
            .populate('blog', 'banner.url title slug')
            .populate('user', 'username email firstName lastName')
            .limit(Number(limit))
            .skip(Number(offset))
            .lean()
            .exec();
        const total = yield comment_1.default.countDocuments();
        res.status(200).json({
            offset: Number(offset),
            limit: Number(limit),
            total,
            comments,
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
exports.default = getComments;
