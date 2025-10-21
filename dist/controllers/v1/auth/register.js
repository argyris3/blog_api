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
const utils_1 = require("../../../utils");
const jwt_1 = require("../../../lib/jwt");
const token_1 = __importDefault(require("../../../models/token"));
const user_1 = __importDefault(require("../../../models/user"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    if (role === 'admin' && !config_1.default.WHITELIST_ADMINS_MAIL.includes(email)) {
        res.status(403).json({
            code: 'AuthorizationError',
            message: 'You cannot register as an admin',
        });
        winston_1.logger.warn(`User with email ${email} tried to register as an admin but is not in the whitelist`);
        return;
    }
    try {
        const username = (0, utils_1.genUsername)();
        const newUser = yield user_1.default.create({
            username,
            email,
            password,
            role,
        });
        const accessToken = (0, jwt_1.generateAccessToken)(newUser._id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(newUser._id);
        yield token_1.default.create({
            token: refreshToken,
            userId: newUser._id,
        });
        winston_1.logger.info('Refresh Token created for user', {
            userId: newUser._id,
            token: refreshToken,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config_1.default.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            accessToken,
        });
        winston_1.logger.info('User registered successfully', {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
        });
    }
    catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal server error',
            error: err,
        });
        winston_1.logger.error('Error during registration', err);
    }
});
exports.default = register;
