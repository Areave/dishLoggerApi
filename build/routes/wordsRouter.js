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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordsRouter = void 0;
var express_1 = require("express");
var models_1 = require("../dataBase/models");
var authMiddleware_1 = require("./middlewares/authMiddleware");
exports.wordsRouter = (0, express_1.Router)({ strict: true });
// words/create
exports.wordsRouter.post('/create', authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // try {
        //     const {word, translation, language, telegramNickname} = req.body;
        //     const existingInstance = await Word.findOne({word});
        //     if (existingInstance) {
        //         return res.status(400).json({message: 'word is already exist in database'});
        //     }
        //     const isUserExist = await User.findOne({telegramNickname});
        //     let user;
        //     if (!isUserExist) {
        //         user = new User({
        //             telegramNickname
        //         });
        //         await user.save();
        //     } else {
        //         user = isUserExist;
        //     }
        //     const newWord = new Word({word, translation, language, owner: user});
        //     await newWord.save();
        //     res.status(201).json({message: 'word added'});
        // } catch (error) {
        //     console.log('from server', error.message);
        return [2 /*return*/, res.status(500).json({ message: 'error.message' })];
    });
}); });
// words/get
exports.wordsRouter.get('/get', authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var telegramNickname, user, wordsArray, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('server words/get');
                telegramNickname = req.body.telegramNickname;
                return [4 /*yield*/, models_1.User.findOne({ telegramNickname: telegramNickname })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(401).json({ message: 'user ' + telegramNickname + ' not found' });
                }
                return [4 /*yield*/, models_1.Word.find({ owner: user })];
            case 2:
                wordsArray = _a.sent();
                return [2 /*return*/, res.status(201).json({ message: 'words was found', wordsArray: wordsArray })];
            case 3:
                error_1 = _a.sent();
                console.log('from server words/get', error_1.message);
                res.status(500).json({ message: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// words/get/:id
exports.wordsRouter.get('/get/:id', authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var word, telegramNickname, user, existingInstance, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                word = req.params.id;
                telegramNickname = req.body.telegramNickname;
                return [4 /*yield*/, models_1.User.findOne({ telegramNickname: telegramNickname })];
            case 1:
                user = _a.sent();
                if (!user) {
                    res.status(401).json({ message: 'user ' + telegramNickname + ' not found' });
                }
                return [4 /*yield*/, models_1.Word.findOne({ word: word, owner: user })];
            case 2:
                existingInstance = _a.sent();
                if (!!existingInstance) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Word.findOne({ translation: word, owner: user })];
            case 3:
                existingInstance = _a.sent();
                _a.label = 4;
            case 4:
                if (existingInstance) {
                    return [2 /*return*/, res.status(201).json({ message: 'word was found', word: existingInstance })];
                }
                return [2 /*return*/, res.status(400).json({ message: 'no such word in database' })];
            case 5:
                error_2 = _a.sent();
                console.log('from server', error_2.message);
                res.status(500).json({ message: error_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// words/update
exports.wordsRouter.patch('/update', authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, word, translation, language, telegramNickname, existingInstance, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, word = _a.word, translation = _a.translation, language = _a.language, telegramNickname = _a.telegramNickname;
                return [4 /*yield*/, models_1.Word.findOne({ word: word, owner: { telegramNickname: telegramNickname } })];
            case 1:
                existingInstance = _b.sent();
                if (!existingInstance) {
                    return [2 /*return*/, res.status(400).json({ message: 'word is not exist in database' })];
                }
                return [4 /*yield*/, models_1.Word.updateOne({ word: word, translation: translation, language: language })];
            case 2:
                _b.sent();
                res.status(201).json({ message: 'word updated in database' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.log('from server', error_3.message);
                res.status(500).json({ message: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// words/remove
exports.wordsRouter.delete('/remove', authMiddleware_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, word, telegramNickname, user, existingInstance, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, word = _a.word, telegramNickname = _a.telegramNickname;
                return [4 /*yield*/, models_1.User.findOne({ telegramNickname: telegramNickname })];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(401).json({ message: 'user ' + telegramNickname + ' not found' });
                }
                return [4 /*yield*/, models_1.Word.findOne({ word: word, owner: user })];
            case 2:
                existingInstance = _b.sent();
                if (!existingInstance) {
                    return [2 /*return*/, res.status(400).json({ message: 'word is not exist in database' })];
                }
                return [4 /*yield*/, models_1.Word.deleteOne({ word: word, owner: user })];
            case 3:
                _b.sent();
                res.status(201).json({ message: 'word removed from database' });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                console.log('from server', error_4.message);
                res.status(500).json({ message: error_4.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
