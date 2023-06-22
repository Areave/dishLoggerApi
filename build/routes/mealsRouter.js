"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mealsRouter = void 0;
var express_1 = require("express");
var models_1 = require("./../dataBase/models");
var mongodb_1 = require("mongodb");
exports.mealsRouter = (0, express_1.Router)({ strict: true });
var createObjectId = function (id) {
    var objectId;
    try {
        objectId = new mongodb_1.ObjectId(id);
    }
    catch (error) {
        throw new Error();
    }
    return objectId;
};
var updateUserMeals = function (res, userId, meals) { return __awaiter(void 0, void 0, void 0, function () {
    var updatedMeals, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Promise.all([models_1.User.updateOne({ _id: userId }, { meals: meals }),
                        models_1.Meal.find({ owner: userId })
                            // .populate('ingridients')
                            //     .populate({
                            //         path: 'dishes',
                            //         populate: { path: 'products' }})
                            .populate({
                            path: 'ingridients',
                            populate: { path: 'products' }
                        })
                            .populate({
                            path: 'ingridients',
                            populate: { path: 'dishes' }
                        })
                            // .populate('ingridients')
                            // .populate('ingridients.dishes')
                            .select('-owner')])];
            case 1:
                updatedMeals = _a.sent();
                return [2 /*return*/, res.status(201).json(updatedMeals[1])];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, res.status(500).json({
                        message: "Database problems",
                        stack: error_1.stackTrace
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
// api/meals/get_all
exports.mealsRouter.get('/get_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, userMeals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                return [4 /*yield*/, models_1.Meal.find({ owner: user._id }).populate('dishes').populate('products')];
            case 1:
                userMeals = _a.sent();
                return [2 /*return*/, res.status(200).json(userMeals)];
        }
    });
}); });
// api/meals/meal/:id
exports.mealsRouter.get('/meal/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, objectId, meal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                try {
                    objectId = createObjectId(req.params.id);
                }
                catch (error) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Bad ID link',
                            stack: error.stackTrace
                        })];
                }
                return [4 /*yield*/, models_1.Meal.findOne({ owner: user._id, _id: objectId }).populate({
                        path: 'ingridients', populate: [
                            {
                                path: 'dishes',
                                select: 'name',
                            },
                        ]
                    })];
            case 1:
                meal = _a.sent();
                if (!meal) {
                    return [2 /*return*/, res.status(400).json({
                            message: "No such meal"
                        })];
                }
                res.status(201).json(meal);
                return [2 /*return*/];
        }
    });
}); });
// api/meals/add
exports.mealsRouter.post('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, meal, candidate, newItem, meals;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, meal = _a.meal;
                if (!meal) {
                    res.status(400).json({ message: "Meal is null" });
                }
                meal.owner = user._id;
                return [4 /*yield*/, models_1.Meal.findOne({ name: meal.name, owner: user._id })];
            case 1:
                candidate = _b.sent();
                if (candidate) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Duplicate name: " + meal.name
                        })];
                }
                return [4 /*yield*/, models_1.Meal.create(__assign({}, meal))];
            case 2:
                newItem = _b.sent();
                meals = __spreadArray(__spreadArray([], user.meals, true), [newItem._id], false);
                return [4 /*yield*/, updateUserMeals(res, user._id, meals)];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); });
// api/meals/update
exports.mealsRouter.put('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, meal, meals;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, meal = _a.meal;
                meal.owner = user._id;
                return [4 /*yield*/, models_1.Meal.updateOne({ _id: meal._id }, __assign({}, meal))];
            case 1:
                _b.sent();
                return [4 /*yield*/, models_1.Meal.find({ owner: user._id }).populate('products').select('-owner')];
            case 2:
                meals = _b.sent();
                return [2 /*return*/, res.status(201).json(meals)];
        }
    });
}); });
// api/meals/remove
exports.mealsRouter.delete('/remove', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, mealId, objectId, meals;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, mealId = _a.mealId;
                try {
                    objectId = createObjectId(mealId);
                }
                catch (error) {
                    return [2 /*return*/, res.status(400).json({
                            message: 'Bad ID link',
                            stack: error.stackTrace
                        })];
                }
                return [4 /*yield*/, models_1.Meal.deleteOne({ _id: objectId })];
            case 1:
                _b.sent();
                meals = user.meals.filter(function (meal) {
                    return meal._id != mealId;
                });
                return [4 /*yield*/, updateUserMeals(res, user._id, meals)];
            case 2: return [2 /*return*/, _b.sent()];
        }
    });
}); });
// api/meals/remove_all
exports.mealsRouter.delete('/remove_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, meals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                return [4 /*yield*/, models_1.Meal.deleteMany({ owner: user._id })];
            case 1:
                _a.sent();
                meals = [];
                return [4 /*yield*/, updateUserMeals(res, user._id, meals)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); });
