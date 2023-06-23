"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var listOfEntity_1 = __importDefault(require("../utils/listOfEntity"));
var rebaseIngridients = function (instanceArray) {
    if (!instanceArray.length) {
        return instanceArray;
    }
    console.log('instanceArray[0]', instanceArray[0]);
    instanceArray.forEach(function (instance) {
        var ingridientsIds = instance.ingridientsIds;
        var ingridientsAmount = instance.ingridientsAmount;
        var ingridients = [];
        listOfEntity_1.default.forEach(function (entityKey) {
            if (!ingridientsIds[entityKey]) {
                return;
            }
            ingridientsIds[entityKey].forEach(function (ingridientObject, index) {
                ingridients.push({ ingridient: ingridientObject, amount: ingridientsAmount[entityKey][index] });
            });
        });
        instance.ingridientsIds = [];
        instance.ingridientsAmount = [];
        instance.ingridients = ingridients;
    });
    return instanceArray;
};
exports.default = rebaseIngridients;
