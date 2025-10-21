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
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        masLength: [20, 'Username must be less than 20 characters'],
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxLength: [50, 'Email must be less than 50 characters'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['admin', 'user'],
            message: '{VALUE} is not supported',
        },
        default: 'user',
    },
    firstName: {
        type: String,
        maxLength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
        type: String,
        maxLength: [20, 'Lat name must be less than 20 characters'],
    },
    socialLinks: {
        website: {
            type: String,
            maxLength: [100, 'Website address must be less than 100 characters'],
        },
        facebook: {
            type: String,
            maxLength: [
                100,
                'Facebook profile url must be less than 100 characters',
            ],
        },
        instagram: {
            type: String,
            maxLength: [
                100,
                'Instagram profile url  must be less than 100 characters',
            ],
        },
        x: {
            type: String,
            maxLength: [100, 'X profile url  must be less than 100 characters'],
        },
        linkedin: {
            type: String,
            maxLength: [
                100,
                'Linkedin profile url  must be less than 100 characters',
            ],
        },
        youtube: {
            type: String,
            maxLength: [
                100,
                'Youtube channel url  must be less than 100 characters',
            ],
        },
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
            return;
        }
        this.password = yield bcrypt_1.default.hash(this.password, 10);
        next();
    });
});
exports.default = (0, mongoose_1.model)('User', userSchema);
