"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    blog: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        maxLength: [1000, 'Content must be less than 1000 characters'],
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    replies: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Comment',
        default: [],
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Comment', commentSchema);
