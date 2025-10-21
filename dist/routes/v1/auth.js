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
const register_1 = __importDefault(require("../../controllers/v1/auth/register"));
const login_1 = __importDefault(require("../../controllers/v1/auth/login"));
const logout_1 = __importDefault(require("../../controllers/v1/auth/logout"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const refresh_token_1 = __importDefault(require("../../controllers/v1/auth/refresh_token"));
const router = (0, express_1.Router)();
const validationError_1 = __importDefault(require("../../middlewares/validationError"));
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const user_1 = __importDefault(require("../../models/user"));
router.post('/register', (0, express_validator_1.body)('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.default.exists({ email: value });
    if (userExists) {
        throw new Error('User already exists');
    }
})), (0, express_validator_1.body)('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters long'), (0, express_validator_1.body)('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'), validationError_1.default, register_1.default);
router.post('/login', (0, express_validator_1.body)('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.default.exists({ email: value });
    if (!userExists) {
        throw new Error('User email or password is invalid');
    }
})), (0, express_validator_1.body)('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 7 })
    .withMessage('Password must be at least 7 characters long')
    .custom((value_1, _a) => __awaiter(void 0, [value_1, _a], void 0, function* (value, { req }) {
    const { email } = req.body;
    const user = yield user_1.default.findOne({ email })
        .select('password')
        .lean()
        .exec();
    if (!user) {
        throw new Error('User email or password is invalid');
    }
    const passwordMatch = yield bcrypt_1.default.compare(value, user.password);
    if (!passwordMatch) {
        throw new Error('User email or password is invalid');
    }
})), validationError_1.default, login_1.default);
router.post('/refresh-token', (0, express_validator_1.cookie)('refreshToken')
    .notEmpty()
    .withMessage('Refresh token expired')
    .isJWT()
    .withMessage('Invalid refresh token'), validationError_1.default, refresh_token_1.default);
router.post('/logout', authenticate_1.default, logout_1.default);
exports.default = router;
