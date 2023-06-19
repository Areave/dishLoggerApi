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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var express_1 = require("express");
var models_1 = require("./../dataBase/models");
var dotenv_1 = __importDefault(require("dotenv"));
var express_validator_1 = require("express-validator");
var generateToken_1 = __importDefault(require("../utils/generateToken"));
var authMiddleware_1 = require("./middlewares/authMiddleware");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
exports.authRouter = (0, express_1.Router)({ strict: true });
// api/auth/registration
exports.authRouter.post('/registration', [
    (0, express_validator_1.check)('login', 'Login can\'t be empty').notEmpty(),
    (0, express_validator_1.check)('password', 'Password has to be at least 2 chars long').isLength({ min: 2 }),
], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var registrationErrors, _a, login, password, name_1, user, newUser, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                registrationErrors = (0, express_validator_1.validationResult)(req);
                if (!registrationErrors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({
                            errors: registrationErrors.array(),
                            message: 'Registration error'
                        })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                _a = req.body, login = _a.login, password = _a.password, name_1 = _a.name;
                return [4 /*yield*/, models_1.User.findOne({ login: login })];
            case 2:
                user = _b.sent();
                if (user) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'User already exists'
                        })];
                }
                return [4 /*yield*/, models_1.User.create({ login: login, name: name_1, password: password })];
            case 3:
                newUser = _b.sent();
                (0, generateToken_1.default)(res, newUser._id);
                res.status(201).json({ message: 'User created successfully', user: { login: login, name: name_1 } });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.log('from authRouter', error_1.message);
                res.status(500).json({ message: 'Database problems', stack: error_1.stackTrace });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// api/auth/login
exports.authRouter.post('/login', [
    (0, express_validator_1.check)('login', 'Login can\'t be empty').notEmpty(),
    (0, express_validator_1.check)('password', 'Password can\'t be empty').notEmpty(),
], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loginErrors, _a, login, password, user, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (req.cookies.jwt) {
                    return [2 /*return*/, res.status(200).json({ message: 'You are already logged in' })];
                }
                loginErrors = (0, express_validator_1.validationResult)(req);
                if (!loginErrors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({
                            errors: loginErrors.array(),
                            message: 'Login error'
                        })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                _a = req.body, login = _a.login, password = _a.password;
                return [4 /*yield*/, models_1.User.findOne({ login: login })];
            case 2:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 4];
                return [4 /*yield*/, user.matchPassword(password)];
            case 3:
                _b = !(_c.sent());
                _c.label = 4;
            case 4:
                // @ts-ignore
                if (_b) {
                    return [2 /*return*/, res.status(400).json({ message: 'No such a user' })];
                }
                (0, generateToken_1.default)(res, user._id);
                delete user.password;
                user.password = '';
                res.status(200).json({ message: 'You successfully logged in', user: user });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _c.sent();
                console.log('from authRouter', error_2.message);
                res.status(500).json({
                    message: 'Database error',
                    stack: error_2.stackTrace
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// api/auth/logout
exports.authRouter.post('/logout', function (req, res) {
    if (req.cookies.jwt) {
        res.cookie('jwt', '', {
            httpOnly: true,
            // @ts-ignore
            expired: new Date(0),
        });
        res.status(200).json({ message: 'Successfully logged out' });
    }
    else {
        res.status(200).json({ message: 'You are already logged out' });
    }
});
// api/auth/get
exports.authRouter.get('/get', authMiddleware_1.protect, function (req, res) {
    res.status(200).json({ user: req.body.user });
});
// api/auth/update
exports.authRouter.put('/update', authMiddleware_1.protect, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, newUser, _b, _c, _d, _e, updatedUser, error_3;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = req.body, user = _a.user, newUser = _a.newUser;
                _f.label = 1;
            case 1:
                _f.trys.push([1, 6, , 7]);
                if (!newUser.password) return [3 /*break*/, 4];
                _b = newUser;
                _d = (_c = bcryptjs_1.default).hash;
                _e = [newUser.password];
                return [4 /*yield*/, bcryptjs_1.default.genSalt(10)];
            case 2: return [4 /*yield*/, _d.apply(_c, _e.concat([_f.sent()]))];
            case 3:
                _b.password = _f.sent();
                _f.label = 4;
            case 4: return [4 /*yield*/, models_1.User.findOneAndUpdate({ _id: user._id }, newUser, {
                    new: true
                }).select('-password')];
            case 5:
                updatedUser = _f.sent();
                if (newUser.password || newUser.login) {
                    res.cookie('jwt', '', {
                        httpOnly: true,
                        // @ts-ignore
                        expired: new Date(0),
                    });
                    return [2 /*return*/, res.status(201).json({ message: 'User data was updated, login again' })];
                }
                res.status(201).json({ user: updatedUser });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _f.sent();
                return [2 /*return*/, res.status(500).json({
                        message: "Database problems",
                        stack: error_3.stackTrace
                    })];
            case 7: return [2 /*return*/];
        }
    });
}); });
// api/auth/delete_all
exports.authRouter.delete('/delete_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.User.deleteMany({})];
            case 1:
                _a.sent();
                res.status(200).json({ message: 'Users was deleted' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.log('from authRouter', error_4.message);
                res.status(500).json({
                    message: 'Database error',
                    stack: error_4.stackTrace
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// api/auth/get_all
exports.authRouter.get('/get_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.User.find()];
            case 1:
                users = _a.sent();
                res.status(200).json({ users: users });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.log('from authRouter', error_5.message);
                res.status(500).json({
                    message: 'Database error',
                    stack: error_5.stackTrace
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
