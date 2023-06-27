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
exports.statsRouter = void 0;
var express_1 = require("express");
var models_1 = require("./../dataBase/models");
exports.statsRouter = (0, express_1.Router)({ strict: true });
var getStatDifferences = function (intakeData, stat) {
    var energyValueDifference = {
        calories: 0,
        proteines: 0,
        fats: 0,
        carbohydrates: 0
    };
    if (!intakeData) {
        return energyValueDifference;
    }
    for (var key in energyValueDifference) {
        energyValueDifference[key] = stat[key] - intakeData[key];
    }
    return energyValueDifference;
};
var mergeMealDataToMainStat = function (meal, mainStat) {
    var newMainStat = {
        weight: 0,
        price: 0,
        energyValue: {
            calories: 0,
            proteines: 0,
            fats: 0,
            carbohydrates: 0
        }
    };
    newMainStat.weight = mainStat.weight + (meal.weight || 0);
    newMainStat.price = mainStat.price + (meal.price || 0);
    newMainStat.energyValue.calories = mainStat.energyValue.calories + (meal.energyValue.calories || 0);
    newMainStat.energyValue.proteines = mainStat.energyValue.proteines + (meal.energyValue.proteines || 0);
    newMainStat.energyValue.fats = mainStat.energyValue.fats + (meal.energyValue.fats || 0);
    newMainStat.energyValue.carbohydrates = mainStat.energyValue.carbohydrates + (meal.energyValue.carbohydrates || 0);
    return newMainStat;
};
var createDailyStatObjectFromMealsArray = function (intakeData, dailyMealsArray, key) {
    var dailyStatObject = {
        dateString: key,
        meals: [],
        weight: 0,
        price: 0,
        energyValue: {
            calories: 0,
            proteines: 0,
            fats: 0,
            carbohydrates: 0
        },
        energyValueDifference: {
            calories: 0,
            proteines: 0,
            fats: 0,
            carbohydrates: 0
        }
    };
    console.log('dailyMealsArray', dailyMealsArray);
    for (var i = 0; i < dailyMealsArray.length; i++) {
        var _a = dailyMealsArray[i], _id = _a._id, weight = _a.weight, price = _a.price, name_1 = _a.name, energyValue = _a.energyValue;
        dailyStatObject.meals.push({ _id: _id, name: name_1, weight: weight, price: price, energyValue: energyValue });
        dailyStatObject.weight += weight;
        dailyStatObject.price += price;
        dailyStatObject.energyValue.calories += energyValue.calories;
        dailyStatObject.energyValue.proteines += energyValue.proteines;
        dailyStatObject.energyValue.fats += energyValue.fats;
        dailyStatObject.energyValue.carbohydrates += energyValue.carbohydrates;
    }
    console.log('dailyStatObject', dailyStatObject);
    dailyStatObject.energyValueDifference = getStatDifferences(intakeData, dailyStatObject.energyValue);
    return dailyStatObject;
};
var createStatFromMealsArray = function (intakeData, mealsArray) {
    var statObject = {
        mainStat: {
            weight: 0,
            price: 0,
            energyValue: {
                calories: 0,
                proteines: 0,
                fats: 0,
                carbohydrates: 0
            }
        },
        statArray: []
    };
    if (!mealsArray.length) {
        return statObject;
    }
    var tempObjectDateKey = {};
    // fill tempObjectDateKey
    for (var key in mealsArray) {
        var currentMeal = mealsArray[key];
        //fill mainStat
        statObject.mainStat = mergeMealDataToMainStat(currentMeal, statObject.mainStat);
        var dateStringKey = currentMeal.dateString;
        if (!tempObjectDateKey[dateStringKey]) {
            tempObjectDateKey[dateStringKey] = [currentMeal];
        }
        else {
            tempObjectDateKey[dateStringKey].push(currentMeal);
        }
    }
    console.log('tempObjectDateKey', tempObjectDateKey);
    for (var key in tempObjectDateKey) {
        var dailyMealsArray = tempObjectDateKey[key];
        console.log('dailyMealsArray', dailyMealsArray);
        var dailyStat = createDailyStatObjectFromMealsArray(intakeData, dailyMealsArray, key);
        statObject.statArray.push(dailyStat);
    }
    return statObject;
};
// api/stats/get_all
exports.statsRouter.get('/get_all', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, mealsArray, statObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body.user;
                return [4 /*yield*/, models_1.Meal.find({ owner: user._id }).select('_id name weight price energyValue dateString')];
            case 1:
                mealsArray = _a.sent();
                statObject = createStatFromMealsArray(user.intakeData.energyValue, mealsArray);
                return [2 /*return*/, res.status(201).json(statObject)];
        }
    });
}); });
// api/stats/get_stat_for_interval
exports.statsRouter.post('/get_stat_for_interval', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, interval, mealsArray, statObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, interval = _a.interval;
                return [4 /*yield*/, models_1.Meal.find({
                        owner: user._id,
                        createdAt: { $gte: interval.from, $lte: interval.to }
                    }).select('_id name weight price energyValue dateString')];
            case 1:
                mealsArray = _b.sent();
                statObject = createStatFromMealsArray(user.intakeData.energyValue, mealsArray);
                return [2 /*return*/, res.status(201).json(statObject)];
        }
    });
}); });
// api/stats/get_stat_for_day
exports.statsRouter.post('/get_stat_for_day', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, dateString, mealsArray, statObject;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, user = _a.user, dateString = _a.dateString;
                return [4 /*yield*/, models_1.Meal.find({ owner: user._id, dateString: dateString }).select('_id name weight price energyValue dateString')];
            case 1:
                mealsArray = _b.sent();
                statObject = createStatFromMealsArray(user.intakeData.energyValue, mealsArray);
                return [2 /*return*/, res.status(201).json(statObject)];
        }
    });
}); });
