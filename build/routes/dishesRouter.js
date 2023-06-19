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
exports.dishesRouter = void 0;
var express_1 = require("express");
var models_1 = require("./../dataBase/models");
exports.dishesRouter = (0, express_1.Router)({ strict: true });
var updateUserDishes = function (res, userId, dishes) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, models_1.User.updateOne({ _id: userId }, { dishes: dishes })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.status(201).json(dishes)];
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
// api/dishes/get_all
exports.dishesRouter.get('/get_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = req.body.user;
        return [2 /*return*/, res.status(200).json(user.dishes)];
    });
}); });
// api/dishes/product/:id
exports.dishesRouter.get('/dish/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, dish;
    return __generator(this, function (_a) {
        user = req.body.user;
        dish = user.dishes.find(function (dish) { return dish.id == req.params.id; });
        if (!dish) {
            return [2 /*return*/, res.status(400).json({
                    message: "No such dish"
                })];
        }
        res.status(201).json({ dish: dish });
        return [2 /*return*/];
    });
}); });
// api/dishes/add
exports.dishesRouter.post('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, dish, dishes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, dish = _a.dish;
                if (!dish) {
                    res.status(400).json({ message: "Dish is null" });
                }
                dishes = __spreadArray(__spreadArray([], user.dishes, true), [dish], false);
                return [4 /*yield*/, updateUserDishes(res, user._id, dishes)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); });
// api/dishes/update
exports.dishesRouter.put('/update', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, dish, dishes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, dish = _a.dish;
                dishes = user.dishes.map(function (userDish) { return userDish.id == dish.id ? dish : userDish; });
                return [4 /*yield*/, updateUserDishes(res, user._id, dishes)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); });
// api/dishes/remove
exports.dishesRouter.delete('/remove', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, dishId, dishes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, dishId = _a.dishId;
                dishes = user.dishes.filter(function (dish) {
                    return dish.id != dishId;
                });
                return [4 /*yield*/, updateUserDishes(res, user._id, dishes)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); });
// api/dishes/remove_all
exports.dishesRouter.delete('/remove_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, dishes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                dishes = [];
                return [4 /*yield*/, updateUserDishes(res, user._id, dishes)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
