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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validationError_1 = __importDefault(require("../../middlewares/validationError"));
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const get_current_user_1 = __importDefault(require("../../controllers/v1/user/get_current_user"));
const update_current_user_1 = __importDefault(require("../../controllers/v1/user/update_current_user"));
const delete_current_user_1 = __importDefault(require("../../controllers/v1/user/delete_current_user"));
const get_all_user_1 = __importDefault(require("../../controllers/v1/user/get_all_user"));
const get_user_1 = __importDefault(require("../../controllers/v1/user/get_user"));
const delete_user_1 = __importDefault(require("../../controllers/v1/user/delete_user"));
const user_1 = __importDefault(require("../../models/user"));
const router = (0, express_1.Router)();
router.get('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), get_current_user_1.default);
router.put('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), (0, express_validator_1.body)('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.default.exists({ username: value });
    if (userExists) {
        throw Error('This username is already in use');
    }
})), (0, express_validator_1.body)('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield user_1.default.exists({ email: value });
    if (userExists) {
        throw Error('This email is already in use');
    }
})), (0, express_validator_1.body)('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'), (0, express_validator_1.body)('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'), (0, express_validator_1.body)('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'), (0, express_validator_1.body)(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('Website URL must be less than 100 characters'), validationError_1.default, update_current_user_1.default);
router.delete('/current', authenticate_1.default, (0, authorize_1.default)(['admin', 'user']), delete_current_user_1.default);
router.get('/', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.query)('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'), (0, express_validator_1.query)('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Page must be a positive integer'), validationError_1.default, get_all_user_1.default);
router.get('/:userId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), validationError_1.default, get_user_1.default);
router.delete('/:userId', authenticate_1.default, (0, authorize_1.default)(['admin']), (0, express_validator_1.param)('userId').notEmpty().isMongoId().withMessage('Invalid user ID'), validationError_1.default, delete_user_1.default);
exports.default = router;
